"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton, useOrganization, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";

import UploadButton from "../../upload-button";
import { FileCard } from "../../file-card";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "../../search-bar";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/*------------------------ MAIN ------------------------*/

function Placeholder() {
  return (<div className="flex flex-col gap-8 w-full items-center mt-12">
    <Image
      alt="an image of a picture and directory icon"
      width="300"
      height="300"
      src="/empty.svg"
    />
    <div className="text-2xl">
      No Data!
    </div>
  </div>)
}

function PlaceholderSignIn() {
  return (<div className="flex flex-col gap-8 w-full items-center mt-12">
    <Image
      alt="an image of a picture and directory icon"
      width="300"
      height="300"
      src="/signin.svg"
    />
    <SignInButton>
      Sign In to get Started !
    </SignInButton>
  </div>)
}

export default function Home() {

  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query } : "skip");

  const isLoading = files === undefined;
  const isloggedIn = orgId === undefined;

  return (

    <main className="container mx-auto pt-12">

      <div className="flex gap-8">

        <div className="w-40 flex flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant={"link"} className="flex gap-2"><FileIcon />All Files</Button>
          </Link>

        </div>

        <div className="w-full">

          {/* Loading state when files are undefined */}

          {isLoading && (
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              {isloggedIn ? (
                <PlaceholderSignIn />
              ) : (
                <>
                  <Loader2 className="h-32 w-32 animate-spin text-gray-800" />
                  <div className="text-2xl">Loading...</div>
                </>
              )}
            </div>
          )}

          {/* State when files are present */}

          {!isLoading && (
            <>
              <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold">
                  Your Study Resources 📚
                </h1>
                <SearchBar query={query} setQuery={setQuery} />
                <UploadButton />
              </div>

              {files.length === 0 && (
                <Placeholder />
              )}

              <div className="grid grid-cols-4 gap-4">
                {files?.map(file => {
                  return <FileCard key={file._id} file={file} />
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
