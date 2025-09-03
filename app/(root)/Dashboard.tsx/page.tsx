// app/dashboard/page.tsx
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  // Server-side fetch
  const files = await getFiles({
    types: [],
    searchText: "",
    sort: "$createdAt-desc",
    limit: 10,
  });

  const totalSpace = await getTotalSpaceUsed();

  return <DashboardClient files={files} totalSpace={totalSpace} />;
}
