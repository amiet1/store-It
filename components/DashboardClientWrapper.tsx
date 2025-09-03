"use client";

import { useEffect, useState } from "react";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import DashboardClient from "./DashboardClient";
import { Models } from "node-appwrite";

interface TotalSpace {
  used: number;
  documentSize?: number;
  documentDate?: string;
  imageSize?: number;
  imageDate?: string;
  videoSize?: number;
  videoDate?: string;
  audioSize?: number;
  audioDate?: string;
  otherSize?: number;
  otherDate?: string;
}

export default function DashboardClientWrapper() {
  const [files, setFiles] = useState<Models.Document[]>([]);
  const [totalSpace, setTotalSpace] = useState<TotalSpace>({ used: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesResponse = await getFiles({
          types: [],
          searchText: "",
          sort: "",
          limit: 10,
        });
        setFiles(filesResponse.documents);

        const total = await getTotalSpaceUsed();
        setTotalSpace(total as TotalSpace);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <DashboardClient files={{ documents: files }} totalSpace={totalSpace} />
  );
}
