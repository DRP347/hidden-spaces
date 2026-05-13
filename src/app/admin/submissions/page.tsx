import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSubmissionsClient } from "@/components/admin/submissions/AdminSubmissionsClient";

export default function AdminSubmissionsPage() {
  return (
    <AdminShell
      title="Submissions"
      subtitle="Review community-submitted hidden spots before they appear on the public map."
      action={
        <Link
          href="/admin/places"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
        >
          Back to places
        </Link>
      }
    >
      <AdminSubmissionsClient />
    </AdminShell>
  );
}
