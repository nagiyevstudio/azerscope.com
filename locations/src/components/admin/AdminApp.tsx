import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import MapPicker from "./MapPicker";

const BASE = import.meta.env.BASE_URL; // "/locations/"
const API_LIST = `${BASE}_admin/api/list`;
const API_LOAD = `${BASE}_admin/api/load`;
const API_SAVE = `${BASE}_admin/api/save`;

const LANG_TABS = ["az", "ru", "en"] as const;
type LangTab = (typeof LANG_TABS)[number];
type Localized = { az: string; ru: string; en: string };
type Status = "draft" | "published" | "archived";

type ListItem = {
  dirName: string;
  slug: string;
  status: string;
  order: number;
  latitude: number;
  longitude: number;
  name: Localized;
  updatedAt: string;
  coverFile: string;
};

type FormState = {
  slug: string;
  status: Status;
  order: string;
  latitude: string;
  longitude: string;
  matchRadiusKm: string;
  bortle: string;
  name: Localized;
  region: Localized;
  summary: Localized;
  coverAlt: Localized;
  credit: string;
  coverFile: string;
  publishedAt: string | null;
  updatedAt: string;
};

const SUMMARY_MAX = 240;

const emptyLocalized = (): Localized => ({ az: "", ru: "", en: "" });

const DEFAULT_FORM: FormState = {
  slug: "",
  status: "draft",
  order: "100",
  latitude: "40.2",
  longitude: "47.6",
  matchRadiusKm: "2",
  bortle: "3",
  name: emptyLocalized(),
  region: emptyLocalized(),
  summary: emptyLocalized(),
  coverAlt: emptyLocalized(),
  credit: "",
  coverFile: "",
  publishedAt: null,
  updatedAt: "",
};

