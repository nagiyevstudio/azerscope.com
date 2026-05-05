import { useTranslation } from 'react-i18next';
import { Users, GraduationCap, HandHeart, Gift, CheckCircle } from 'lucide-react';

const Access = () => {
  const { t } = useTranslation();

  const specials = [
    { key: 'hac', icon: <Users size={22} />, tag: 'hacTag' },
    { key: 'edu', icon: <GraduationCap size={22} />, tag: 'eduTag' },
    { key: 'vol', icon: <HandHeart size={22} />, tag: 'volTag' },
    { key: 'gen', icon: <Gift size={22} />, tag: 'genTag' },
  ];

  const freePillars = ['hero.guest1', 'hero.guest2', 'hero.guest3'];

  return (
    <section id="access" className="section page-wrap">
      <div className="section-label">{t('access.label')}</div>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('access.freeTitle') }} />
      <p className="section-sub">{t('access.freeSub')}</p>

      <div className="access-layout">
        <article className="glass access-guest-card">
          <div className="access-guest-header">
            <CheckCircle size={28} className="access-check" />
            <h3>{t('access.guestT')}</h3>
          </div>
          <p>{t('access.guestD')}</p>
          <div className="chips">
            {freePillars.map(k => (
              <span key={k} className="chip chip-active">{t(k)}</span>
            ))}
          </div>
        </article>

        <div className="access-specials-grid">
          {specials.map((s) => (
            <article className="feature-card glass" key={s.key}>
              <div className="feature-icon">{s.icon}</div>
              <h3>{s.key.toUpperCase()}</h3>
              <p>{t(`access.${s.key}`)}</p>
              <span className="tag">{t(`access.${s.tag}`)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Access;
