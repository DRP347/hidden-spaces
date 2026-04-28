"use client";

import { motion } from "framer-motion";
import L, { type LeafletMouseEvent, type Map as LeafletMap } from "leaflet";
import { LocateFixed, Minus, Plus } from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { categoryMeta } from "@/lib/categories";
import { getValidPlaces } from "@/lib/placeValidation";
import type { Place } from "@/types/placeTypes";

const DAMAN_CENTER: [number, number] = [20.4142, 72.8321];
const DAMAN_BOUNDS: [[number, number], [number, number]] = [
  [20.338, 72.742],
  [20.494, 72.912],
];
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const markerIconCache = new Map<string, L.DivIcon>();

type LeafletContainer = HTMLDivElement & {
  _leaflet_id?: number | null;
};

type MapViewProps = {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
  onClearSelection: () => void;
  onAddPlace: () => void;
};

export function MapView({
  places,
  selectedPlaceId,
  onSelectPlace,
  onClearSelection,
  onAddPlace,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectPlaceRef = useRef(onSelectPlace);
  const onClearSelectionRef = useRef(onClearSelection);

  const validPlaces = useMemo(() => getValidPlaces(places), [places]);
  const selectedPlace = useMemo(
    () => validPlaces.find((place) => place.id === selectedPlaceId) ?? null,
    [selectedPlaceId, validPlaces],
  );

  useEffect(() => {
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectPlace]);

  useEffect(() => {
    onClearSelectionRef.current = onClearSelection;
  }, [onClearSelection]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return undefined;
    }

    const markers = markersRef.current;

    resetLeafletContainer(container);

    const map = L.map(container, {
      center: DAMAN_CENTER,
      zoom: 13,
      minZoom: 11,
      maxZoom: 17,
      maxBounds: DAMAN_BOUNDS,
      maxBoundsViscosity: 0.35,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    const tileLayer = L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: ["a", "b", "c", "d"],
    }).addTo(map);

    const handleMapClick = () => onClearSelectionRef.current();
    const handleContainerClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (
        target.closest(
          ".hidden-space-marker, .leaflet-marker-icon, .leaflet-control",
        )
      ) {
        return;
      }

      onClearSelectionRef.current();
    };
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (!target.closest(".leaflet-container")) {
        return;
      }

      if (
        target.closest(
          ".hidden-space-marker, .leaflet-marker-icon, .leaflet-control",
        )
      ) {
        return;
      }

      onClearSelectionRef.current();
    };
    const frame = window.requestAnimationFrame(() => map.invalidateSize());

    map.on("click", handleMapClick);
    container.addEventListener("click", handleContainerClick);
    document.addEventListener("click", handleDocumentClick, true);
    mapRef.current = map;
    tileLayerRef.current = tileLayer;

    return () => {
      window.cancelAnimationFrame(frame);
      map.off("click", handleMapClick);
      container.removeEventListener("click", handleContainerClick);
      document.removeEventListener("click", handleDocumentClick, true);
      clearMarkers(markers);
      tileLayerRef.current = null;
      mapRef.current = null;
      disposeLeafletMap(map, container);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const activeIds = new Set(validPlaces.map((place) => place.id));

    markersRef.current.forEach((marker, placeId) => {
      if (!activeIds.has(placeId)) {
        marker.remove();
        markersRef.current.delete(placeId);
      }
    });

    validPlaces.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const latLng: [number, number] = [
        place.coordinates.lat,
        place.coordinates.lng,
      ];
      const clickHandler = (event: LeafletMouseEvent) => {
        L.DomEvent.stop(event.originalEvent);
        onSelectPlaceRef.current(place);
      };
      const existingMarker = markersRef.current.get(place.id);

      if (existingMarker) {
        existingMarker.off("click");
        existingMarker.setLatLng(latLng);
        existingMarker.setIcon(getMarkerIcon(place, isSelected));
        existingMarker.options.title = place.name;
        existingMarker.on("click", clickHandler);
        return;
      }

      const marker = L.marker(latLng, {
        icon: getMarkerIcon(place, isSelected),
        title: place.name,
        bubblingMouseEvents: false,
      });

      marker.on("click", clickHandler);
      marker.addTo(map);
      markersRef.current.set(place.id, marker);
    });
  }, [selectedPlaceId, validPlaces]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !selectedPlace) {
      return;
    }

    map.flyTo([selectedPlace.coordinates.lat, selectedPlace.coordinates.lng], 14.45, {
      duration: 0.95,
      easeLinearity: 0.28,
    });
  }, [selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return undefined;
    }

    const invalidate = () => map.invalidateSize();

    window.addEventListener("resize", invalidate);
    return () => window.removeEventListener("resize", invalidate);
  }, []);

  const locate = useCallback(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (!navigator.geolocation) {
      map.flyTo(DAMAN_CENTER, 13.4, { duration: 0.75 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo(
          [position.coords.latitude, position.coords.longitude],
          14.5,
          { duration: 0.8 },
        );
      },
      () => map.flyTo(DAMAN_CENTER, 13.4, { duration: 0.75 }),
      { maximumAge: 120_000, timeout: 3000 },
    );
  }, []);

  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleMapShellClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      const target = event.target;

      if (!container || !(target instanceof HTMLElement)) {
        return;
      }

      if (!container.contains(target)) {
        return;
      }

      if (
        target.closest(
          ".hidden-space-marker, .leaflet-marker-icon, .leaflet-control",
        )
      ) {
        return;
      }

      onClearSelectionRef.current();
    },
    [],
  );

  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative h-full w-full"
        onClickCapture={handleMapShellClick}
      >
        <div
          ref={containerRef}
          className="h-full w-full"
          aria-label="Interactive map of hidden spaces in Daman"
        />
        <FloatingControls
          onAddPlace={onAddPlace}
          onLocate={locate}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
        />
      </motion.div>
    </div>
  );
}

