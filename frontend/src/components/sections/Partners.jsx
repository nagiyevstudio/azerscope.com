import { useTranslation } from 'react-i18next';
import { Image } from 'lucide-react';

const partners = [
  { name:'Partner 01', t:'type1' },
  { name:'Partner 02', t:'type2' },
  { name:'Partner 03', t:'type3' },
  { name:'Partner 04', t:'type4' },
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
          <a className="glass partner-card" href="#" key={p.name} onClick={e => e.preventDefault()}>
            <span className="partner-badge"><Image size={22} /></span>
            <strong>{p.name}</strong>
            <small>{t(`partners.${p.t}`)}</small>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Partners;
