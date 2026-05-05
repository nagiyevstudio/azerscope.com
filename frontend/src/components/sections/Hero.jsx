import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="hero-shell page-wrap">
      <div className="hero-grid">
        {/* Copy */}
        <div className="hero-copy">
          <div className="badge">{t('hero.badge')}</div>
          <div className="hero-heading-stack">
            <h1 className="hero-brand">{t('hero.brand')}</h1>
            <h2 className="hero-tagline">{t('hero.tagline')}</h2>
            <p className="hero-kicker">{t('hero.kicker')}</p>
          </div>
          <p className="hero-sub">{t('hero.subtitle')}</p>
          <div className="hero-btns">
            <a className="btn-primary" href="#download">{t('hero.ctaPrimary')}</a>
            <a className="btn-secondary" href="https://t.me/azerscope" target="_blank" rel="noreferrer">
              {t('hero.ctaSecondary')}
            </a>
          </div>
          <div className="store-badges" id="download">
            <a className="store-badge" href="#" aria-disabled="true">
              <img src="/assets/img/app-store.png" alt="App Store" />
            </a>
            <a className="store-badge" href="#" aria-disabled="true">
              <img src="/assets/img/google-play.png" alt="Google Play" />
            </a>
          </div>
          <p className="hero-note">{t('hero.note')}</p>
        </div>

        {/* Visual */}
        <div className="hero-visual">
          <div className="phone-mockup">
            <div className="phone-notch" />
            <div className="screen">
              <img src="/assets/img/screens/IMG_2217.png" alt="AzerScope preview" />
            </div>
          </div>
          <div className="glass hero-float-card">
            <p className="float-label">{t('hero.guestLabel')}</p>
            <div className="chips">
              <span className="chip chip-active">{t('hero.guest1')}</span>
              <span className="chip chip-active">{t('hero.guest2')}</span>
              <span className="chip chip-active">{t('hero.guest3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
