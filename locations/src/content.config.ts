import { defineCollection } from "astro:content";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { locationEntrySchema } from "./lib/schema";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(here, "content", "locations");

const BODY_FILES = { az: "bodyAz", ru: "bodyRu", en: "bodyEn" } as const;

/**
 * Кастомный лоадер: одна локация = директория src/content/locations/{slug}/
 *   data.json       — общие поля (валидируются Zod-схемой)
 *   az.md/ru.md/en.md — тело статьи, по файлу на язык
 *   cover.*         — обложка (копируется в dist отдельной интеграцией)
 */
const locations = defineCollection({
  loader: async () => {
    let dirNames: string[] = [];
    try {
      dirNames = await readdir(CONTENT_DIR);
    } catch {
      return [];
    }

    const entries = [];
    const seenSlugs = new Map<string, string>();

    for (const dirName of dirNames.sort()) {
      const dirPath = path.join(CONTENT_DIR, dirName);
      if (!(await stat(dirPath).catch(() => null))?.isDirectory()) continue;

      const dataPath = path.join(dirPath, "data.json");
      let raw: Record<string, unknown>;
      try {
        raw = JSON.parse(await readFile(dataPath, "utf8"));
      } catch (err) {
        throw new Error(
          `Локация "${dirName}": не удалось прочитать ${dataPath}: ${(err as Error).message}`
        );
      }

      const bodies: Record<string, string> = {};
      for (const [lang, key] of Object.entries(BODY_FILES)) {
        try {
          bodies[key] = await readFile(path.join(dirPath, `${lang}.md`), "utf8");
        } catch {
          bodies[key] = "";
        }
      }

      const status = raw.status;
      if (status !== "draft") {
        for (const [lang, key] of Object.entries(BODY_FILES)) {
          if (!bodies[key].trim()) {
            throw new Error(
              `Локация "${dirName}" (status=${String(status)}): обязателен файл ${lang}.md с текстом статьи`
            );
          }
        }
      }

      const slug = typeof raw.slug === "string" && raw.slug ? raw.slug : dirName;
      const existing = seenSlugs.get(slug);
      if (existing) {
        throw new Error(`Дублирующийся slug "${slug}": директории "${existing}" и "${dirName}"`);
      }
      seenSlugs.set(slug, dirName);

      // Astro передаёт в parseData весь объект целиком, поэтому поля
      // записи возвращаются плоским списком (id Astro заберёт отдельно).
      entries.push({
        id: slug,
        ...raw,
        ...bodies,
      });
    }

    return entries;
  },
  schema: locationEntrySchema,
});

export const collections = { locations };
