// Zod берём из astro/zod, чтобы совпадать с версией, которую Astro использует
// внутри (v4 начиная с Astro 6).
import { z } from "astro/zod";
import { SUMMARY_MAX } from "../config";

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const localizedStringSchema = z.object({
  az: z.string().min(1),
  ru: z.string().min(1),
  en: z.string().min(1),
});

export const localizedSummarySchema = z.object({
  az: z.string().min(1).max(SUMMARY_MAX),
  ru: z.string().min(1).max(SUMMARY_MAX),
  en: z.string().min(1).max(SUMMARY_MAX),
});

export const coverSchema = z.object({
  // Имя файла обложки внутри директории локации (например, "cover.jpg").
  // Пустая строка допустима только для черновиков.
  file: z.string().default(""),
  alt: z
    .object({
      az: z.string().default(""),
      ru: z.string().default(""),
      en: z.string().default(""),
    })
    .default({ az: "", ru: "", en: "" }),
  credit: z.string().nullable().default(null),
});

// Данные из data.json — каноническая запись локации.
export const locationDataSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(SLUG_REGEX, "slug: только строчные латинские буквы, цифры и дефисы"),
  status: z.enum(["draft", "published", "archived"]),
  order: z.number().int(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  matchRadiusKm: z.number().positive(),
  bortle: z.number().min(1).max(9),
  name: localizedStringSchema,
  region: localizedStringSchema,
  summary: localizedSummarySchema,
  // В Zod 4 значение .default() не парсится и должно совпадать с выходным
  // типом целиком, поэтому указываем объект полностью.
  cover: coverSchema.default({
    file: "",
    alt: { az: "", ru: "", en: "" },
    credit: null,
  }),
  publishedAt: z.string().nullable().default(null),
  updatedAt: z.string().default(""),
});

export type LocationData = z.infer<typeof locationDataSchema>;

// Полная запись коллекции: данные + markdown-тела статей по языкам.
export const locationEntrySchema = locationDataSchema.extend({
  bodyAz: z.string().default(""),
  bodyRu: z.string().default(""),
  bodyEn: z.string().default(""),
});

export type LocationEntryData = z.infer<typeof locationEntrySchema>;

export function bodyKeyFor(lang: "az" | "ru" | "en"): "bodyAz" | "bodyRu" | "bodyEn" {
  return lang === "az" ? "bodyAz" : lang === "ru" ? "bodyRu" : "bodyEn";
}

/**
 * Проверки, которые не описываются схемой Zod:
 * обязательность полей зависит от статуса записи.
 * Возвращает список человекочитаемых ошибок (пустой список — всё в порядке).
 */
export function validatePublishable(data: LocationData, bodies: { az: string; ru: string; en: string }): string[] {
  const errors: string[] = [];
  if (data.status === "draft") return errors;

  for (const lang of ["az", "ru", "en"] as const) {
    if (!bodies[lang].trim()) {
      errors.push(`status=${data.status}: отсутствует текст статьи (${lang}.md)`);
    }
  }

  if (data.status === "published") {
    if (!data.cover.file) {
      errors.push("status=published: обязательна обложка (cover.file)");
    }
    if (!data.publishedAt) {
      // publishedAt выставляется при первой публикации автоматически,
      // но к моменту сборки опубликованная запись обязана его иметь.
      errors.push("status=published: отсутствует publishedAt");
    }
  }

  return errors;
}

/** Расстояние между точками в километрах (haversine). */
export function haversineKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** URL-safe slug из произвольного названия. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[əƏ]/g, "e")
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[а-яА-ЯёЁ]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
        ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[ch.toLowerCase()] ?? "";
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
