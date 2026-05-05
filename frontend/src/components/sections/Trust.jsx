import { useTranslation } from 'react-i18next';

const trustItems = ['w','n','a','l','p','r'];

const Trust = () => {
  const { t } = useTranslation();
  return (
    <section id="trust" className="section page-wrap">
      <div className="section-label section-title--center">{t('trust.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('trust.title') }} />
      <p className="section-sub section-sub--center">{t('trust.sub')}</p>
      <div className="trust-grid">
        {trustItems.map(k => (
          <article className="trust-card glass" key={k}>
            <h3>{t(`trust.${k}T`)}</h3>
            <p>{t(`trust.${k}D`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Trust;
