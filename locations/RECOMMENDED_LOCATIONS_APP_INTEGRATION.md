# Интеграция рекомендованных локаций наблюдений в приложение AzerScope (astroapp)

> **Статус интеграционного контура:** ГОТОВ К ВНЕДРЕНИЮ В МОБИЛЬНОЕ ПРИЛОЖЕНИЕ (PRODUCTION)  
> **Дата формирования отчёта:** 3 сентября 2026 г.  
> **Источник данных:** Веб-каталог `azerscope.com/locations` (Astro 7 SSG, CI/CD через GitHub Actions)

---

## 1. Введение и назначение

Данный документ является итоговым техническим отчётом и руководством по интеграции каталога рекомендованных локаций для астрономических наблюдений в мобильное приложение **AzerScope** (Expo / React Native iOS & Android).

Веб-часть полностью реализована: данные стандартизированы, развернуты на CDN/хостинге по HTTPS, валидируются Zod-схемами при сборке и содержат 4 реальные наблюдательные точки с проверенными координатами, параметрами засветки (Bortle / SQM), обложками и статьями на 3 языках (`az`, `ru`, `en`).

---

## 2. Публичный контракт API (Endpoint)

### 2.1. URL и параметры запроса

```http
GET https://azerscope.com/locations/recommended-observation-locations.v1.json
```

- **Метод:** `GET`
- **Авторизация:** Не требуется (публичный ресурс).
- **Заголовки ответа сервера:**
  - `Content-Type: application/json; charset=utf-8`
  - `Cache-Control: public, max-age=300` (кэш 5 минут)
- **Гарантия целостности:** Файл генерируется целиком во время сборки (`astro build`). Наличие битого, оборванного или частично записанного JSON физически исключено.

---

## 3. Модель данных (TypeScript интерфейсы для `astroapp`)

Скопируйте эти типы в кодовую базу приложения (например, в `src/types/locations.ts`):

```typescript
export type AppLang = "az" | "ru" | "en";

export interface LocalizedText {
  az: string;
  ru: string;
  en: string;
}

export interface RecommendedLocation {
  /** Уникальный стабильный идентификатор (совпадает со slug, например "dubrar") */
  id: string;

  /** Порядковый номер для сортировки (по возрастанию: 10, 20, 30...) */
  order: number;

  /** Локализованное название места */
  name: LocalizedText;

  /** Локализованный район / регион Азербайджана */
  region: LocalizedText;

  /** Краткое описание для карточки/баннера (до 240 символов) */
  summary: LocalizedText;

  /** Широта точки наблюдения (WGS84, float) */
  latitude: number;

  /** Долгота точки наблюдения (WGS84, float) */
  longitude: number;

  /** Радиус зоны сопоставления в километрах (по умолчанию 3) */
  matchRadiusKm: number;

  /** 
   * Класс шкалы Бортля (Bortle Scale).
   * ВНИМАНИЕ: Число с плавающей точкой (float, например: 3.7, 4.0, 4.2)!
   */
  bortle: number;

  /** Абсолютный HTTPS URL оптимизированной обложки (16:9 JPEG) */
  imageUrl: string;

  /** 
   * Канонический URL веб-страницы локации (по умолчанию ведет на английскую версию).
   * Пример: https://azerscope.com/locations/en/dubrar/
   */
  detailsUrl: string;
}

export interface RecommendedLocationsResponse {
  /** Версия схемы контракта (всегда 1) */
  schemaVersion: number;

  /** Время генерации каталога в ISO 8601 UTC */
  generatedAt: string;

  /** Список опубликованных локаций, отсортированных по order */
  locations: RecommendedLocation[];
}
```

---

## 4. Эталонный пример реального ответа (Contract Fixture)

