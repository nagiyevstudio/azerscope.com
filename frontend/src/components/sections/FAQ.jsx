import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <section id="faq" className="section page-wrap">
      <div className="section-label section-title--center">{t('faq.label')}</div>
      <h2 className="section-title section-title--center" dangerouslySetInnerHTML={{ __html: t('faq.title') }} />
      <p className="section-sub section-sub--center">{t('faq.sub')}</p>

      <div className="c-faq">
        {items.map((n, i) => (
          <div className={`faq-item ${active === i ? 'active' : ''}`} key={n}>
            <button className="faq-q" onClick={() => setActive(active === i ? null : i)}>
              <span>{t(`faq.q${n}`)}</span>
              <ChevronDown size={18} style={{ flexShrink:0, transition:'transform .3s', transform: active === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            <div className="faq-a"><p>{t(`faq.a${n}`)}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
