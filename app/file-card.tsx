import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"

export function FileCard({ file }: { file: Doc<"files"> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{file.name}</CardTitle>
                {/*<CardDescription>Card Description</CardDescription>*/}
            </CardHeader>

            <CardContent>
                <p>Date: //</p>
            </CardContent>

            <CardFooter>
                <Button className="mr-4"> Download </Button>
                <Button> Delete </Button>
            </CardFooter>
        </Card>
    )
}