import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Send } from 'lucide-react';

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
