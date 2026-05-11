import { useTranslation } from 'react-i18next';

const partners = [
  { key: 'hac',  logo: '/assets/img/partners/hac.png',     url: 'https://astronomy.az/' },
  { key: 'tusi', logo: '/assets/img/partners/tusi.png',    url: 'https://planetarium.az/' },
  { key: 'ns',   logo: '/assets/img/partners/ns.png',      url: 'https://nagiyev.com/' },
  { key: 'log',  logo: '/assets/img/partners/logitaka.png', url: 'https://logitaka.com/' },
];

const Partners = () => {
  const { t } = useTranslation();
  return (
    <section id="partners" className="section page-wrap">
      <div className="section-label section-title--center">{t('partners.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('partners.title') }} />
      <p className="section-sub section-sub--center">{t('partners.sub')}</p>
      <div className="partners-grid">
        {partners.map(p => (
          <a className="partner-card" href={p.url} key={p.key} target="_blank" rel="noopener noreferrer">
            <img className="partner-logo" src={p.logo} alt={t(`partners.${p.key}`)} />
            <strong>{t(`partners.${p.key}`)}</strong>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Partners;