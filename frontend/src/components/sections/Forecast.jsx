import { useTranslation } from 'react-i18next';
import { Gauge, MapPin, Telescope } from 'lucide-react';

const forecastFeatures = [
  { key: 'f1', icon: <Gauge size={20} /> },
  { key: 'f2', icon: <MapPin size={20} /> },
  { key: 'f3', icon: <Telescope size={20} /> },
];

const Forecast = () => {
  const { t } = useTranslation();
  return (
    <section id="forecast" className="section page-wrap">
      <div className="section-label section-title--center">{t('forecast.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('forecast.title') }} />
      <p className="section-sub section-sub--center">{t('forecast.sub')}</p>
      <div className="c-features">
        {forecastFeatures.map(f => (
          <article className="feature-card glass" key={f.key}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{t(`forecast.${f.key}_title`)}</h3>
            <p>{t(`forecast.${f.key}_desc`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Forecast;
