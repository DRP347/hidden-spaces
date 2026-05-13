import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSubmissionReviewClient } from "@/components/admin/submissions/AdminSubmissionReviewClient";

type AdminSubmissionReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSubmissionReviewPage({ params }: AdminSubmissionReviewPageProps) {
  const { id } = await params;

  return (
    <AdminShell
      title="Review submission"
      subtitle="Clean up the note, choose visibility, and publish only what should appear on the map."
      action={
        <Link
          href="/admin/submissions"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
        >
          Back to submissions
        </Link>
      }
    >
      <AdminSubmissionReviewClient submissionId={id} />
    </AdminShell>
  );
}