function slugify(input: string): string {
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
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const STATUS_LABEL: Record<Status, string> = {
  draft: "Черновик",
  published: "Опубликована",
  archived: "Архив",
};

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-white/10 text-mist-300",
  published: "bg-emerald-400/15 text-emerald-300",
  archived: "bg-amber-400/15 text-amber-300",
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-space-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-gold-400/50";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-mist-400";
const sectionCls = "card-surface p-6";
const sectionTitleCls = "mb-4 text-sm font-bold uppercase tracking-wider text-gold-400";

export default function AdminApp() {
  const [list, setList] = useState<ListItem[]>([]);
  const [listError, setListError] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [bodies, setBodies] = useState<Localized>(emptyLocalized());
  const [originalSlug, setOriginalSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [coverFileObj, setCoverFileObj] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [langTab, setLangTab] = useState<LangTab>("az");
  const [previewOn, setPreviewOn] = useState(false);

  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const reloadList = useCallback(async () => {
    try {
      const res = await fetch(API_LIST);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
      setList(payload.locations ?? []);
      setListError("");
    } catch (err) {
      setListError(
        `Не удалось загрузить список: ${(err as Error).message}. Админка работает только в dev-режиме (npm run dev).`
      );
    }
  }, []);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const resetNew = useCallback(() => {
    setSelectedSlug(null);
    setOriginalSlug("");
    setSlugTouched(false);
    setForm({ ...DEFAULT_FORM, name: emptyLocalized(), region: emptyLocalized(), summary: emptyLocalized(), coverAlt: emptyLocalized() });
    setBodies(emptyLocalized());
    setCoverFileObj(null);
    setCoverPreview("");
    setFieldErrors({});
    setMessage(null);
  }, []);

  const openLocation = useCallback(async (slug: string) => {
    setMessage(null);
    setFieldErrors({});
    try {
      const res = await fetch(`${API_LOAD}?slug=${encodeURIComponent(slug)}`);
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.error || `HTTP ${res.status}`);
      const d = payload.data;
      setForm({
        slug: d.slug ?? slug,
        status: d.status ?? "draft",
        order: String(d.order ?? 100),
        latitude: String(d.latitude ?? ""),
        longitude: String(d.longitude ?? ""),
        matchRadiusKm: String(d.matchRadiusKm ?? 2),
        bortle: String(d.bortle ?? 3),
        name: { ...emptyLocalized(), ...d.name },
        region: { ...emptyLocalized(), ...d.region },
        summary: { ...emptyLocalized(), ...d.summary },
        coverAlt: { ...emptyLocalized(), ...d.cover?.alt },
        credit: d.cover?.credit ?? "",
        coverFile: d.cover?.file ?? "",
        publishedAt: d.publishedAt ?? null,
        updatedAt: d.updatedAt ?? "",
      });
      setBodies({
        az: payload.bodies.az ?? "",
        ru: payload.bodies.ru ?? "",
        en: payload.bodies.en ?? "",
      });
      setSelectedSlug(slug);
      setOriginalSlug(slug);
      setSlugTouched(true);
      setCoverFileObj(null);
      setCoverPreview("");
    } catch (err) {
      setMessage({ kind: "error", text: (err as Error).message });
    }
  }, []);

  const patch = useCallback((partial: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  const patchLocalized = useCallback(
    (field: "name" | "region" | "summary" | "coverAlt", lang: LangTab, value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    },
    []
  );

  // Автогенерация slug из английского названия, пока пользователь не правил slug руками.
  const handleNameEn = useCallback(
    (value: string) => {
      setForm((prev) => ({
        ...prev,
        name: { ...prev.name, en: value },
        slug: slugTouched ? prev.slug : slugify(value),
      }));
    },
    [slugTouched]
  );

  const lat = Number(form.latitude);
  const lng = Number(form.longitude);
  const radiusKm = Number(form.matchRadiusKm);

  // Предупреждение о близких локациях (не блокирует публикацию).
  const proximityWarning = useMemo(() => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
    for (const item of list) {
      if (item.slug === selectedSlug || item.status !== "published") continue;
      const dist = haversineKm(lat, lng, item.latitude, item.longitude);
      if (dist < 5) {
        return `Внимание: в ${dist.toFixed(1)} км уже есть опубликованная локация «${item.name.en || item.slug}».`;
      }
    }
    return "";
  }, [lat, lng, list, selectedSlug]);

  const existingCoverUrl = form.coverFile && form.slug
    ? `${BASE}images/locations/${form.slug}/${form.coverFile}`
    : "";
  const shownCover = coverPreview || existingCoverUrl;

  const save = useCallback(
    async (status: Status) => {
      setSaving(true);
      setMessage(null);
      setFieldErrors({});

      const clientErrors: Record<string, string> = {};
      if (!form.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
        clientErrors["slug"] = "Slug: строчные латинские буквы, цифры, дефисы";
      }
      for (const key of ["order", "latitude", "longitude", "matchRadiusKm", "bortle"] as const) {
        if (!Number.isFinite(Number(form[key])) || form[key].trim() === "") {
          clientErrors[key] = "Введите число";
        }
      }
      if (Object.keys(clientErrors).length > 0) {
        setFieldErrors(clientErrors);
        setSaving(false);
        return;
      }

      const data = {
        slug: form.slug,
        status,
        order: Number(form.order),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        matchRadiusKm: Number(form.matchRadiusKm),
        bortle: Number(form.bortle),
        name: form.name,
        region: form.region,
        summary: form.summary,
        cover: {
          file: form.coverFile,
          alt: form.coverAlt,
          credit: form.credit.trim() || null,
        },
        publishedAt: form.publishedAt,
        updatedAt: form.updatedAt,
      };

      const formData = new FormData();
      formData.set("data", JSON.stringify(data));
      formData.set("bodyAz", bodies.az);
      formData.set("bodyRu", bodies.ru);
      formData.set("bodyEn", bodies.en);
      formData.set("originalSlug", originalSlug);
      if (coverFileObj) formData.set("cover", coverFileObj);

      try {
        const res = await fetch(API_SAVE, { method: "POST", body: formData });
        const payload = await res.json();
        if (!payload.ok) {
          setFieldErrors(payload.errors ?? {});
          const first = Object.values(payload.errors ?? {})[0];
          setMessage({ kind: "error", text: `Не сохранено: ${first ?? "ошибка валидации"}` });
          return;
        }

        const savedSlug = payload.slug as string;
        setSelectedSlug(savedSlug);
        setOriginalSlug(savedSlug);
        setSlugTouched(true);
        setForm((prev) => ({ ...prev, slug: savedSlug, status }));
        if (coverFileObj) {
          setForm((prev) => ({
            ...prev,
            coverFile: `cover.${coverFileObj.name.split(".").pop()?.toLowerCase() ?? "jpg"}`,
          }));
          setCoverFileObj(null);
          setCoverPreview("");
        }
        await reloadList();

        const previewLinks =
          status !== "draft"
            ? `\nПроверить: ${LANG_TABS.map((l) => `${BASE}${l}/${savedSlug}/`).join("  ")}`
            : "";
        setMessage({
          kind: "ok",
          text:
            `Сохранено: src/content/locations/${savedSlug}/ (${STATUS_LABEL[status].toLowerCase()}).\n\n` +
            `Теперь зафиксируйте и опубликуйте:\n` +
            `  git add src/content/locations/${savedSlug}\n` +
            `  git commit -m "Locations: ${form.name.en || savedSlug}"\n` +
            `  git push` +
            previewLinks,
        });
      } catch (err) {
        setMessage({ kind: "error", text: `Ошибка сети: ${(err as Error).message}` });
      } finally {
        setSaving(false);
      }
    },
    [form, bodies, originalSlug, coverFileObj, reloadList]
  );

  const err = (key: string) =>
    fieldErrors[key] ? <p className="mt-1 text-xs text-red-400">{fieldErrors[key]}</p> : null;

  const articleHtml = useMemo(
    () => (previewOn ? (marked.parse(bodies[langTab]) as string) : ""),
    [previewOn, bodies, langTab]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Локации наблюдений — локальная админка</h1>
          <p className="mt-1 text-sm text-mist-400">
            Работает только в dev-режиме. Сохранение пишет файлы в{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">src/content/locations/</code>, публикация — через git push.
          </p>
        </div>
        <button
          onClick={resetNew}
          className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-space-950 transition-colors hover:bg-gold-300"
        >
          + Новая локация
        </button>
      </header>

      {listError && (
        <div className="card-surface mb-6 border-red-400/30 p-4 text-sm text-red-300">{listError}</div>
      )}

      {message && (
        <div
          className={`card-surface mb-6 whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed ${
            message.kind === "ok" ? "border-emerald-400/30 text-emerald-200" : "border-red-400/30 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* ── Список записей ─────────────────────────────────────────── */}
        <aside className="card-surface h-fit p-4 lg:sticky lg:top-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-400">Записи</h2>
          {list.length === 0 && <p className="text-sm text-mist-400">Записей пока нет.</p>}
          <ul className="space-y-1">
            {list.map((item) => (
              <li key={item.dirName}>
                <button
                  onClick={() => openLocation(item.slug)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    selectedSlug === item.slug ? "bg-gold-400/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="block truncate text-sm font-medium text-white">
                    {item.name.en || item.slug}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${STATUS_BADGE[item.status] ?? STATUS_BADGE.draft}`}>
                      {STATUS_LABEL[item.status as Status] ?? item.status}
                    </span>
                    <span className="text-mist-600">order {item.order}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Форма ──────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Публикация */}
          <section className={sectionCls}>
            <h2 className={sectionTitleCls}>Публикация</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelCls} htmlFor="slug">Slug (URL)</label>
                <input
                  id="slug"
                  className={inputCls}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch({ slug: e.target.value });
                  }}
                  placeholder="pirqulu"
                />
                {err("slug")}
              </div>
              <div>
                <label className={labelCls} htmlFor="order">Порядок (order)</label>
                <input
                  id="order"
                  type="number"
                  className={inputCls}
                  value={form.order}
                  onChange={(e) => patch({ order: e.target.value })}
                />
                {err("order")}
              </div>
              <div>
                <label className={labelCls}>Текущий статус</label>
                <span className={`inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${STATUS_BADGE[form.status]}`}>
                  {STATUS_LABEL[form.status]}
                </span>
              </div>
            </div>
            {form.updatedAt && (
              <p className="mt-3 text-xs text-mist-600">
                Последнее изменение: {form.updatedAt}
                {form.publishedAt ? ` · Первая публикация: ${form.publishedAt}` : ""}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => save("draft")}
                disabled={saving}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                Сохранить черновик
              </button>
              <button
                onClick={() => save("published")}
                disabled={saving}
                className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-space-950 transition-colors hover:bg-emerald-300 disabled:opacity-50"
              >
                Опубликовать
              </button>
              <button
                onClick={() => save("archived")}
                disabled={saving}
                className="rounded-full border border-amber-400/40 px-5 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/10 disabled:opacity-50"
              >
                Архивировать
              </button>
              {saving && <span className="self-center text-sm text-mist-400">Сохранение…</span>}
            </div>
            {fieldErrors["_"] && <p className="mt-3 text-sm text-red-400">{fieldErrors["_"]}</p>}
          </section>

          {/* Карточка каталога */}
          <section className={sectionCls}>
            <h2 className={sectionTitleCls}>Карточка каталога</h2>
            <div className="mb-4 flex gap-1">
              {LANG_TABS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLangTab(l)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
                    langTab === l ? "bg-gold-400/15 text-gold-400" : "text-mist-400 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Название ({langTab})</label>
                {langTab === "en" ? (
                  <input className={inputCls} value={form.name.en} onChange={(e) => handleNameEn(e.target.value)} />
                ) : (
                  <input
                    className={inputCls}
                    value={form.name[langTab]}
                    onChange={(e) => patchLocalized("name", langTab, e.target.value)}
                  />
                )}
                {err(`name.${langTab}`)}
              </div>
              <div>
                <label className={labelCls}>Регион ({langTab})</label>
                <input
                  className={inputCls}
                  value={form.region[langTab]}
                  onChange={(e) => patchLocalized("region", langTab, e.target.value)}
                />
                {err(`region.${langTab}`)}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Краткое описание ({langTab}) — {form.summary[langTab].length}/{SUMMARY_MAX}
                </label>
                <textarea
                  className={`${inputCls} min-h-20`}
                  value={form.summary[langTab]}
                  onChange={(e) => patchLocalized("summary", langTab, e.target.value)}
                />
                {err(`summary.${langTab}`)}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <label className={labelCls}>Обложка (общая для всех языков, 16:9)</label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif"
                  className="block w-full text-sm text-mist-300 file:mr-3 file:rounded-full file:border-0 file:bg-gold-400/15 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold-400"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setCoverFileObj(file);
                    setCoverPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
                {err("cover.file")}
                <div className="mt-3 space-y-3">
                  {LANG_TABS.map((l) => (
                    <div key={l}>
                      <label className={labelCls}>Alt-текст ({l})</label>
                      <input
                        className={inputCls}
                        value={form.coverAlt[l]}
                        onChange={(e) => patchLocalized("coverAlt", l, e.target.value)}
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Автор / источник фото (credit)</label>
                    <input
                      className={inputCls}
                      value={form.credit}
                      onChange={(e) => patch({ credit: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Превью карточки */}
              <div>
                <span className={labelCls}>Превью карточки</span>
                <div className="card-surface max-w-sm overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-space-800">
                    {shownCover && (
                      <img src={shownCover} alt="" className="h-full w-full object-cover" />
                    )}
                    <span className="gold-chip absolute right-3 top-3">Bortle {form.bortle || "?"}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-white">
                      {form.name[langTab] || <span className="text-mist-600">Название…</span>}
                    </p>
                    <p className="mt-0.5 text-sm text-gold-400/90">
                      {form.region[langTab] || <span className="text-mist-600">Регион…</span>}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-mist-300">
                      {form.summary[langTab] || <span className="text-mist-600">Краткое описание…</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Координаты и небо */}
          <section className={sectionCls}>
            <h2 className={sectionTitleCls}>Координаты и небо</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className={labelCls}>Широта</label>
                <input
                  type="number"
                  step="any"
                  className={inputCls}
                  value={form.latitude}
                  onChange={(e) => patch({ latitude: e.target.value })}
                />
                {err("latitude")}
              </div>
              <div>
                <label className={labelCls}>Долгота</label>
                <input
                  type="number"
                  step="any"
                  className={inputCls}
                  value={form.longitude}
                  onChange={(e) => patch({ longitude: e.target.value })}
                />
                {err("longitude")}
              </div>
              <div>
                <label className={labelCls}>Bortle (1–9)</label>
                <select
                  className={inputCls}
                  value={form.bortle}
                  onChange={(e) => patch({ bortle: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {err("bortle")}
              </div>
              <div>
                <label className={labelCls}>Радиус, км</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className={inputCls}
                  value={form.matchRadiusKm}
                  onChange={(e) => patch({ matchRadiusKm: e.target.value })}
                />
                {err("matchRadiusKm")}
              </div>
            </div>
            <div className="mt-4">
              <MapPicker
                latitude={lat}
                longitude={lng}
                radiusKm={Number.isFinite(radiusKm) ? radiusKm : 0}
                onPick={(pickedLat, pickedLng) =>
                  patch({ latitude: pickedLat.toFixed(6), longitude: pickedLng.toFixed(6) })
                }
              />
              <p className="mt-2 text-xs text-mist-600">
                Клик по карте ставит точку. Точность координат при сохранении не обрезается.
              </p>
              {proximityWarning && (
                <p className="mt-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-300">
                  {proximityWarning}
                </p>
              )}
            </div>
          </section>

          {/* Материал страницы */}
          <section className={sectionCls}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`${sectionTitleCls} mb-0`}>Материал страницы (markdown, по файлу на язык)</h2>
              <button
                onClick={() => setPreviewOn((v) => !v)}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-mist-300 transition-colors hover:bg-white/5"
              >
                {previewOn ? "Редактор" : "Превью"}
              </button>
            </div>
            <div className="mb-3 flex gap-1">
              {LANG_TABS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLangTab(l)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
                    langTab === l ? "bg-gold-400/15 text-gold-400" : "text-mist-400 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {previewOn ? (
              <div
                className="article min-h-48 rounded-xl border border-white/10 bg-space-800 p-4"
                dangerouslySetInnerHTML={{ __html: articleHtml || "<p style='color:#4e5d78'>Пусто</p>" }}
              />
            ) : (
              <textarea
                className={`${inputCls} min-h-64 font-mono text-xs leading-relaxed`}
                value={bodies[langTab]}
                onChange={(e) => setBodies((prev) => ({ ...prev, [langTab]: e.target.value }))}
                placeholder={`Текст статьи на языке ${langTab} (markdown)…`}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
