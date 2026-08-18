import type { APIRoute } from "astro";
import { SCHEMA_VERSION } from "../config";
import { getPublishedLocations, imageUrl, detailsUrl } from "../lib/locations";

export const prerender = true;

/**
 * Публичный JSON-каталог v1 (контракт: docs/RECOMMENDED_OBSERVATION_LOCATIONS_SITE_HANDOFF_RU.md §8).
 * Включает только записи со статусом "published", отсортированные по order.
 * Файл генерируется целиком при сборке — частично записанного JSON быть не может.
 */
export const GET: APIRoute = async () => {
  const locations = await getPublishedLocations();

  const payload = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    locations: locations.map(({ data }) => ({
      id: data.slug,
      order: data.order,
      name: data.name,
      region: data.region,
      summary: data.summary,
      latitude: data.latitude,
      longitude: data.longitude,
      matchRadiusKm: data.matchRadiusKm,
      bortle: data.bortle,
      imageUrl: imageUrl(data),
      detailsUrl: detailsUrl(data.slug),
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
