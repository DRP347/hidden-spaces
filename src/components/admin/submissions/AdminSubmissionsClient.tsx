"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { SpotSubmission, SubmissionStatus } from "@/types/submissionTypes";

type FilterStatus = SubmissionStatus | "all";

type SubmissionResponse = {
  ok?: boolean;
  submissions?: SpotSubmission[];
  counts?: Record<FilterStatus, number>;
  error?: string;
};

const tabs: { label: string; value: FilterStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

export function AdminSubmissionsClient() {
  const [status, setStatus] = useState<FilterStatus>("pending");
  const [submissions, setSubmissions] = useState<SpotSubmission[]>([]);
  const [counts, setCounts] = useState<Record<FilterStatus, number>>({
    pending: 0,
    approved: 0,
    rejected: 0,
    all: 0,
  });
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredSubmissions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return submissions;

    return submissions.filter((submission) =>
      [
        submission.name,
        submission.area,
        submission.category,
        submission.reason,
        submission.submitterName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, submissions]);

  async function loadSubmissions(nextStatus = status) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/submissions?status=${nextStatus}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as SubmissionResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load submissions.");
      }

      setSubmissions(data.submissions ?? []);
      setCounts({
        pending: data.counts?.pending ?? 0,
        approved: data.counts?.approved ?? 0,
        rejected: data.counts?.rejected ?? 0,
        all: data.counts?.all ?? 0,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load submissions.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="grid gap-4">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = status === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                  <span className={isActive ? "ml-2 text-white/70" : "ml-2 text-slate-400"}>
                    {counts[tab.value] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search submissions..."
              className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
            <button
              type="button"
              onClick={() => loadSubmissions(status)}
              className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden min-w-[860px] grid-cols-[1.1fr_0.8fr_0.75fr_0.55fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 md:grid">
          <span>Submission</span>
          <span>Area</span>
          <span>Submitted</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading submissions...</div>
        ) : filteredSubmissions.length ? (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map((submission) => (
              <SubmissionRow key={submission.id} submission={submission} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">No submissions found.</div>
        )}
      </div>
    </div>
  );
}

function SubmissionRow({ submission }: { submission: SpotSubmission }) {
  return (
    <div className="grid gap-3 p-4 md:grid-cols-[1.1fr_0.8fr_0.75fr_0.55fr_auto] md:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-slate-950">{submission.name}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{submission.reason}</p>
      </div>
      <div className="text-sm text-slate-600">
        <p className="font-semibold">{submission.area}</p>
        <p className="mt-1 text-xs text-slate-500">{submission.category}</p>
      </div>
      <span className="text-sm text-slate-600">{formatDate(submission.createdAt)}</span>
      <StatusPill status={submission.status} />
      <div className="flex flex-wrap items-center gap-2">
        {submission.convertedPlaceId ? (
          <Link
            href={`/admin/places/edit/${submission.convertedPlaceId}`}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300"
          >
            Edit place
          </Link>
        ) : null}
        <Link
          href={`/admin/submissions/${submission.id}`}
          className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
        >
          Review
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: SubmissionStatus }) {
  const className =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "rejected"
        ? "bg-red-50 text-red-700 ring-red-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${className}`}>
      {status}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
