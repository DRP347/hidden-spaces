"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useScrollLock } from "@/hooks/useScrollLock";
import type { Place } from "@/types/placeTypes";

export function AdminPlacesClient() {
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  useScrollLock(isBulkOpen);

  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"mongodb" | "mock" | "loading">("loading");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bulkInput, setBulkInput] = useState(sampleBulkImport);
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return places;
    }

    return places.filter((place) =>
      [place.name, place.slug, place.category, ...place.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [places, query]);

  const loadPlaces = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/places?admin=1", { cache: "no-store" });
      const data = (await response.json()) as {
        success?: boolean;
        source?: "mongodb" | "mock";
        data?: Place[];
        places?: Place[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load places.");
      }

      setPlaces(data.data ?? data.places ?? []);
      setSource(data.source ?? "mock");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load places.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const deletePlace = async (place: Place) => {
    const confirmed = window.confirm(`Delete "${place.name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/places/${encodeURIComponent(place.id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete place.");
      }

      setPlaces((current) => current.filter((item) => item.id !== place.id));
      setMessage(`Deleted "${place.name}".`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete place.");
    }
  };

  const bulkImport = async () => {
    setError("");
    setMessage("");
    setIsBulkSaving(true);

    try {
      const parsed = JSON.parse(bulkInput) as unknown;

      if (!Array.isArray(parsed)) {
        throw new Error("Bulk import must be a JSON array.");
      }

      const response = await fetch("/api/places/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = (await response.json()) as {
        success?: boolean;
        data?: { insertedCount?: number };
        insertedCount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to bulk import places.");
      }

      const insertedCount = data.data?.insertedCount ?? data.insertedCount ?? 0;

      setIsBulkOpen(false);
      await loadPlaces();
      setMessage(`Bulk import complete. Inserted ${insertedCount} places.`);
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : "Unable to bulk import places.");
    } finally {
      setIsBulkSaving(false);
    }
  };

  return (
    <div className="grid gap-4">
      {source === "mock" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          MongoDB is not configured. Public browsing uses mock data, but admin create/edit/delete needs
          `MONGODB_URI`.
        </div>
      ) : null}
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search places..."
          className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        />
        <button
          type="button"
          onClick={loadPlaces}
          className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setIsBulkOpen(true)}
          className="min-h-11 rounded-full bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-teal-700"
        >
          Bulk Import
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 md:grid-cols-[1.4fr_0.8fr_0.6fr_auto]">
          <span>Place</span>
          <span className="hidden md:block">Category</span>
          <span className="hidden md:block">Visibility</span>
          <span>Actions</span>
        </div>
        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading places...</div>
        ) : filteredPlaces.length ? (
          filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 md:grid-cols-[1.4fr_0.8fr_0.6fr_auto]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{place.name}</p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)} · {place.slug}
                </p>
              </div>
              <span className="hidden text-sm text-slate-600 md:block">{place.category}</span>
              <span className="hidden text-sm text-slate-600 md:block">{place.visibility}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/places/edit/${place.id}`}
                  className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deletePlace(place)}
                  className="rounded-full border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-slate-500">No places found.</div>
        )}
      </div>

      {isBulkOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Bulk Import</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Paste a JSON array. Slugs are generated automatically when missing.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close bulk import"
                onClick={() => setIsBulkOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                x
              </button>
            </div>
            <textarea
              value={bulkInput}
              onChange={(event) => setBulkInput(event.target.value)}
              spellCheck={false}
              className="mt-4 h-[420px] w-full rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="min-h-11 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkSaving}
                onClick={bulkImport}
                className="min-h-11 rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isBulkSaving ? "Importing..." : "Import places"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const sampleBulkImport = JSON.stringify(
  [
    {
      name: "Quiet Fort Edge",
      category: "Heritage",
      coordinates: {
        lat: 20.4142,
        lng: 72.8321,
      },
      description: "A calm old-wall corner with warm stone, sea air, and slow evening light.",
      tags: ["heritage", "quiet", "evening"],
      images: {
        cover:
          "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&h=900&q=82",
        gallery: [
          "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&h=900&q=82",
        ],
      },
      bestTime: "Golden hour",
      crowdLevel: "Gentle",
      safety: "Comfortable",
      parking: true,
      isPublished: true,
    },
  ],
  null,
  2,
);
