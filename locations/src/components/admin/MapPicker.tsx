import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapPickerProps {
  latitude: number;
  longitude: number;
  radiusKm: number;
  onPick: (lat: number, lng: number) => void;
}

// Центр Азербайджана для первоначального вида карты.
const FALLBACK_CENTER: [number, number] = [40.2, 47.6];
const FALLBACK_ZOOM = 8;

/**
 * Выбор точки локации: клик по карте двигает маркер и вызывает onPick.
 * Числовые поля формы и маркер синхронизированы в обе стороны.
 */
export default function MapPicker({ latitude, longitude, radiusKm, onPick }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const radiusRef = useRef<L.Circle | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const validPoint = Number.isFinite(latitude) && Number.isFinite(longitude);
  const center: [number, number] = validPoint ? [latitude, longitude] : FALLBACK_CENTER;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(center, FALLBACK_ZOOM);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    markerRef.current = L.circleMarker(center, {
      radius: 8,
      color: "#f5d181",
      weight: 2,
      fillColor: "#f5d181",
      fillOpacity: 0.5,
    }).addTo(map);

    if (validPoint && radiusKm > 0) {
      radiusRef.current = L.circle(center, {
        radius: radiusKm * 1000,
        color: "#f5d181",
        weight: 1,
        fillOpacity: 0.08,
      }).addTo(map);
    }

    map.on("click", (event: L.LeafletMouseEvent) => {
      onPickRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      radiusRef.current = null;
    };
    // Карта инициализируется один раз; позиция обновляется эффектами ниже.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !validPoint) return;
    markerRef.current.setLatLng(center);
    if (radiusRef.current) {
      radiusRef.current.setLatLng(center);
    } else if (radiusKm > 0) {
      radiusRef.current = L.circle(center, {
        radius: radiusKm * 1000,
        color: "#f5d181",
        weight: 1,
        fillOpacity: 0.08,
      }).addTo(mapRef.current);
    }
  }, [latitude, longitude, validPoint, radiusKm, center[0], center[1]]);

  useEffect(() => {
    if (radiusRef.current && radiusKm > 0) {
      radiusRef.current.setRadius(radiusKm * 1000);
    }
  }, [radiusKm]);

  return (
    <div
      ref={containerRef}
      className="z-0 h-80 w-full overflow-hidden rounded-xl border border-white/10"
      aria-label="Карта выбора координат"
    />
  );
}
