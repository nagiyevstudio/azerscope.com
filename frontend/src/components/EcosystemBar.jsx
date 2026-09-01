import { useTranslation } from 'react-i18next';
import { Smartphone, MapPin, ShoppingBag, ArrowUpRight } from 'lucide-react';

export const EcosystemBar = ({ current = 'app' }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'az').toLowerCase().slice(0, 2);
  const langPath = ['az', 'ru', 'en'].includes(currentLang) ? currentLang : 'az';

  const sites = [
    {
      id: 'app',
      name: t('ecosystem.app'),
      url: '/',
      isExternal: false,
      icon: Smartphone,
    },
    {
      id: 'locations',
      name: t('ecosystem.locations'),
      url: `/locations/${langPath}/`,
      isExternal: true,
      icon: MapPin,
    },
    {
      id: 'shop',
      name: t('ecosystem.shop'),
      url: 'https://shop.azerscope.com/',
      isExternal: true,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="ecosystem-bar">
      <div className="ecosystem-inner page-wrap">
        <div className="ecosystem-brand">
          <span className="ecosystem-dot" aria-hidden="true" />
          <span className="ecosystem-tag">{t('ecosystem.network')}</span>
        </div>

        <nav className="ecosystem-nav" aria-label="AzerScope Network">
          {sites.map((site) => {
            const Icon = site.icon;
            const isActive = site.id === current;

            return (
              <a
                key={site.id}
                href={site.url}
                className={`ecosystem-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                target={site.isExternal && site.url.startsWith('http') ? '_blank' : undefined}
                rel={site.isExternal && site.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Icon size={12} className="ecosystem-icon" />
                <span>{site.name}</span>
                {isActive && <span className="ecosystem-pill-dot" aria-hidden="true" />}
              </a>
            );
          })}
        </nav>

        <div className="ecosystem-right">
          <a
            href="https://t.me/azerscope"
            target="_blank"
            rel="noopener noreferrer"
            className="ecosystem-aux-link"
            title="Telegram Beta"
          >
            <span>{t('ecosystem.telegram')}</span>
            <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EcosystemBar;
