"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignedOut } from "@clerk/clerk-react";
import { SignedIn, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";

export default function Home() {

  const session = useSession();

  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SignedIn>
          <SignOutButton>
            <Button>
              Sign Out
            </Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        {files?.map(file => {
          return <div key={file._id}>{file.name}</div>
        })}

        <Button onClick={() => {
          createFile(
            {
              name: "hello world"
            }
          )
        }}>
          click me
        </Button>

      </main>
    </div>
  );
}
