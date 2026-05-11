import { useTranslation } from 'react-i18next';
import { Users, GraduationCap, HandHeart, CheckCircle } from 'lucide-react';

const Access = () => {
  const { t } = useTranslation();

  const specials = [
    { key: 'hac', icon: <Users size={24} /> },
    { key: 'edu', icon: <GraduationCap size={24} /> },
    { key: 'vol', icon: <HandHeart size={24} /> },
  ];

  const features = ['fGuide', 'fWeather', 'fSky', 'fLab', 'fEvents', 'fObs'];

  return (
    <section id="access" className="section page-wrap">
      <div className="section-label">{t('access.label')}</div>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('access.title') }} />
      <p className="section-sub">{t('access.sub')}</p>

      <div className="access-layout">
        <article className="glass access-guest-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-label" style={{ marginBottom: '24px' }}>{t('access.mainLabel')}</div>
          <div className="access-guest-header">
            <CheckCircle size={32} className="access-check" />
            <h3 style={{ fontSize: '24px' }}>{t('access.mainTitle')}</h3>
          </div>
          <p style={{ fontSize: '15px', flex: 1, marginBottom: '32px' }}>{t('access.mainText')}</p>
          <div className="chips">
            {features.map(k => (
              <span key={k} className="chip chip-active" style={{ fontSize: '13px', padding: '6px 12px' }}>
                {t(`access.${k}`)}
              </span>
            ))}
          </div>
        </article>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {specials.map((s) => (
            <article className="glass" key={s.key} style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div className="feature-icon" style={{ marginBottom: 0, width: '48px', height: '48px' }}>
                {s.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  {t(`access.${s.key}Title`)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {t(`access.${s.key}Text`)}
                </p>
                <span className="tag">{t(`access.${s.key}Tag`)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '48px', fontSize: '14px', color: 'var(--dim)', maxWidth: '600px', marginInline: 'auto' }}>
        {t('access.bottomNote')}
      </p>
    </section>
  );
};

export default Access;
