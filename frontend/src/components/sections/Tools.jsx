import { useTranslation } from 'react-i18next';
import { Search, Scan, Replace, SlidersHorizontal, Timer, Compass, Aperture, Wrench } from 'lucide-react';

const toolsList = [
  { k:'t1', icon:<Search size={18}/> },
  { k:'t2', icon:<Scan size={18}/> },
  { k:'t3', icon:<Replace size={18}/> },
  { k:'t4', icon:<SlidersHorizontal size={18}/> },
  { k:'t5', icon:<Timer size={18}/> },
  { k:'t6', icon:<Compass size={18}/> },
  { k:'t7', icon:<Aperture size={18}/> },
  { k:'t8', icon:<Wrench size={18}/> },
];

const Tools = () => {
  const { t } = useTranslation();
  return (
    <section id="tools" className="section page-wrap">
      <div className="section-label section-title--center">{t('tools.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('tools.title') }} />
      <p className="section-sub section-sub--center">{t('tools.sub')}</p>
      <div className="c-features compact-grid">
        {toolsList.map(({ k, icon }) => (
          <article className="feature-card glass" key={k}>
            <div className="feature-icon">{icon}</div>
            <h3>{t(`tools.${k}`)}</h3>
            <p>{t(`tools.d${k.slice(1)}`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Tools;
