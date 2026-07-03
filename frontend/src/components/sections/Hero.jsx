import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="hero-shell">
      <div className="page-wrap">
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
            <div className="store-badges" id="download">
              <a className="store-badge" href="https://apps.apple.com/us/app/azerscope/id6758908053" target="_blank" rel="noreferrer">
                <img src="/assets/img/app-store.png" alt="Download on the App Store" />
              </a>
              <a className="store-badge" href="https://play.google.com/store/apps/details?id=com.alterace.azerscope" target="_blank" rel="noreferrer">
                <img src="/assets/img/google-play.png" alt="Get it on Google Play" />
              </a>
            </div>
          </div>

          {/* Visual Placeholder for background phone */}
          <div className="hero-visual-spacer" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
