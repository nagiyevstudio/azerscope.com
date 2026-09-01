#!/usr/bin/env node
/**
 * Проверка собранного публичного JSON против контракта v1
 * (docs/RECOMMENDED_OBSERVATION_LOCATIONS_SITE_HANDOFF_RU.md §8, §16).
 * Запускается в CI после `npm run build`: node scripts/validate-json.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(here, "..", "dist", "recommended-observation-locations.v1.json");

const errors = [];

function fail(message) {
  errors.push(message);
}

let text;
try {
  const buffer = await readFile(FILE);
  // Проверка валидного UTF-8: перекодирование не должно терять данные.
  text = buffer.toString("utf8");
  if (Buffer.from(text, "utf8").length !== buffer.length) {
    fail("Файл содержит невалидный UTF-8");
  }
} catch (err) {
  console.error(`✗ Не удалось прочитать ${FILE}: ${err.message}`);
  process.exit(1);
}

let doc;
try {
  doc = JSON.parse(text);
} catch (err) {
  console.error(`✗ Невалидный JSON: ${err.message}`);
  process.exit(1);
}

if (doc.schemaVersion !== 1) fail(`schemaVersion должен быть 1, получено: ${doc.schemaVersion}`);
if (typeof doc.generatedAt !== "string" || Number.isNaN(Date.parse(doc.generatedAt))) {
  fail("generatedAt отсутствует или не является ISO-датой");
}
if (!Array.isArray(doc.locations)) {
  fail("locations должен быть массивом (допустим пустой)");
  doc.locations = [];
}

const seenIds = new Set();
doc.locations.forEach((loc, i) => {
  const where = `locations[${i}] (${loc?.id ?? "без id"})`;

  if (typeof loc.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(loc.id)) {
    fail(`${where}: невалидный id`);
  } else if (seenIds.has(loc.id)) {
    fail(`${where}: дублирующийся id`);
  } else {
    seenIds.add(loc.id);
  }

  if (!Number.isInteger(loc.order)) fail(`${where}: order должен быть целым числом`);

  for (const field of ["name", "region", "summary"]) {
    const value = loc[field];
    for (const lang of ["az", "ru", "en"]) {
      if (typeof value?.[lang] !== "string" || value[lang].trim() === "") {
        fail(`${where}: ${field}.${lang} пуст или отсутствует`);
      }
    }
  }
  for (const field of ["summary"]) {
    for (const lang of ["az", "ru", "en"]) {
      if ((loc[field]?.[lang] ?? "").length > 240) {
        fail(`${where}: ${field}.${lang} длиннее 240 символов`);
      }
    }
  }

  if (typeof loc.latitude !== "number" || loc.latitude < -90 || loc.latitude > 90) {
    fail(`${where}: latitude вне диапазона -90..90`);
  }
  if (typeof loc.longitude !== "number" || loc.longitude < -180 || loc.longitude > 180) {
    fail(`${where}: longitude вне диапазона -180..180`);
  }
  if (typeof loc.matchRadiusKm !== "number" || loc.matchRadiusKm <= 0) {
    fail(`${where}: matchRadiusKm должен быть положительным числом`);
  }
  if (typeof loc.bortle !== "number" || loc.bortle < 1 || loc.bortle > 9) {
    fail(`${where}: bortle должен быть числом 1–9`);
  }

  for (const field of ["imageUrl", "detailsUrl"]) {
    const url = loc[field];
    if (typeof url !== "string" || !/^https:\/\//.test(url)) {
      fail(`${where}: ${field} должен быть абсолютным HTTPS URL`);
    }
  }

  const allowed = new Set([
    "id", "order", "name", "region", "summary", "latitude", "longitude",
    "matchRadiusKm", "bortle", "imageUrl", "detailsUrl",
  ]);
  for (const key of Object.keys(loc)) {
    if (!allowed.has(key)) fail(`${where}: лишнее поле "${key}" (внутренние поля не должны попадать в JSON)`);
  }
});

if (errors.length > 0) {
  console.error(`✗ JSON-каталог не соответствует контракту v1 (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ JSON-каталог валиден: ${doc.locations.length} локаций, generatedAt=${doc.generatedAt}`);