Актуальный боевой ответ, отдаваемый сервером `https://azerscope.com`:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-01T12:32:50.425Z",
  "locations": [
    {
      "id": "dubrar",
      "order": 10,
      "name": {
        "az": "Dübrar",
        "ru": "Дюбрар",
        "en": "Dubrar"
      },
      "region": {
        "az": "Xızı rayonu",
        "ru": "Хызинский район",
        "en": "Khizi District"
      },
      "summary": {
        "az": "Dəniz səviyyəsindən 2200 m yüksəklikdə yerləşən Dübrar dağı: açıq 360° üfüq, təmiz dağ havası və zəif işıq çirkliliyi ilə ideal astrokamp məkanı.",
        "ru": "Гора Дюбрар на высоте 2200 м: открытый круговой горизонт 360°, прозрачный горный воздух и низкая засветка для астрономических наблюдений и кемпинга.",
        "en": "Mount Dubrar at 2,200 m altitude: open 360° horizon, clear mountain air, and low light pollution for deep-sky observation and astrocamping."
      },
      "latitude": 40.89288,
      "longitude": 48.83174,
      "matchRadiusKm": 3,
      "bortle": 3.7,
      "imageUrl": "https://azerscope.com/locations/images/locations/dubrar/cover.jpg",
      "detailsUrl": "https://azerscope.com/locations/en/dubrar/"
    },
    {
      "id": "cengi",
      "order": 20,
      "name": {
        "az": "Cəngi",
        "ru": "Дженги",
        "en": "Jengi"
      },
      "region": {
        "az": "Qobustan rayonu",
        "ru": "Гобустанский район",
        "en": "Gobustan District"
      },
      "summary": {
        "az": "Bakıdan cəmi 60 km məsafədə, Cəngi çölündə yerləşən əlverişli müşahidə nöqtəsi: açıq üfüq və şəhər işıqlarından uzaq qısa astrosəfərlər üçün ideal məkan.",
        "ru": "Удобная точка для быстрых выездов в 60 км от Баку: открытый степной горизонт и умеренная засветка в окрестностях поселка Дженги.",
        "en": "A convenient observing spot just 60 km from Baku in the Jengi steppe: open horizon and moderate light pollution, ideal for quick stargazing trips."
      },
      "latitude": 40.48368,
      "longitude": 49.24413,
      "matchRadiusKm": 3,
      "bortle": 4.2,
      "imageUrl": "https://azerscope.com/locations/images/locations/cengi/cover.jpg",
      "detailsUrl": "https://azerscope.com/locations/en/cengi/"
    },
    {
      "id": "heftesov",
      "order": 30,
      "name": {
        "az": "Həftəsov",
        "ru": "Хафтасов",
        "en": "Haftasov"
      },
      "region": {
        "az": "İsmayıllı rayonu",
        "ru": "Исмаиллинский район",
        "en": "Ismayilli District"
      },
      "summary": {
        "az": "İsmayıllının Həftəsov kəndi yaxınlığındakı dağlıq yayla: təmiz kənd səması, Bortle 3.7 və yüksək şəffaflıqla dərin kosmos müşahidələri üçün əla məkan.",
        "ru": "Горное плато в окрестностях села Хафтасов (Исмаиллы): чистое загородное небо, Bortle 3.7 и высокая прозрачность атмосферы для астрофотографии и кемпинга.",
        "en": "Mountain plateau near Haftasov village in Ismayilli: clean rural dark skies, Bortle 3.7, and high atmospheric transparency for astrocamping and deep-sky imaging."
      },
      "latitude": 40.89262,
      "longitude": 48.40439,
      "matchRadiusKm": 3,
      "bortle": 3.7,
      "imageUrl": "https://azerscope.com/locations/images/locations/heftesov/cover.jpg",
      "detailsUrl": "https://azerscope.com/locations/en/heftesov/"
    },
    {
      "id": "xizi",
      "order": 40,
      "name": {
        "az": "Xızı",
        "ru": "Хызы",
        "en": "Khizi"
      },
      "region": {
        "az": "Xızı rayonu",
        "ru": "Хызинский район",
        "en": "Khizi District"
      },
      "summary": {
        "az": "Bakıdan 85 km məsafədə, Xızının relyefli təpəliklərində yerləşən rahat müşahidə məkanı: Perseid meteor yağışları və gecə mənzərə çəkilişləri üçün əla şərait.",
        "ru": "Живописная точка на холмах Хызы в 85 км от Баку: открытый обзор неба, умеренная засветка Bortle 4.0 и отличные условия для наблюдения метеоров и кемпинга.",
        "en": "A scenic spot in the Khizi foothills 85 km from Baku: open sky views, Bortle 4.0 dark skies, ideal for Perseid meteor watching, astrocamping, and nightscapes."
      },
      "latitude": 40.87312,
      "longitude": 49.17764,
      "matchRadiusKm": 3,
      "bortle": 4.0,
      "imageUrl": "https://azerscope.com/locations/images/locations/xizi/cover.jpg",
      "detailsUrl": "https://azerscope.com/locations/en/xizi/"
    }
  ]
}
```

---

## 5. Архитектурные нюансы для кодовой базы приложения

### 5.1. Дробный Bortle (Важно!)
В исходном ТЗ предполагалось, что Bortle — строго целое число (1–9). На практике карты засветки дают десятые доли. Поэтому поле `bortle` содержит числа вида `3.7`, `4.0`, `4.2`.
- В моделях десериализации (Kotlin / Swift / TypeScript) тип поля должен быть `double` / `float` / `number`.
- В интерфейсе рекомендуется выводить число как есть: `Bortle 3.7`.

### 5.2. Локализация ссылок на подробности (`detailsUrl`)
В JSON поле `detailsUrl` ссылается на канонический URL локации:
`https://azerscope.com/locations/en/{slug}/`

