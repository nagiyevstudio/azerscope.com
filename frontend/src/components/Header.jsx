import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Send } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#features', key: 'nav.features' },
    { href: '#tools',    key: 'nav.tools'    },
    { href: '#trust',    key: 'nav.trust'    },
    { href: '#faq',      key: 'nav.faq'      },
  ];

  const langs = ['AZ', 'RU', 'EN'];

  return (
    <header className={`c-nav ${scrolled ? 'nav-scrolled' : ''} ${isOpen ? 'nav-open' : ''}`}>
      <div className="nav-inner page-wrap">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="AzerScope home">
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
            <span>Telegram</span>
          </a>

          <a className="btn-nav-cta" href="#download">{t('nav.download')}</a>
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
          <a className="btn-nav-cta" href="#download" onClick={() => setIsOpen(false)}>
            {t('nav.download')}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
