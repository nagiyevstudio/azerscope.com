import type { Lang } from "../config";

type UiStrings = {
  catalogTitle: string;
  catalogIntro: string;
  emptyCatalog: string;
  bortle: string;
  region: string;
  directions: string;
  coordinates: string;
  updatedAt: string;
  publishedAt: string;
  archivedTitle: string;
  archivedBody: string;
  backToCatalog: string;
  langName: string;
  footerNote: string;
  ecosystemNetwork: string;
  ecosystemApp: string;
  ecosystemLocations: string;
  ecosystemShop: string;
  ecosystemTelegram: string;
};

export const UI_STRINGS: Record<Lang, UiStrings> = {
  az: {
    catalogTitle: "Tövsiyə olunan müşahidə məkanları",
    catalogIntro:
      "AzerScope tərəfindən yoxlanılmış, tünd səması və açıq üfüqü ilə seçilən astronomik müşahidə məkanları.",
    emptyCatalog: "Hələ heç bir məkan dərc edilməyib.",
    bortle: "Bortle",
    region: "Region",
    directions: "Necə getməli",
    coordinates: "Koordinatlar",
    updatedAt: "Yeniləndi",
    publishedAt: "Dərc edildi",
    archivedTitle: "Məkan arxivləşdirilib",
    archivedBody:
      "Bu məkan artıq tövsiyə olunanlar siyahısına daxil deyil. Məlumat arxiv məqsədilə saxlanılır.",
    backToCatalog: "Kataloqa qayıt",
    langName: "Azərbaycanca",
    footerNote: "AzerScope — tövsiyə olunan müşahidə məkanları kataloqu",
    ecosystemNetwork: "AZERSCOPE NETWORK",
    ecosystemApp: "Tətbiq",
    ecosystemLocations: "Məkanlar",
    ecosystemShop: "Mağaza",
    ecosystemTelegram: "Telegram Beta",
  },
  ru: {
    catalogTitle: "Рекомендованные места для наблюдений",
    catalogIntro:
      "Проверенные командой AzerScope места с тёмным небом и открытым горизонтом для астрономических наблюдений.",
    emptyCatalog: "Пока нет опубликованных локаций.",
    bortle: "Бортль",
    region: "Регион",
    directions: "Как добраться",
    coordinates: "Координаты",
    updatedAt: "Обновлено",
    publishedAt: "Опубликовано",
    archivedTitle: "Локация архивирована",
    archivedBody:
      "Эта локация больше не входит в список рекомендованных. Материал сохранён в архивных целях.",
    backToCatalog: "Назад к каталогу",
    langName: "Русский",
    footerNote: "AzerScope — каталог рекомендованных мест для наблюдений",
    ecosystemNetwork: "AZERSCOPE NETWORK",
    ecosystemApp: "Приложение",
    ecosystemLocations: "Локации",
    ecosystemShop: "Магазин",
    ecosystemTelegram: "Telegram Beta",
  },
  en: {
    catalogTitle: "Recommended observation locations",
    catalogIntro:
      "Dark-sky spots with an open horizon, verified by the AzerScope team for astronomical observations.",
    emptyCatalog: "No locations have been published yet.",
    bortle: "Bortle",
    region: "Region",
    directions: "Get directions",
    coordinates: "Coordinates",
    updatedAt: "Updated",
    publishedAt: "Published",
    archivedTitle: "Location archived",
    archivedBody:
      "This location is no longer part of the recommended list. The material is kept for archival purposes.",
    backToCatalog: "Back to catalog",
    langName: "English",
    footerNote: "AzerScope — recommended observation locations catalog",
    ecosystemNetwork: "AZERSCOPE NETWORK",
    ecosystemApp: "App",
    ecosystemLocations: "Locations",
    ecosystemShop: "Shop",
    ecosystemTelegram: "Telegram Beta",
  },
};

export function t(lang: Lang, key: keyof UiStrings): string {
  return UI_STRINGS[lang][key];
}

export const LANG_LABELS: Record<Lang, string> = {
  az: "AZ",
  ru: "RU",
  en: "EN",
};

/** Локализация названия месяца для даты обновления (без внешних зависимостей). */
export function formatDate(iso: string, lang: Lang): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const locales: Record<Lang, string> = { az: "az", ru: "ru-RU", en: "en-GB" };
  return date.toLocaleDateString(locales[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
