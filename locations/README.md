# AzerScope — Recommended Observation Locations

Статический подпроект сайта `azerscope.com`: каталог рекомендованных мест для
астрономических наблюдений. Построен на Astro 7 (static output), деплоится в
подпапку `/locations/` того же домена. Основной SPA в `../frontend` не затрагивается.

## Публичные URL

| Что | URL |
| --- | --- |
| Каталог | `https://azerscope.com/locations/{az,ru,en}/` |
| Страница локации | `https://azerscope.com/locations/{lang}/{slug}/` |
| JSON v1 для приложения | `https://azerscope.com/locations/recommended-observation-locations.v1.json` |

`/locations/` без языка — 301 на `/locations/en/` (дефолт задаётся в
`src/config.ts` → `DEFAULT_LANG` и редиректе в `astro.config.mjs`).

## Запись локации

Одна локация = директория `src/content/locations/{slug}/`:

```
src/content/locations/pirqulu/
├── data.json       # общие поля: slug, status, order, координаты, Bortle,
│                   # name/region/summary ×3, обложка, даты
├── az.md           # тело статьи, по файлу на язык
├── ru.md
├── en.md
└── cover.jpg       # обложка (имя указано в data.json → cover.file)
```

Статусы:

- `draft` — только в репозитории; не попадает в каталог, страницы и JSON;
- `published` — карточка в каталоге, страница, запись в JSON; обязательны
  все три перевода, три текста статьи и обложка;
- `archived` — исключена из каталога и JSON, страница остаётся с пометкой
  об архивации (безопасно для внешних ссылок).

Все поля валидируются Zod-схемой (`src/lib/schema.ts`) при сборке —
невалидный контент не соберётся.

## Работа через локальную форму (рекомендуется)

```bash
npm install
npm run dev
# открыть http://localhost:4321/locations/admin
```

Форма: список записей, блоки «Публикация», «Карточка каталога» (вкладки
AZ/RU/EN, превью карточки), «Координаты и небо» (карта Leaflet, Bortle,
радиус, предупреждение о близких локациях), «Материал страницы»
(markdown-редакторы трёх языков с превью).

Кнопки «Сохранить черновик / Опубликовать / Архивировать» валидируют данные
на сервере (dev-endpoint) и пишут файлы в `src/content/locations/{slug}/`.
Страница формы `src/pages/admin/` помечена `noindex`; её API-endpoints в
продакшен-сборке отдают 404, поэтому записывать файлы через неё в проде
невозможно.

Дальше — обычный git:

```bash
git add src/content/locations/{slug}
git commit -m "Locations: {название}"
git push
```

GitHub Actions собирает проект и деплоит `dist/` по FTP в `./locations/`.
Каталог, страница и JSON появляются одновременно; откат = `git revert` + push.

## Ручное редактирование

Файлы записи можно править прямо в репозитории — схема и сборка те же.
После первой публикации `slug` считается стабильным идентификатором.
При необходимости сменить slug уже опубликованной локации добавьте постоянный
redirect в `redirects` в `astro.config.mjs`:

```js
redirects: {
  "/en/old-slug/": { status: 301, destination: "/en/new-slug/" },
}
```

## Сборка и проверка контракта JSON

```bash
npm run build            # сборка в dist/
npm run validate:json    # проверка dist-JSON против контракта v1
```

Контракт JSON зафиксирован в
`docs/RECOMMENDED_OBSERVATION_LOCATIONS_SITE_HANDOFF_RU.md` §8; пример
реального ответа — `tests/contract.example.json`. JSON генерируется целиком
при сборке из записей со статусом `published`: частично записанного файла
быть не может, предыдущая версия на хостинге заменяется только полным новым
файлом при деплое.

## Обложки

Файл обложки лежит рядом с записью. В prod он копируется в
`dist/images/locations/{slug}/` интеграцией
`src/integrations/copy-covers.mjs`, в dev отдаётся middleware
(`src/middleware.ts`). Публичный URL:
`https://azerscope.com/locations/images/locations/{slug}/{файл}`.

## CI

Workflow: `../.github/workflows/deploy-locations.yml` (срабатывает на push в
`main` при изменениях в `locations/**`). Шаги: сборка → `validate:json` →
FTP-деплой `dist/` в `./locations/`. Секреты FTP те же, что у основного сайта.
