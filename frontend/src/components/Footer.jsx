import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="c-footer page-wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo logo-image footer-logo">
            <img src="/assets/img/logo.png" alt="AzerScope" />
          </Link>
          <p>{t('footer.desc')}</p>
        </div>
        
        <div className="footer-col">
          <h4>{t('footer.product')}</h4>
          <ul>
            <li><a href="#features">{t('footer.features')}</a></li>
            <li><a href="#tools">{t('footer.tools')}</a></li>
            <li><a href="#pricing">{t('footer.plans')}</a></li>
            <li><a href="#access">{t('footer.access')}</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>{t('footer.company')}</h4>
          <ul>
            <li><a href="#trust">{t('footer.trust')}</a></li>
            <li><a href="#partners">{t('footer.partners')}</a></li>
            <li><a href="https://t.me/azerscope" target="_blank" rel="noreferrer">{t('footer.beta')}</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
            <li><a href="#download">{t('footer.store')}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copy')}</p>
        
        <div className="footer-langs" aria-label="Language switcher">
          <button 
            className={`lang-btn ${i18n.language === 'az' ? 'active' : ''}`} 
            onClick={() => changeLanguage('az')}
          >AZ</button>
          <button 
            className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`} 
            onClick={() => changeLanguage('ru')}
          >RU</button>
          <button 
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} 
            onClick={() => changeLanguage('en')}
          >EN</button>
        </div>

        <div className="social-links">
          <a className="social-btn" href="https://www.instagram.com/azerscope/" target="_blank" rel="noreferrer" title="Instagram">
            <Instagram size={18} />
          </a>
          <a className="social-btn" href="https://www.linkedin.com/company/azerscope" target="_blank" rel="noreferrer" title="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a className="social-btn" href="https://t.me/azerscope" target="_blank" rel="noreferrer" title="Telegram">
            <Send size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
