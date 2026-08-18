// Общие утилиты dev-only API-endpoints админки.
// В продакшен-сборке все endpoints отдают 404.
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// src/lib -> корень проекта: вверх на 2 уровня.
export const PROJECT_ROOT = path.resolve(here, "..", "..");
export const CONTENT_DIR = path.join(PROJECT_ROOT, "src", "content", "locations");

export const ALLOWED_COVER_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export function isDev(): boolean {
  return !!import.meta.env.DEV;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export type LocationSummary = {
  dirName: string;
  slug: string;
  status: string;
  order: number;
  latitude: number;
  longitude: number;
  name: { az: string; ru: string; en: string };
  updatedAt: string;
  coverFile: string;
};

/** Список всех записей (все статусы) для боковой панели админки. */
export async function listLocations(): Promise<LocationSummary[]> {
  let dirNames: string[] = [];
  try {
    dirNames = await readdir(CONTENT_DIR);
  } catch {
    return [];
  }

  const result: LocationSummary[] = [];
  for (const dirName of dirNames.sort()) {
    const dirPath = path.join(CONTENT_DIR, dirName);
    if (!(await stat(dirPath).catch(() => null))?.isDirectory()) continue;
    try {
      const data = JSON.parse(await readFile(path.join(dirPath, "data.json"), "utf8"));
      result.push({
        dirName,
        slug: typeof data.slug === "string" && data.slug ? data.slug : dirName,
        status: data.status ?? "draft",
        order: typeof data.order === "number" ? data.order : 0,
        latitude: typeof data.latitude === "number" ? data.latitude : 0,
        longitude: typeof data.longitude === "number" ? data.longitude : 0,
        name: data.name ?? { az: "", ru: "", en: "" },
        updatedAt: data.updatedAt ?? "",
        coverFile: data.cover?.file ?? "",
      });
    } catch {
      continue;
    }
  }
  return result;
}

/** Имя директории, в которой фактически лежит запись с данным slug. */
export async function findDirBySlug(slug: string): Promise<string | null> {
  const items = await listLocations();
  const found = items.find((item) => item.slug === slug);
  return found ? found.dirName : null;
}
