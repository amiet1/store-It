import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

type PageProps = {
  params: Promise<{ type?: string }>;
  searchParams?: Promise<{ query?: string; sort?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const type = ((await params)?.type ?? "").toString();
  const searchText = ((await searchParams)?.query ?? "").toString();
  const sort = ((await searchParams)?.sort ?? "$createdAt-desc").toString();

  const types = getFileTypesParams(type) as FileType[];

  let files: Awaited<ReturnType<typeof getFiles>> | null = null;
  try {
    files = await getFiles({ types, searchText, sort });
  } catch (err) {
    console.error("getFiles failed:", err);
  }

  const total = files?.total ?? 0;
  const docs = files?.documents ?? [];

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {total > 0 ? (
        <section className="file-list">
          {docs.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
}
