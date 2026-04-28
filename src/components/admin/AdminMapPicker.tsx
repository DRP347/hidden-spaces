"use client";

import L, { type LeafletMouseEvent, type Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";

const DAMAN_CENTER: [number, number] = [20.4142, 72.8321];
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

type LeafletContainer = HTMLDivElement & {
  _leaflet_id?: number | null;
};

export function AdminMapPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (coordinates: { lat: number; lng: number }) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const initialLatRef = useRef(lat);
  const initialLngRef = useRef(lng);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return undefined;
    }

    resetLeafletContainer(container);

    const initial: [number, number] = [
      Number.isFinite(initialLatRef.current) ? initialLatRef.current : DAMAN_CENTER[0],
      Number.isFinite(initialLngRef.current) ? initialLngRef.current : DAMAN_CENTER[1],
    ];
    const map = L.map(container, {
      center: initial,
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    const marker = L.marker(initial, {
      draggable: true,
      icon: L.divIcon({
        className: "",
        html: '<span class="admin-map-marker"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    }).addTo(map);
    const tileLayer = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);
    const handleClick = (event: LeafletMouseEvent) => {
      const next = { lat: event.latlng.lat, lng: event.latlng.lng };
      marker.setLatLng(next);
      onChangeRef.current(next);
    };
    const handleDragEnd = () => {
      const next = marker.getLatLng();
      onChangeRef.current({ lat: next.lat, lng: next.lng });
    };
    const frame = window.requestAnimationFrame(() => map.invalidateSize());

    map.on("click", handleClick);
    marker.on("dragend", handleDragEnd);
    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      window.cancelAnimationFrame(frame);
      map.off("click", handleClick);
      marker.off("dragend", handleDragEnd);
      marker.remove();
      tileLayer.remove();
      markerRef.current = null;
      mapRef.current = null;
      disposeLeafletMap(map, container);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;

    if (!map || !marker || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    const next: [number, number] = [lat, lng];
    marker.setLatLng(next);
    map.panTo(next, { animate: true, duration: 0.3 });
  }, [lat, lng]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div ref={containerRef} className="h-[320px] w-full" />
    </div>
  );
}

function resetLeafletContainer(container: LeafletContainer) {
  if (container._leaflet_id != null) {
    delete container._leaflet_id;
  }

  container.replaceChildren();
}

function disposeLeafletMap(map: LeafletMap, container: LeafletContainer) {
  try {
    map.remove();
  } finally {
    resetLeafletContainer(container);
  }
}
