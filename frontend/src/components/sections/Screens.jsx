import { useTranslation } from 'react-i18next';

const screens = [
  { src:'/assets/img/screens/IMG_2217.png', k:'i1' },
  { src:'/assets/img/screens/IMG_2218.png', k:'i2' },
  { src:'/assets/img/screens/IMG_2219.png', k:'i3' },
  { src:'/assets/img/screens/IMG_2220.png', k:'i4' },
  { src:'/assets/img/screens/IMG_2221.png', k:'i5' },
  { src:'/assets/img/screens/IMG_2222.png', k:'i6' },
];

const Screens = () => {
  const { t } = useTranslation();
  return (
    <section id="screens" className="section page-wrap">
      <div className="section-label section-title--center">{t('screens.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('screens.title') }} />
      <p className="section-sub section-sub--center">{t('screens.sub')}</p>
      <div className="c-screenshots">
        {screens.map(s => (
          <figure className="screenshot-item" key={s.k}>
            <img src={s.src} alt={t(`screens.${s.k}`)} loading="lazy" />
            <figcaption className="screen-label">{t(`screens.${s.k}`)}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default Screens;
