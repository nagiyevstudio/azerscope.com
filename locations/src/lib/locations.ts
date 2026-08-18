import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { BASE, DEFAULT_LANG, JSON_FILENAME, SITE } from "../config";
import type { LocationEntryData } from "./schema";

export type LocationEntry = CollectionEntry<"locations">;

function byOrder(a: LocationEntry, b: LocationEntry): number {
  return a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug);
}

/** Только опубликованные локации (для каталога и JSON), по возрастанию order. */
export async function getPublishedLocations(): Promise<LocationEntry[]> {
  const items = await getCollection("locations", (entry) => entry.data.status === "published");
  return items.sort(byOrder);
}

/** Опубликованные + архивные (для генерации страниц), по возрастанию order. */
export async function getVisibleLocations(): Promise<LocationEntry[]> {
  const items = await getCollection("locations", (entry) => entry.data.status !== "draft");
  return items.sort(byOrder);
}

export function catalogPath(lang: string): string {
  return `${BASE}/${lang}/`;
}

export function locationPath(lang: string, slug: string): string {
  return `${BASE}/${lang}/${slug}/`;
}

export function absoluteUrl(pathname: string): string {
  return `${SITE}${pathname}`;
}

/** Публичный путь обложки (относительно домена). Пустая строка, если обложки нет. */
export function coverPath(data: LocationEntryData): string {
  if (!data.cover.file) return "";
  return `${BASE}/images/locations/${data.slug}/${data.cover.file}`;
}

/** Абсолютный HTTPS URL обложки для публичного JSON / OG-тегов. */
export function imageUrl(data: LocationEntryData): string {
  const path = coverPath(data);
  return path ? absoluteUrl(path) : "";
}

/** Канонический URL страницы локации (язык по умолчанию) — поле detailsUrl в JSON. */
export function detailsUrl(slug: string): string {
  return absoluteUrl(locationPath(DEFAULT_LANG, slug));
}

export function jsonPath(): string {
  return `${BASE}/${JSON_FILENAME}`;
}

/** Deep-link «Как добраться» в Google Maps. */
export function directionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
