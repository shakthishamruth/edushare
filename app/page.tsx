"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignedOut, useOrganization, useUser } from "@clerk/clerk-react";
import { SignedIn, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {

  const session = useSession();

  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        {files?.map(file => {
          return <div key={file._id}>{file.name}</div>
        })}

        <Button onClick={() => {
          if (!orgId) return;
          createFile(
            {
              name: "hello world",
              orgId,
            }
          )
        }}>
          click me
        </Button>

      </main>
    </div>
  );
}