function FloatingControls({
  onAddPlace,
  onLocate,
  onZoomIn,
  onZoomOut,
}: {
  onAddPlace: () => void;
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.26, type: "spring", stiffness: 130, damping: 18 }}
      className="pointer-events-auto absolute bottom-5 right-4 z-20 grid gap-2 sm:bottom-6 sm:right-6"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ControlButton label="Add hidden space" onClick={onAddPlace} emphasis>
        <Plus className="h-5 w-5" strokeWidth={1.9} />
      </ControlButton>
      <ControlButton label="Locate me" onClick={onLocate}>
        <LocateFixed className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </ControlButton>
      <div className="grid overflow-hidden rounded-full border border-white/60 bg-coconut/54 shadow-[0_14px_34px_rgba(22,32,42,0.12)] backdrop-blur-md">
        <ControlButton label="Zoom in" onClick={onZoomIn} nested>
          <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </ControlButton>
        <span className="mx-3 h-px bg-ink/10" />
        <ControlButton label="Zoom out" onClick={onZoomOut} nested>
          <Minus className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </ControlButton>
      </div>
    </motion.div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
  emphasis = false,
  nested = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  emphasis?: boolean;
  nested?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      className={`grid h-12 w-12 place-items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
        emphasis
          ? "bg-ink text-coconut shadow-[0_16px_36px_rgba(22,32,42,0.26)] hover:bg-teal"
          : nested
            ? "bg-transparent text-ink/74 hover:text-ink"
            : "glass-light-quiet text-ink/74 hover:text-ink"
      }`}
    >
      {children}
    </motion.button>
  );
}

function getMarkerIcon(place: Place, isSelected: boolean) {
  const accent = categoryMeta[place.category].accent;
  const selectedClass = isSelected ? "is-selected" : "";
  const cacheKey = `${place.id}:${place.category}:${place.name}:${isSelected}`;
  const cachedIcon = markerIconCache.get(cacheKey);

  if (cachedIcon) {
    return cachedIcon;
  }

  const icon = L.divIcon({
    className: "",
    html: `
      <div class="hidden-space-marker ${selectedClass}" style="--marker-accent:${accent}">
        <span class="hidden-space-marker__halo"></span>
        <span class="hidden-space-marker__shell">
          <span class="hidden-space-marker__dot"></span>
        </span>
        <span class="hidden-space-marker__label">${escapeHtml(place.name)}</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
  });

  markerIconCache.set(cacheKey, icon);
  return icon;
}

function clearMarkers(markers: Map<string, L.Marker>) {
  markers.forEach((marker) => marker.remove());
  markers.clear();
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Hidden Spaces] Leaflet map cleanup recovered:", error);
    }
  } finally {
    resetLeafletContainer(container);
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
