"use client";

import L, { type LeafletMouseEvent, type Marker } from "leaflet";
import { useEffect, useMemo, useRef } from "react";

import { DAMAN_CENTER, getSpotAccent, isValidSpotCoordinate } from "@/lib/map";
import type { Spot } from "@/types/spot";

type LeafletContainer = HTMLDivElement & {
  _leaflet_id?: number;
};

export function HeroMap({
  spots,
  selectedSpot,
  onSelect,
  onClearSelection,
}: {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSelect: (spot: Spot) => void;
  onClearSelection: () => void;
}) {
  const containerRef = useRef<LeafletContainer | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const validSpots = useMemo(() => {
    const next = spots.filter(isValidSpotCoordinate);

    if (process.env.NODE_ENV !== "production") {
      const invalid = spots.filter((spot) => !isValidSpotCoordinate(spot));
      if (invalid.length) {
        console.warn(
          "Hidden Spaces Daman skipped invalid map coordinates:",
          invalid.map((spot) => ({ id: spot.id, name: spot.name, coordinates: spot.coordinates })),
        );
      }
    }

    return next;
  }, [spots]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return undefined;

    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    const map = L.map(container, {
      center: DAMAN_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    map.setMaxBounds([
      [20.33, 72.76],
      [20.48, 72.89],
    ]);

    map.on("click", onClearSelection);
    mapRef.current = map;

    window.setTimeout(() => map.invalidateSize(), 180);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.off("click", onClearSelection);
      map.remove();
      mapRef.current = null;
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }
    };
  }, [onClearSelection]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    validSpots.forEach((spot) => {
      const isSelected = selectedSpot?.id === spot.id;
      const accent = getSpotAccent(spot);
      const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
        title: spot.name,
        keyboard: true,
        icon: L.divIcon({
          className: "",
          iconSize: [52, 52],
          iconAnchor: [26, 26],
          html: createMarkerHtml(spot, accent, isSelected),
        }),
      });

      marker.on("click", (event: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(event.originalEvent);
        onSelect(spot);
      });

      marker.on("add", () => {
        const element = marker.getElement();
        const button = element?.querySelector<HTMLButtonElement>(".map-pin__button");
        button?.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(spot);
          }
        });
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [onSelect, selectedSpot?.id, validSpots]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSpot || !isValidSpotCoordinate(selectedSpot)) return;

    map.flyTo([selectedSpot.coordinates.lat, selectedSpot.coordinates.lng], Math.max(map.getZoom(), 15), {
      animate: true,
      duration: 0.85,
    });
  }, [selectedSpot]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full"
      aria-label="Interactive map of hidden places in Daman"
    />
  );
}

function createMarkerHtml(spot: Spot, accent: string, isSelected: boolean) {
  const selectedClass = isSelected ? " is-selected" : "";
  const featuredClass = spot.isFeatured ? " is-featured" : "";
  const label = escapeHtml(spot.name);

  return `
    <button class="map-pin map-pin__button${selectedClass}${featuredClass}" type="button" aria-label="Select ${label}" style="--marker-accent:${accent}">
      <span class="map-pin__halo"></span>
      <span class="map-pin__shell">
        <span class="map-pin__dot"></span>
      </span>
      <span class="map-pin__label">${label}</span>
    </button>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
