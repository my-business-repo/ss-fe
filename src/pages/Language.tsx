import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import type { LanguageCode } from '../i18n/translations';

interface Language {
  code: LanguageCode;
  name: string;
  flagColor: string;
  countryCode: string;
}

export default function Language() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = [
    { code: 'en', name: 'English', flagColor: '#B22234', countryCode: 'US' },
    { code: 'zh', name: '中文(繁体)', flagColor: '#DE2910', countryCode: 'CN' },
    { code: 'es', name: 'Español', flagColor: '#AA151B', countryCode: 'ES' },
    { code: 'pt', name: 'Português', flagColor: '#006600', countryCode: 'PT' },
    { code: 'it', name: 'Italiano', flagColor: '#009246', countryCode: 'IT' },
    { code: 'fr', name: 'Français', flagColor: '#002395', countryCode: 'FR' },
    { code: 'de', name: 'Deutsch', flagColor: '#FFCE00', countryCode: 'DE' },
    { code: 'ja', name: '日本語', flagColor: '#BC002D', countryCode: 'JP' },
    { code: 'ru', name: 'русский язык', flagColor: '#0039A6', countryCode: 'RU' },
    { code: 'ko', name: '한국어', flagColor: '#003478', countryCode: 'KR' },
    { code: 'ar', name: 'الإمارات العربية المتحدة', flagColor: '#00732F', countryCode: 'AE' },
    { code: 'tr', name: 'Türkçe', flagColor: '#E30A17', countryCode: 'TR' },
    { code: 'id', name: 'Bahasa Indonesia', flagColor: '#FF0000', countryCode: 'ID' },
    { code: 'kk', name: 'қазақ тілі', flagColor: '#00AFCA', countryCode: 'KZ' },
    { code: 'uk', name: 'Ukraine', flagColor: '#0057B7', countryCode: 'UA' },
  ];

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <div className="language-page">
      <header className="language-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </button>
        <h1 className="language-title">Language</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="language-content">
        <div className="language-grid">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-item ${language === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="flag-icon" style={{ backgroundColor: lang.flagColor }}>
                <span className="country-code">{lang.countryCode}</span>
              </div>
              <div className="language-name">{lang.name}</div>
            </button>
          ))}
        </div>
      </main>

      <style>{`
        .language-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .language-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border-primary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .back-btn {
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .back-btn:hover {
          background: var(--color-bg-tertiary);
        }

        .back-btn svg {
          font-size: 24px;
        }

        .language-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
        }

        .header-spacer {
          width: 40px;
        }

        .language-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 800px;
          margin: 0 auto;
        }

        .language-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
        }

        .language-item {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .language-item:hover {
          background: var(--color-bg-tertiary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .language-item.selected {
          background: #2c3e50;
          border-color: #2c3e50;
          color: #ffffff;
        }

        .language-item.selected .language-name {
          color: #ffffff;
        }

        .flag-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .country-code {
          color: #ffffff;
          font-size: var(--font-size-sm);
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .language-name {
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          text-align: center;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .language-header {
            padding: var(--space-md) var(--space-lg);
          }

          .language-title {
            font-size: var(--font-size-xl);
          }

          .language-content {
            padding: var(--space-lg);
          }

          .language-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
          }

          .language-item {
            padding: var(--space-lg);
          }

          .flag-icon {
            width: 48px;
            height: 48px;
          }

          .language-name {
            font-size: var(--font-size-xs);
          }
        }

        @media (max-width: 480px) {
          .language-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .language-title {
            font-size: var(--font-size-lg);
          }

          .header-spacer {
            width: 36px;
          }

          .language-content {
            padding: var(--space-md);
          }

          .language-grid {
            gap: var(--space-sm);
          }

          .language-item {
            padding: var(--space-md);
          }

          .flag-icon {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
