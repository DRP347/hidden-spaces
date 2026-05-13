"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { parseCoordinatePair, slugify } from "@/lib/placeUtils";
import {
  placeCategories,
  type CrowdLevel,
  type Place,
  type PlaceCategory,
  type SafetyLevel,
} from "@/types/placeTypes";
import type { SpotSubmission } from "@/types/submissionTypes";

type ReviewState = {
  name: string;
  slug: string;
  category: PlaceCategory;
  area: string;
  description: string;
  notes: string;
  bestTime: string;
  crowdLevel: CrowdLevel;
  safety: SafetyLevel;
  tags: string;
  lat: string;
  lng: string;
  coverImageUrl: string;
  galleryUrls: string;
  parking: boolean;
  adminNotes: string;
};

type SubmissionDetailResponse = {
  ok?: boolean;
  submission?: SpotSubmission;
  error?: string;
};

type ApproveResponse = {
  ok?: boolean;
  place?: Place;
  submission?: SpotSubmission;
  error?: string;
  message?: string;
};

const crowdLevels: CrowdLevel[] = ["Quiet", "Gentle", "Moderate", "Busy at peaks"];
const safetyLevels: SafetyLevel[] = [
  "Comfortable",
  "Stay aware",
  "Go before dark",
  "Local guidance suggested",
];

