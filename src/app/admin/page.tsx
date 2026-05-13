import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminHome() {
  return (
    <AdminShell
      title="Admin"
      subtitle="Manage hidden spaces, coordinates, images, and visibility."
      action={
        <Link
          href="/admin/places/new"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          New place
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/places"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
            Places
          </p>
          <h2 className="mt-2 text-2xl font-bold">Manage map content</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create, edit, delete, fix coordinates, upload images, update tags,
            and control public/private visibility.
          </p>
        </Link>
        <Link
          href="/admin/submissions"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
            Submissions
          </p>
          <h2 className="mt-2 text-2xl font-bold">Review community spots</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review pending hidden spot suggestions, clean the details, publish
            approved places, or reject notes that do not fit the map.
          </p>
        </Link>
      </div>
    </AdminShell>
  );
}
