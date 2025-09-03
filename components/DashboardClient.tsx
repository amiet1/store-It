"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Chart } from "@/components/Chart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import ActionDropdown from "@/components/ActionDropdown";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

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

interface DashboardClientProps {
  files: { documents: Models.Document[] };
  totalSpace: TotalSpace;
}

const DashboardClient = ({ files, totalSpace }: DashboardClientProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
      console.log("Avatar changed:", file);
      // TODO: Upload avatar to server
    };
    reader.readAsDataURL(file);
  };

  const usageSummary = getUsageSummary({
    document: {
      size: totalSpace.documentSize || 0,
      latestDate: totalSpace.documentDate || "",
    },
    image: {
      size: totalSpace.imageSize || 0,
      latestDate: totalSpace.imageDate || "",
    },
    video: {
      size: totalSpace.videoSize || 0,
      latestDate: totalSpace.videoDate || "",
    },
    audio: {
      size: totalSpace.audioSize || 0,
      latestDate: totalSpace.audioDate || "",
    },
    other: {
      size: totalSpace.otherSize || 0,
      latestDate: totalSpace.otherDate || "",
    },
  });

  return (
    <div className="dashboard-container flex flex-col space-y-10">
      {/* Storage Chart + Summary */}
      <section>
        <Chart used={totalSpace.used ?? 0} />

        {/* Usage Summary */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Storage Summary</h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {usageSummary.map((summary) => (
              <Link
                key={summary.title}
                href={summary.url}
                className="dashboard-summary-card rounded-xl bg-white/5 p-4 shadow-sm transition hover:bg-white/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Image
                      src={summary.icon}
                      width={40}
                      height={40}
                      alt={summary.title}
                    />
                    <h4 className="summary-type-size font-bold">
                      {convertFileSize(summary.size) || 0}
                    </h4>
                  </div>
                  <h5 className="summary-type-title text-sm font-medium">
                    {summary.title}
                  </h5>
                  <Separator className="bg-light-400" />
                  <FormattedDateTime
                    date={summary.latestDate}
                    className="text-xs text-gray-400"
                  />
                </div>
              </Link>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent Files */}
      <section className="dashboard-recent-files">
        <h2 className="mb-4 text-lg font-semibold">Recent Files Uploaded</h2>
        <ul className="flex flex-col gap-5">
          {files.documents.length > 0 ? (
            files.documents.map((file) => (
              <Link
                key={file.$id}
                href={file.url}
                target="_blank"
                className="flex items-center justify-between gap-3 rounded-lg p-3 transition hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <div className="flex flex-col">
                    <p className="recent-file-name font-medium">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption text-xs text-gray-400"
                    />
                  </div>
                </div>
                <ActionDropdown file={file} />
              </Link>
            ))
          ) : (
            <p className="empty-list text-gray-400">No files uploaded</p>
          )}
        </ul>
      </section>

      {/* Avatar + Welcome Section (BOTTOM LEFT) */}
      <section className="mt-auto flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-16">
            <AvatarImage
              src={avatarUrl || "/api/user/avatar"}
              alt="User avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 size-8 rounded-full p-0"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <Camera className="size-4" />
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your storage</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardClient;
