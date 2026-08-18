// API локальной dev-админки. Вызывается ТОЛЬКО из middleware в dev-режиме
// (src/middleware.ts): middleware выполняется на каждый запрос без кэша,
// в продакшен-сборке этот код не выполняется.
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { ZodError } from "astro/zod";
import {
  locationDataSchema,
  validatePublishable,
  type LocationData,
} from "./schema";
import { ALLOWED_COVER_EXT, CONTENT_DIR, findDirBySlug, json, listLocations } from "./admin-store";

type FieldErrors = Record<string, string>;

function zodToFieldErrors(err: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

/** GET список всех записей (все статусы). */
async function handleList(): Promise<Response> {
  const locations = await listLocations();
  return json({ locations });
}

/** GET полная загрузка записи для редактирования: data.json + az/ru/en.md. */
async function handleLoad(slug: string | null): Promise<Response> {
  if (!slug) return json({ ok: false, error: "Не указан slug" }, 400);

  const dirName = await findDirBySlug(slug);
  if (!dirName) return json({ ok: false, error: `Локация "${slug}" не найдена` }, 404);

  const dirPath = path.join(CONTENT_DIR, dirName);
  let data: unknown;
  try {
    data = JSON.parse(await readFile(path.join(dirPath, "data.json"), "utf8"));
  } catch (err) {
    return json({ ok: false, error: `Ошибка чтения data.json: ${(err as Error).message}` }, 500);
  }

  const bodies: Record<string, string> = {};
  for (const lang of ["az", "ru", "en"]) {
    try {
      bodies[lang] = await readFile(path.join(dirPath, `${lang}.md`), "utf8");
    } catch {
      bodies[lang] = "";
    }
  }

  const coverFile = (data as { cover?: { file?: string } }).cover?.file ?? "";
  const coverExists = coverFile
    ? !!(await stat(path.join(dirPath, coverFile)).catch(() => null))?.isFile()
    : false;

  return json({ ok: true, dirName, data, bodies, coverExists });
}

/**
 * POST сохранение записи.
 *
 * Формат запроса (multipart/form-data):
 *   data          — JSON с общими полями (LocationData)
 *   bodyAz/Ru/En  — markdown-тела статьи
 *   originalSlug  — slug редактируемой записи (пусто для новой)
 *   cover         — файл обложки (необязательно)
 *
 * Сначала полная валидация, затем запись всех файлов. При смене slug старая
 * директория удаляется только после успешной записи новой.
 */
async function handleSave(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, errors: { _: "Не удалось разобрать form-data" } }, 400);
  }

  const errors: FieldErrors = {};

  // ── 1. Разбор data.json ────────────────────────────────────────────
  let data: LocationData;
  try {
    const raw = JSON.parse(String(form.get("data") ?? "{}"));
    data = locationDataSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      return json({ ok: false, errors: zodToFieldErrors(err) }, 422);
    }
    return json({ ok: false, errors: { _: "Поле data: невалидный JSON" } }, 400);
  }

  const bodies = {
    az: String(form.get("bodyAz") ?? ""),
    ru: String(form.get("bodyRu") ?? ""),
    en: String(form.get("bodyEn") ?? ""),
  };
  const originalSlug = String(form.get("originalSlug") ?? "").trim();

  // ── 2. Обложка ─────────────────────────────────────────────────────
  const coverField = form.get("cover");
  let coverBuffer: Buffer | null = null;
  let coverFileName = data.cover.file;

  if (coverField instanceof File && coverField.size > 0) {
    const ext = path.extname(coverField.name).toLowerCase();
    if (!ALLOWED_COVER_EXT.includes(ext)) {
      errors["cover.file"] = `Недопустимый формат обложки. Разрешены: ${ALLOWED_COVER_EXT.join(", ")}`;
    } else if (coverField.size > 15 * 1024 * 1024) {
      errors["cover.file"] = "Обложка больше 15 МБ";
    } else {
      coverBuffer = Buffer.from(await coverField.arrayBuffer());
      coverFileName = `cover${ext}`;
    }
  }

  // Публикация без обложки допустима, только если файл уже лежит на диске.
  if (data.status === "published" && !coverBuffer && !coverFileName) {
    errors["cover.file"] = "Для публикации нужна обложка: загрузите изображение";
  }

  // ── 3. Валидация по статусу ────────────────────────────────────────
  const now = new Date().toISOString();
  if (data.status === "published" && !data.publishedAt) {
    data = { ...data, publishedAt: now };
  }
  data = { ...data, updatedAt: now, cover: { ...data.cover, file: coverFileName } };

  for (const message of validatePublishable(data, bodies)) {
    errors["_"] = errors._ ? `${errors._}; ${message}` : message;
  }

  // ── 4. Конфликты slug ──────────────────────────────────────────────
  const existingDir = await findDirBySlug(data.slug);
  const originalDir = originalSlug ? await findDirBySlug(originalSlug) : null;
  if (existingDir && existingDir !== originalDir) {
    errors["slug"] = `Slug "${data.slug}" уже занят другой записью`;
  }

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 422);
  }

  // ── 5. Запись файлов ───────────────────────────────────────────────
  // Имя директории совпадает со slug: slug — URL-safe по схеме,
  // поэтому traversal через него невозможен.
  const targetDir = path.join(CONTENT_DIR, data.slug);
  if (path.dirname(targetDir) !== CONTENT_DIR) {
    return json({ ok: false, errors: { slug: "Недопустимый slug" } }, 422);
  }

  try {
    await mkdir(targetDir, { recursive: true });
    await writeFile(
      path.join(targetDir, "data.json"),
      JSON.stringify(data, null, 2) + "\n",
      "utf8"
    );
    for (const [lang, body] of Object.entries(bodies)) {
      await writeFile(path.join(targetDir, `${lang}.md`), body, "utf8");
    }
    if (coverBuffer) {
      await writeFile(path.join(targetDir, coverFileName), coverBuffer);
    }

    // Смена slug: удаляем старую директорию только после успешной записи новой.
    if (originalDir && originalDir !== data.slug) {
      await rm(path.join(CONTENT_DIR, originalDir), { recursive: true, force: true });
    }
  } catch (err) {
    return json({ ok: false, errors: { _: `Ошибка записи файлов: ${(err as Error).message}` } }, 500);
  }

  return json({
    ok: true,
    slug: data.slug,
    status: data.status,
    files: ["data.json", "az.md", "ru.md", "en.md", ...(coverBuffer ? [coverFileName] : [])],
  });
}

/** Роутинг admin API: возвращает null, если путь не относится к API. */
export async function handleAdminApi(request: Request, url: URL): Promise<Response | null> {
  const api = "/locations/admin/api/";
  if (!url.pathname.startsWith(api)) return null;

  const route = url.pathname.slice(api.length).replace(/\/$/, "");
  if (route === "list" && request.method === "GET") return handleList();
  if (route === "load" && request.method === "GET") {
    return handleLoad(url.searchParams.get("slug"));
  }
  if (route === "save" && request.method === "POST") return handleSave(request);

  return json({ error: "not found" }, 404);
}
