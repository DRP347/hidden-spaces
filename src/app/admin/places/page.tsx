import Link from "next/link";

import { AdminPlacesClient } from "@/components/admin/AdminPlacesClient";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPlacesPage() {
  return (
    <AdminShell
      title="Places"
      subtitle="Edit the spaces that appear on the public map."
      action={
        <Link
          href="/admin/places/new"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          New place
        </Link>
      }
    >
      <AdminPlacesClient />
    </AdminShell>
  );
}
