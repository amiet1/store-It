// app/dashboard/page.tsx or app/(routes)/dashboard/page.tsx
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const files = await getFiles({
    types: [],
    searchText: "",
    sort: "",
    limit: 10,
  });
  const totalSpace = await getTotalSpaceUsed();

  return <DashboardClient files={files} totalSpace={totalSpace} />;
}
