import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Real device screenshots (app 1.5.x), one set per site language.
const SCREEN_KEYS = ['home', 'sky', 'planet', 'astrolab', 'article', 'constellations', 'forecast', 'calendar', 'tools'];
const SCREEN_LANGS = ['az', 'ru', 'en'];

const SCROLL_STEP = 218; // 200px item + 18px gap

const Screens = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const lang = SCREEN_LANGS.find((l) => i18n.language?.startsWith(l)) || 'en';

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
  };

  return (
    <section id="screens" className="section page-wrap">
      <div className="section-label section-title--center">{t('screens.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('screens.title') }} />
      <p className="section-sub section-sub--center">{t('screens.sub')}</p>

      <div className="c-screenshots-wrap">
        <button
          className="screen-arrow"
          onClick={() => scroll(-1)}
          aria-label="Previous screenshots"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="c-screenshots" ref={ref}>
          {SCREEN_KEYS.map((k) => (
            <figure className="screenshot-item" key={k}>
              <img src={`/assets/img/screens/${lang}/${k}.webp`} alt={t(`screens.${k}`)} loading="lazy" width="600" height="1305" />
              <figcaption className="screen-label">{t(`screens.${k}`)}</figcaption>
            </figure>
          ))}
        </div>

        <button
          className="screen-arrow"
          onClick={() => scroll(1)}
          aria-label="Next screenshots"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Screens;