export function AdminSubmissionReviewClient({ submissionId }: { submissionId: string }) {
  const [submission, setSubmission] = useState<SpotSubmission | null>(null);
  const [state, setState] = useState<ReviewState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canApprove = useMemo(() => {
    if (!state || submission?.convertedPlaceId) return false;

    return (
      state.name.trim() &&
      state.slug.trim() &&
      state.description.trim() &&
      Number.isFinite(Number(state.lat)) &&
      Number.isFinite(Number(state.lng))
    );
  }, [state, submission?.convertedPlaceId]);

  useEffect(() => {
    let ignore = false;

    async function loadSubmission() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/submissions/${submissionId}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as SubmissionDetailResponse;

        if (!response.ok || !data.submission) {
          throw new Error(data.error ?? "Unable to load submission.");
        }

        if (!ignore) {
          setSubmission(data.submission);
          setState(toReviewState(data.submission));
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load submission.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSubmission();

    return () => {
      ignore = true;
    };
  }, [submissionId]);

  function update<K extends keyof ReviewState>(key: K, value: ReviewState[K]) {
    setState((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
        slug:
          key === "name" && (!current.slug || current.slug === slugify(current.name))
            ? slugify(String(value))
            : current.slug,
      };
    });
    setError("");
    setMessage("");
  }

  function useMapsCoordinates() {
    if (!submission?.mapsLink) return;

    const parsed = parseCoordinatePair(submission.mapsLink);

    if (!parsed) {
      setError("I could not read coordinates from that maps link. Paste latitude and longitude manually.");
      return;
    }

    setState((current) =>
      current
        ? {
            ...current,
            lat: String(Number(parsed.lat.toFixed(6))),
            lng: String(Number(parsed.lng.toFixed(6))),
          }
        : current,
    );
    setMessage("Coordinates filled from the submitted maps field.");
  }

  async function approve(isPublished: boolean) {
    if (!state || !submission) return;

    if (!canApprove) {
      setError("Name, slug, description, and valid coordinates are required before publishing.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: state.adminNotes,
          place: {
            name: state.name,
            slug: state.slug,
            category: state.category,
            area: state.area,
            description: state.description,
            notes: state.notes,
            bestTime: state.bestTime,
            crowdLevel: state.crowdLevel,
            safety: state.safety,
            tags: state.tags,
            coordinates: {
              lat: Number(state.lat),
              lng: Number(state.lng),
            },
            coverImageUrl: state.coverImageUrl,
            galleryUrls: state.galleryUrls,
            parking: state.parking,
            isPublished,
          },
        }),
      });
      const data = (await response.json()) as ApproveResponse;

      if (!response.ok || !data.submission) {
        throw new Error(data.message ?? data.error ?? "Unable to approve submission.");
      }

      setSubmission(data.submission);
      setMessage(isPublished ? "Submission approved and published." : "Submission approved as a draft.");
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : "Unable to approve submission.");
    } finally {
      setIsSaving(false);
    }
  }

  async function reject() {
    if (!submission || !state) return;

    const confirmed = window.confirm(`Reject "${submission.name}"? This will not publish it.`);

    if (!confirmed) return;

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: state.adminNotes }),
      });
      const data = (await response.json()) as SubmissionDetailResponse;

      if (!response.ok || !data.submission) {
        throw new Error(data.error ?? "Unable to reject submission.");
      }

      setSubmission(data.submission);
      setMessage("Submission rejected.");
    } catch (rejectError) {
      setError(rejectError instanceof Error ? rejectError.message : "Unable to reject submission.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading submission...</div>;
  }

  if (error && !submission) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div>;
  }

  if (!submission || !state) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Submission not found.</div>;
  }

  return (
    <div className="grid gap-5">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      ) : null}
      {submission.convertedPlaceId ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold">This submission has already been converted into a place.</span>
          <Link
            href={`/admin/places/edit/${submission.convertedPlaceId}`}
            className="w-fit rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white"
          >
            Edit created place
          </Link>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <OriginalSubmissionCard submission={submission} onUseMapsCoordinates={useMapsCoordinates} />

        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <Panel title="Place draft">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Place name">
                <input value={state.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} />
              </Field>
              <Field label="Slug">
                <input value={state.slug} onChange={(event) => update("slug", slugify(event.target.value))} className={fieldClass} />
              </Field>
              <Field label="Category">
                <select value={state.category} onChange={(event) => update("category", event.target.value as PlaceCategory)} className={fieldClass}>
                  {placeCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </Field>
              <Field label="Area">
                <input value={state.area} onChange={(event) => update("area", event.target.value)} className={fieldClass} />
              </Field>
            </div>
            <Field label="Public description">
              <textarea value={state.description} onChange={(event) => update("description", event.target.value)} rows={4} className={fieldClass} />
            </Field>
            <Field label="Long field note / travel tip">
              <textarea value={state.notes} onChange={(event) => update("notes", event.target.value)} rows={5} className={fieldClass} />
            </Field>
          </Panel>

          <Panel title="Visit details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Best time">
                <input value={state.bestTime} onChange={(event) => update("bestTime", event.target.value)} className={fieldClass} />
              </Field>
              <Field label="Tags, comma-separated">
                <input value={state.tags} onChange={(event) => update("tags", event.target.value)} className={fieldClass} />
              </Field>
              <Field label="Crowd level">
                <select value={state.crowdLevel} onChange={(event) => update("crowdLevel", event.target.value as CrowdLevel)} className={fieldClass}>
                  {crowdLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </Field>
              <Field label="Safety">
                <select value={state.safety} onChange={(event) => update("safety", event.target.value as SafetyLevel)} className={fieldClass}>
                  {safetyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </Field>
              <Field label="Latitude">
                <input value={state.lat} onChange={(event) => update("lat", event.target.value)} className={fieldClass} />
              </Field>
              <Field label="Longitude">
                <input value={state.lng} onChange={(event) => update("lng", event.target.value)} className={fieldClass} />
              </Field>
            </div>
            <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              Parking available
              <input type="checkbox" checked={state.parking} onChange={(event) => update("parking", event.target.checked)} className="h-5 w-5 rounded border-slate-300 text-teal-600" />
            </label>
          </Panel>

          <Panel title="Images and admin notes">
            <Field label="Cover image URL">
              <input value={state.coverImageUrl} onChange={(event) => update("coverImageUrl", event.target.value)} className={fieldClass} />
            </Field>
            <Field label="Gallery image URLs, one per line">
              <textarea value={state.galleryUrls} onChange={(event) => update("galleryUrls", event.target.value)} rows={3} className={fieldClass} />
            </Field>
            <Field label="Admin notes">
              <textarea value={state.adminNotes} onChange={(event) => update("adminNotes", event.target.value)} rows={3} className={fieldClass} />
            </Field>
          </Panel>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Approve as a draft to keep it private, or publish it directly to
              the public places collection.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => approve(false)} disabled={isSaving || !canApprove} className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50">
                Approve as draft
              </button>
              <button type="button" onClick={() => approve(true)} disabled={isSaving || !canApprove} className="min-h-11 rounded-full bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {isSaving ? "Saving..." : "Approve & publish"}
              </button>
              <button type="button" onClick={reject} disabled={isSaving || submission.status === "rejected" || Boolean(submission.convertedPlaceId)} className="min-h-11 rounded-full border border-red-200 px-4 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                Reject
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function OriginalSubmissionCard({
  submission,
  onUseMapsCoordinates,
}: {
  submission: SpotSubmission;
  onUseMapsCoordinates: () => void;
}) {
  return (
    <aside className="grid h-fit gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Original submission</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{submission.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {submission.category} · {submission.area} · {formatDate(submission.createdAt)}
        </p>
      </div>
      <Detail label="Reason" value={submission.reason} />
      <Detail label="Best time" value={submission.bestTime || "Not provided"} />
      <Detail label="Maps / coordinates" value={submission.mapsLink || "Not provided"} />
      {submission.mapsLink ? (
        <button type="button" onClick={onUseMapsCoordinates} className="w-fit rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300">
          Try fill coordinates
        </button>
      ) : null}
      <Detail label="Submitter" value={submission.submitterName || "Not provided"} />
      <Detail label="Contact" value={submission.submitterContact || "Not provided"} />
      <Detail label="Notes" value={submission.notes || "Not provided"} />
    </aside>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function toReviewState(submission: SpotSubmission): ReviewState {
  const parsedMapsLink = parseCoordinatePair(submission.mapsLink);
  const lat = submission.coordinates?.lat ?? parsedMapsLink?.lat ?? 20.4142;
  const lng = submission.coordinates?.lng ?? parsedMapsLink?.lng ?? 72.8321;
  const description = submission.description || submission.reason;
  const notes = [submission.reason, submission.notes].filter(Boolean).join("\n\n");

  return {
    name: submission.name,
    slug: slugify(submission.name),
    category: submission.category,
    area: submission.area || "Daman",
    description,
    notes,
    bestTime: submission.bestTime,
    crowdLevel: "Gentle",
    safety: "Comfortable",
    tags: Array.from(new Set([submission.category.toLowerCase(), submission.area.toLowerCase()])).join(", "),
    lat: String(Number(lat.toFixed(6))),
    lng: String(Number(lng.toFixed(6))),
    coverImageUrl: "",
    galleryUrls: "",
    parking: false,
    adminNotes: submission.adminNotes,
  };
}

function formatDate(value: string | null) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const fieldClass =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";