Все страницы сайта статически скомпилированы под три языка:
- `az` -> `https://azerscope.com/locations/az/{slug}/`
- `ru` -> `https://azerscope.com/locations/ru/{slug}/`
- `en` -> `https://azerscope.com/locations/en/{slug}/`

**Рекомендованный хелпер для приложения:**
```typescript
export function getLocalizedDetailsUrl(location: RecommendedLocation, appLang: AppLang): string {
  // Заменяем языковой сегмент на текущий язык приложения пользователя
  return `https://azerscope.com/locations/${appLang}/${location.id}/`;
}
```

При нажатии на карточку открывайте этот URL через `expo-web-browser` (`WebBrowser.openBrowserAsync`) или системный браузер. На мобильной странице работает зафиксированная шапка (sticky header), мобильная вёрстка, переключатель языка и прямая кнопка «Как добраться» в Google Maps.

### 5.3. Сопоставление с GPS-координатами пользователя (GPS Match)
Когда пользователь находится на природе с открытым приложением, приложение может автоматически определять, находится ли он в одной из рекомендованных локаций.

Формула расстояния (Haversine):
```typescript
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Радиус Земли в км
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Проверяет, находится ли точка пользователя внутри matchRadiusKm локации
 */
export function findCurrentRecommendedLocation(
  userLat: number,
  userLon: number,
  locations: RecommendedLocation[]
): RecommendedLocation | null {
  for (const loc of locations) {
    const dist = getDistanceKm(userLat, userLon, loc.latitude, loc.longitude);
    if (dist <= loc.matchRadiusKm) {
      return loc;
    }
  }
  return null;
}
```

Если локация совпала:
- Приложение может показать бейдж: *"Вы находитесь в рекомендованной точке: Дюбрар (Bortle 3.7)"*.
- Предложить ознакомиться с советами по кемпингу и объектами Deep-Sky для этой точки.

### 5.4. Кэширование и оффлайн-режим
Астрономические наблюдения часто проходят в зонах с неустойчивой связью (например, на гребне горы Дюбрар или плато Хафтасов).
- Рекомендуется использовать `TanStack Query` (React Query) с `staleTime: 1000 * 60 * 60` (1 час) и сохранением кэша в `AsyncStorage` / `MMKV`.
- При отсутствии интернета каталог должен бесперебойно загружаться из локального кэша.

---

## 6. Чеклист задач для внедрения в `astroapp`

1. [ ] Добавить интерфейсы `RecommendedLocation` и `RecommendedLocationsResponse`.
2. [ ] Добавить метод API запроса к `https://azerscope.com/locations/recommended-observation-locations.v1.json`.
3. [ ] Настроить кэширование каталога в локальное хранилище для оффлайна.
4. [ ] Реализовать UI-компонент карточки рекомендованного места (обложка `imageUrl`, название, район, бейдж Bortle, краткое описание `summary[lang]`).
5. [ ] Привязать открытие статьи через `WebBrowser.openBrowserAsync(getLocalizedDetailsUrl(loc, currentLang))`.
6. [ ] (Опционально) Добавить маркеры рекомендованных точек на карту приложения.
7. [ ] (Опционально) Интегрировать GPS matching для показа подсказки, если наблюдатель приехал на одну из точек.
