import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'PRO',
      monthly: '1.99',
      yearly: '19.99',
      featured: true,
      features: ['pro1', 'pro2', 'pro3', 'pro4']
    },
    {
      name: 'PREMIUM',
      monthly: '4.99',
      yearly: '49.99',
      featured: false,
      features: ['prem1', 'prem2', 'prem3', 'prem4']
    },
    {
      name: 'ELITE',
      monthly: '99',
      yearly: '1200',
      featured: false,
      features: ['elite1', 'elite2', 'elite3', 'elite4']
    }
  ];

  return (
    <section id="pricing" className="section page-wrap">
      <div className="section-label">{t('pricing.label')}</div>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('pricing.title') }}></h2>
      <p className="section-sub">{t('pricing.sub')}</p>
      
      <div className="billing-toggle">
        <button 
          className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          {t('pricing.monthly')}
        </button>
        <button 
          className={`billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('yearly')}
        >
          {t('pricing.yearly')}
        </button>
      </div>
      
      <p className="billing-caption">{t('pricing.caption')}</p>
      
      <div className="c-pricing">
        {plans.map((plan) => (
          <article className={`pricing-card glass ${plan.featured ? 'featured glass-gold' : ''}`} key={plan.name}>
            {plan.featured && <div className="popular-badge">{t('pricing.recommended')}</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="price">
              <sup>$</sup>
              <span>{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</span>
            </div>
            <div className="price-period">
              {billingCycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
            </div>
            <ul className="pricing-features">
              {plan.features.map((f, i) => (
                <li key={i}>
                  <Check size={16} />
                  <span>{t(`pricing.${f}`)}</span>
                </li>
              ))}
            </ul>
            <button className={`pricing-cta ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
              {t('pricing.buy')}
            </button>
          </article>
        ))}
      </div>
      
      <div className="glass pricing-disclaimer">
        <p>{t('pricing.disclaimer')}</p>
      </div>
    </section>
  );
};

export default Pricing;
