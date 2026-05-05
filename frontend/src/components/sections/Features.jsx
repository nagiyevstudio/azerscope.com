import { useTranslation } from 'react-i18next';
import { Cloud, MoonStar, Compass, Library, CalendarDays, NotebookPen } from 'lucide-react';

const features = [
  { key: 'weather', icon: <Cloud size={20} /> },
  { key: 'sky',     icon: <MoonStar size={20} /> },
  { key: 'guide',   icon: <Compass size={20} /> },
  { key: 'lab',     icon: <Library size={20} /> },
  { key: 'events',  icon: <CalendarDays size={20} /> },
  { key: 'obs',     icon: <NotebookPen size={20} /> },
];

const Features = () => {
  const { t } = useTranslation();
  return (
    <section id="features" className="section page-wrap">
      <div className="section-label section-title--center">{t('features.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('features.title') }} />
      <p className="section-sub section-sub--center">{t('features.sub')}</p>
      <div className="c-features">
        {features.map(f => (
          <article className="feature-card glass" key={f.key}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{t(`features.${f.key}.t`)}</h3>
            <p>{t(`features.${f.key}.d`)}</p>
            <span className="tag">{t(`features.${f.key}.t`)}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;
