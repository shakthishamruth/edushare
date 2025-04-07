"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner"

import { Doc } from "@/convex/_generated/dataModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z.
        custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, `Required`),
})

/*------------------------ MAIN ------------------------*/

export default function UploadButton() {

    const organization = useOrganization();
    const user = useUser();

    /* ------------------------ file upload  ------------------------*/
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // 
        console.log(values);
        console.log(values.file);
        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const fileType = values.file[0].type;

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });

        const { storageId } = await result.json();

        const types = {
            'image/png': 'image',
            'application/pdf': 'pdf',
            'text/csv': 'csv'
        } as Record<string, Doc<"files">["type"]>;

        try {
            createFile(
                {
                    name: values.title,
                    fileId: storageId,
                    orgId,
                    type: types[fileType],
                }
            )

            form.reset();
            setIsFileDialogOpen(false);

            toast(values.title + " uploaded successfully!");
        }

        catch {
            toast("Opps Something went wrong!");
        }
    }

    /* ------------------------ File upload ends ------------------------ */

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const createFile = useMutation(api.files.createFile);

    return (
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
        }}>
            <DialogTrigger asChild><Button onClick={() => {

            }}>
                Upload
            </Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload your file here</DialogTitle>
                    <DialogDescription>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ }) => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input type="file" {...fileRef} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={form.formState.isSubmitting}
                                    className="flex gap-1">
                                    {form.formState.isSubmitting && (<Loader2 className="h-4 w-4 animate-spin" />)}Submit</Button>
                            </form>
                        </Form>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    );
}
