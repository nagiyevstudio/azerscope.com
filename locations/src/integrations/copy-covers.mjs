// Интеграция Astro: копирует обложки опубликованных и архивных локаций
// из src/content/locations/{dir}/ в dist/images/locations/{slug}/.
// В dev-режиме обложки отдаёт middleware (src/middleware.ts).
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(here, "..", "..");
const CONTENT_DIR = path.join(PROJECT_ROOT, "src", "content", "locations");

export default function copyLocationCovers() {
  return {
    name: "copy-location-covers",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outRoot = path.join(fileURLToPath(dir), "images", "locations");
        let dirNames = [];
        try {
          dirNames = await readdir(CONTENT_DIR);
        } catch {
          logger.info("Контент-директория не найдена, обложки не копируются");
          return;
        }

        let copied = 0;
        for (const dirName of dirNames) {
          const dirPath = path.join(CONTENT_DIR, dirName);
          if (!(await stat(dirPath).catch(() => null))?.isDirectory()) continue;

          let data;
          try {
            const { readFile } = await import("node:fs/promises");
            data = JSON.parse(await readFile(path.join(dirPath, "data.json"), "utf8"));
          } catch {
            continue;
          }

          // Черновики не имеют публичных страниц — обложка не нужна.
          if (!data || data.status === "draft" || !data.cover?.file) continue;

          const source = path.join(dirPath, data.cover.file);
          if (!(await stat(source).catch(() => null))?.isFile()) {
            logger.warn(`Локация "${dirName}": файл обложки "${data.cover.file}" не найден`);
            continue;
          }

          const slug = typeof data.slug === "string" && data.slug ? data.slug : dirName;
          const targetDir = path.join(outRoot, slug);
          await mkdir(targetDir, { recursive: true });
          await copyFile(source, path.join(targetDir, path.basename(data.cover.file)));
          copied += 1;
        }

        logger.info(`Скопировано обложек: ${copied}`);
      },
    },
  };
}
