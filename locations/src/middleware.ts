import { defineMiddleware } from "astro:middleware";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAdminApi } from "./lib/admin-api";

// Dev-only middleware:
//  1) отдача обложек из src/content/locations/{slug}/{file}
//     (в prod обложки лежат в dist — см. src/integrations/copy-covers.mjs);
//  2) API локальной админки /locations/admin/api/* — middleware выполняется
//     на каждый запрос без кэша, в продакшен-сборке guard DEV отключает всё.
const PREFIX = "/locations/images/locations/";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) return next();

  const url = new URL(context.request.url);

  const adminResponse = await handleAdminApi(context.request, url);
  if (adminResponse) return adminResponse;

  if (!url.pathname.startsWith(PREFIX)) return next();

  const [slug, filename] = url.pathname.slice(PREFIX.length).split("/");
  const ext = filename ? path.extname(filename).toLowerCase() : "";
  if (!slug || !filename || !(ext in MIME) || slug.includes("..") || filename.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(PROJECT_ROOT, "src", "content", "locations", slug, filename);
  try {
    const body = await readFile(filePath);
    return new Response(body, {
      headers: { "Content-Type": MIME[ext], "Cache-Control": "no-cache" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
});
