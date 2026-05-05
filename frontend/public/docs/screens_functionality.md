# Функционал экранов (AzerScope)

Документ описывает все пользовательские экраны приложения. За основу взяты локальные README и код экранов.

## Auth
### Sign In Welcome (`/(auth)/sign-in`)
- Purpose: стартовый экран с выбором гостевого входа, логина или регистрации.
- UI: логотип + заголовок/подзаголовок + 3 CTA.
- Actions: guest -> Home, login -> Login, register -> Sign Up.

### Login (`/(auth)/login`)
- Purpose: вход по email/паролю.
- UI: форма в Card, поля BlurInput, кнопка BlurButton, ссылки на reset/sign-up.
- Data: PocketBase device-aware auth (`/api/auth-with-device`).
- Actions: success -> Home, reset -> Forgot Password.

### Sign Up (`/(auth)/sign-up`)
- Purpose: регистрация нового аккаунта.
- UI: форма в Card, email/password, CTA.
- Data: PocketBase create user.
- Actions: success -> Home.

### Forgot Password (`/(auth)/forgot-password`)
- Purpose: запрос письма восстановления.
- UI: форма email + CTA.
- Data: PocketBase request-password-reset.

### Pre-register (`/(auth)/pre-register`)
- Purpose: маркетинговый экран при закрытом доступе.
- UI: герой-блок, список преимуществ, CTA.
- Actions: CTA -> Sign Up, secondary -> Sign In.

## Tabs (основные разделы)
### Home (`/(tabs)/home`)
- Purpose: главный хаб — быстрый обзор ночи + навигация.
- UI: ScreenLayout + блоки ClockBlock, WeatherBlock, PlanetVisibility, QuickLinks, Astrofakt, SpaceDaily, ConstellationsFeatured.
- Data: погода/закат/сумерки, локальные расчеты видимости, астрофакты, астрофото дня.
- Actions: переходы в наблюдения, календарь, инструменты, события.

### Weather (`/(tabs)/weather`)
- Purpose: условия для наблюдений (текущие + ночные прогнозы).
- UI: header (температура/ощущается), grid метрик, почасовой ночной прогноз, контекст Бортла.
- Data: `/api/weather/current`, `/api/weather/daily`, hourly forecast, `/api/bortle`.
- Actions: pull-to-refresh.

### Sky (`/(tabs)/sky`)
- Purpose: контекст видимости неба для текущей локации.
- UI: ObservationContextCard + карточки Солнца, Луны, планет, deep-sky.
- Data: GPS, elevation, Bortle, sunrise/sunset, Astronomy Engine, локальные расчеты.
- Actions: add observation (иконка в шапке).

### AstroGuide (`/(tabs)/guide`)
- Purpose: кураторский гид — события, календарь, инструменты, созвездия.
- UI: баннер событий, календарный превью, grid инструментов, превью созвездий.
- Data: PocketBase events + astro_calendar, registry инструментов.
- Actions: переходы в Events, Calendar, Tools, Constellations.

### Events list (`/(tabs)/events`)
- Purpose: список событий (все/мои).
- UI: FlatList из EventCard, фильтры.
- Data: PocketBase events + event_participants.
- Actions: открыть деталку.

### Event detail (`/(tabs)/events/[id]`)
- Purpose: карточка события и RSVP.
- UI: постер, теги, метаданные, описание, CTA, RSVP modal.
- Data: PocketBase events + event_participants.
- Actions: RSVP/отмена, переход на success.

### RSVP success (`/(tabs)/events/rsvp-success`)
- Purpose: подтверждение регистрации и QR.
- UI: success state + QR card.
- Data: событие + запись участия.
- Actions: закрыть -> назад к событию.

### AstroLab main (`/(tabs)/lab`)
- Purpose: витрина AstroLab и подборки по тегам.
- UI: карусели + чипы тегов.
- Data: PocketBase astro_lab + tags.
- Actions: see-all, open list/detail.

### AstroLab list (`/(tabs)/lab/list`)
- Purpose: фильтрация и просмотр материалов.
- UI: поиск, чипы фильтров, список карточек.
- Data: PocketBase astro_lab + tags.
- Actions: открыть detail.

### AstroLab detail (`/(tabs)/lab/[id]`)
- Purpose: детальная карточка материала с вложениями.
- UI: обложка, описание, теги, секции вложений, paywall overlay.
- Data: fetchAstroLabItemById + tags, локализация полей.
- Actions: открыть вложения (CTA внутри карточек).

### Profile main (`/(tabs)/profile`)
- Purpose: профиль, статистика, меню.
- UI: ProfileHeaderCard, ProfileStatsRow, ProfileMenuList.
- Data: auth user, counts observations/events.
- Actions: переход в настройки, наблюдения, события, подписку.

