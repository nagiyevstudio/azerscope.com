import { useTranslation } from 'react-i18next';

const Overview = () => {
  const { t } = useTranslation();
  return (
    <section id="overview" className="section page-wrap">
      <div className="section-label section-title--center">{t('overview.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('overview.title') }} />
      <p className="section-sub section-sub--center">{t('overview.sub')}</p>
      <div className="c-stats">
        {[
          { num: '8',  key: 'overview.s1' },
          { num: '7+', key: 'overview.s2' },
          { num: '3',  key: 'overview.s3' },
          { num: 'β',  key: 'overview.s4' },
        ].map(s => (
          <article className="stat-card glass" key={s.key}>
            <div className="number">{s.num}</div>
            <div className="label">{t(s.key)}</div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Overview;
