"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PlaceForm } from "@/components/admin/PlaceForm";
import type { Place } from "@/types/placeTypes";

export function EditPlaceClient({ id }: { id: string }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPlace() {
      try {
        const response = await fetch(`/api/places/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          data?: Place;
          place?: Place;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Place not found.");
        }

        const loadedPlace = data.data ?? data.place;

        if (!ignore && loadedPlace) {
          setPlace(loadedPlace);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load place.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPlace();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-sm text-slate-500">Loading place...</div>;
  }

  if (error || !place) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">{error || "Place not found."}</p>
        <Link
          href="/admin/places"
          className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
        >
          Back to places
        </Link>
      </div>
    );
  }

  return <PlaceForm mode="edit" initialPlace={place} />;
}
