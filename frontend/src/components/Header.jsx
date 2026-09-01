import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Send, Smartphone, MapPin, ShoppingBag } from 'lucide-react';
import EcosystemBar from './EcosystemBar';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentLang = (i18n.language || 'az').toLowerCase().slice(0, 2);
  const langPath = ['az', 'ru', 'en'].includes(currentLang) ? currentLang : 'az';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#features', key: 'nav.features' },
    { href: '#tools',    key: 'nav.tools'    },
    { href: '#trust',    key: 'nav.trust'    },
  ];

  const ecosystemLinks = [
    { id: 'app', name: t('ecosystem.app'), desc: t('ecosystem.appDesc'), url: '/', active: true, icon: Smartphone },
    { id: 'locations', name: t('ecosystem.locations'), desc: t('ecosystem.locationsDesc'), url: `/locations/${langPath}/`, active: false, icon: MapPin },
    { id: 'shop', name: t('ecosystem.shop'), desc: t('ecosystem.shopDesc'), url: 'https://shop.azerscope.com/', active: false, icon: ShoppingBag },
  ];

  const langs = ['AZ', 'RU', 'EN'];

  return (
    <header className={`c-nav ${scrolled ? 'nav-scrolled' : ''} ${isOpen ? 'nav-open' : ''}`}>
      <EcosystemBar current="app" />

      <div className="nav-inner page-wrap">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="AzerScope home" onClick={() => setIsOpen(false)}>
          <img src="/assets/img/logo.png" alt="AzerScope" />
        </Link>

        {/* Desktop links */}
        <nav className="nav-links" aria-label="Main navigation">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="nav-link">
              {t(l.key)}
            </a>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="nav-right">
          <div className="lang-pill">
            {langs.map(lng => (
              <button
                key={lng}
                className={`lang-btn ${i18n.language.toUpperCase().startsWith(lng) ? 'active' : ''}`}
                onClick={() => changeLanguage(lng.toLowerCase())}
              >
                {lng}
              </button>
            ))}
          </div>

          <a
            className="nav-tg"
            href="https://t.me/azerscope"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram Beta"
          >
            <Send size={15} />
          </a>
        </div>

        {/* Burger */}
        <button
          className="nav-burger"
          onClick={() => setIsOpen(o => !o)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-ecosystem">
          <div className="drawer-section-title">{t('ecosystem.network')}</div>
          <div className="drawer-ecosystem-grid">
            {ecosystemLinks.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  className={`drawer-ecosystem-card ${item.active ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div className="drawer-card-icon">
                    <Icon size={16} />
                  </div>
                  <div className="drawer-card-info">
                    <div className="drawer-card-name">
                      {item.name}
                      {item.active && <span className="drawer-active-badge">Cari</span>}
                    </div>
                    <div className="drawer-card-desc">{item.desc}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="drawer-section-divider" />

        <nav className="drawer-links">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="drawer-link" onClick={() => setIsOpen(false)}>
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="drawer-bottom">
          <div className="lang-pill">
            {langs.map(lng => (
              <button
                key={lng}
                className={`lang-btn ${i18n.language.toUpperCase().startsWith(lng) ? 'active' : ''}`}
                onClick={() => changeLanguage(lng.toLowerCase())}
              >
                {lng}
              </button>
            ))}
          </div>

          <a
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            href="https://t.me/azerscope"
            target="_blank"
            rel="noreferrer"
          >
            <Send size={14} />
            <span>{t('ecosystem.telegram')}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