### Profile settings (`/(tabs)/profile/edit`)
- Purpose: настройки языка, выход.
- UI: язык, инфо, logout.
- Actions: sign-out -> Home.

### Subscription (`/(tabs)/profile/subscription`)
- Purpose: статус подписки + IAP действия (изменить план, восстановить покупки).
- UI: SubscriptionSummaryCard, SubscriptionDevicesCard, SubscriptionActionsCard.
- Data: subscription config + PocketBase devices/limits (`lib/device.js`), IAP adapter for offerings on paywall.
- Actions: change plan -> paywall, manage devices, restore purchases.

### Subscription paywall (`/(tabs)/profile/subscription/paywall`)
- Purpose: выбор коммерческого плана и периода.
- UI: SubscriptionPaywall + SubscriptionPlanCard.
- Data: IAP offerings.
- Actions: continue -> purchase.

### Subscription purchase (`/(tabs)/profile/subscription/purchase`)
- Purpose: подтверждение покупки перед запуском IAP.
- UI: PlanBadge + price card + CTA.
- Actions: pay -> success/error, restore purchases.

### Subscription success (`/(tabs)/profile/subscription/success`)
- Purpose: подтверждение успешной покупки.
- UI: PlanBadge + expiry card + CTA.
- Actions: go to My subscription, open key feature.

### Subscription error (`/(tabs)/profile/subscription/error`)
- Purpose: обработка ошибки оплаты.
- UI: error card + actions.
- Actions: retry -> paywall, restore purchases, support.

### Subscription devices (`/(tabs)/profile/subscription/devices`)
- Purpose: список активных устройств и отключение.
- UI: device cards.
- Data: PocketBase `GET /api/user/devices` via `lib/device.js`.

### Observations list (`/(tabs)/profile/observations`)
- Purpose: журнал наблюдений.
- UI: ObservationList + фильтры.
- Data: PocketBase observations.
- Actions: add, delete, open detail (если появится).

### Observations add (`/(tabs)/profile/observations/add`)
- Purpose: добавление наблюдения.
- UI: AddObservationModal (chips + inputs).
- Data: createObservation.
- Actions: сохранить -> toast + back.

### Profile events (`/(tabs)/profile/events`)
- Purpose: история участия в событиях.
- UI: фильтры статуса + EventCard.
- Data: PocketBase event_participants (expand event).

## AstroGuide Tools (`/(tabs)/guide/tools/*`)
### Tools hub (`/(tabs)/guide/tools`)
- Purpose: список доступных инструментов.
- UI: GuideToolsGrid.
- Data: astroToolsRegistry.

### Magnification
- Purpose: расчет увеличения (фокус телескопа / окуляра).
- UI: 2 input-карточки + результат.

### True FOV
- Purpose: истинное поле зрения + увеличение + «луны в кадре».
- UI: 3 input-карточки, AFOV пресеты, результат.

### Coord Converter
- Purpose: конвертер RA/DEC (HMS/DMS <-> градусы).
- UI: 4 input-блока с результатами/валидацией.

### Filter Picker
- Purpose: подбор фильтров по объекту, типу телескопа и засветке.
- UI: chip-группы + список рекомендаций.

### Exposure Rule
- Purpose: максимальная выдержка по правилу (тип сенсора + фокусное).
- UI: chip выбор сенсора + ввод фокусного + результат.

### Compass
- Purpose: компас на основе датчиков (магнитометр + motion).
- UI: кольцо компаса + heading + статус калибровки.

### DOF/Hyperfocal
- Purpose: расчет гиперфокала и ГРИП.
- UI: сенсор, фокусное, диафрагма, дистанция + результаты (near/far).

### Stub screens
- `fov`, `rise-set`, `moon-phase` — пока заглушки через GuideScreenStub.

## Системные экраны
- Splash (`app/SplashScreen.js`, `app/_splash.js`) — запуск/заставка.
- Not Found (`app/+not-found.js`) — fallback на неизвестные маршруты.

## Help (top-level)
### Home help (`/help/home`)
- Purpose: справочные слайды для Home.
- UI: HelpSlider + кнопка закрытия.
- Data: `mock/data/help_home.json`, i18n `help.home.*`.

### Weather help (`/help/weather`)
- Purpose: справочные слайды для Weather.
- UI: HelpSlider + кнопка закрытия.
- Data: `mock/data/help_weather.json`, i18n `help.weather.*`.

### Sky help (`/help/sky`)
- Purpose: справочные слайды для Sky.
- UI: HelpSlider + кнопка закрытия.
- Data: `mock/data/help_sky.json`, i18n `help.sky.*`.
