"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { SetStateAction, useState } from "react";

/*------------------------ MAIN ------------------------*/

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

  return (

    <main className="container mx-auto pt-12">

      {/* Loading state when files are undefined */}

      {isLoading &&
        (<div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-800" />
          <div className="text-2xl"> Loading... </div>
        </div>)}

      {/* State when files are empty */}

      {!isLoading && !query && files.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl">
            You have no files, go ahead and upload one now!</div>
          <UploadButton />
        </div>
      )}

      {/* State when files are present */}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">

            <h1 className="text-4xl font-bold">
              Your Study Resources 📚
            </h1>
            <SearchBar query={query} setQuery={setQuery} />
            <UploadButton />
          </div>

          {!query && files.length === 0 && (
            <div className="flex flex-col gap-8 w-full items-center mt-12">
              <Image
                alt="an image of a picture and directory icon"
                width="300"
                height="300"
                src="/empty.svg"
              />
              <div className="text-2xl">
                You have no files, go ahead and upload one now!</div>
              <UploadButton />
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            {files?.map(file => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
      )}

    </main>
  );
}
