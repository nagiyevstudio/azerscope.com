// Общие константы подпроекта locations.
export const SITE = "https://azerscope.com";
export const BASE = "/locations";

export const LANGS = ["az", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

// Язык по умолчанию: на него ведёт редирект с /locations/
// и он используется в detailsUrl публичного JSON.
export const DEFAULT_LANG: Lang = "en";

export const JSON_FILENAME = "recommended-observation-locations.v1.json";
export const SCHEMA_VERSION = 1;

// Ограничение краткого описания карточки, символов на язык.
export const SUMMARY_MAX = 240;

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}
