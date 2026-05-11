import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';

const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="section page-wrap" id="final-cta">
      <div className="cta-box">
        <div className="cta-glow" />
        <div className="section-label">{t('cta.label')}</div>
        <h2 className="cta-title" dangerouslySetInnerHTML={{ __html: t('cta.title') }} />
        <p className="cta-sub">{t('cta.sub')}</p>
        <div className="cta-btns">
          <a className="store-badge" href="https://apps.apple.com/az/app/azerscope/id6758908053" target="_blank" rel="noreferrer">
            <img src="/assets/img/app-store.png" alt="App Store" />
          </a>
          <a className="store-badge" href="https://play.google.com/store/apps/details?id=com.alterace.azerscope" target="_blank" rel="noreferrer">
            <img src="/assets/img/google-play.png" alt="Google Play" />
          </a>
          <a className="btn-secondary" href="https://t.me/azerscope" target="_blank" rel="noreferrer">
            <Send size={16} />
            {t('cta.tg')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
