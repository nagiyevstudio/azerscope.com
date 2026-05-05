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
          <a className="btn-primary" href="#download">{t('cta.dl')}</a>
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
