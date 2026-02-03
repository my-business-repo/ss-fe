import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { useLanguage } from '../i18n/LanguageContext';

export default function CustomerService() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleServe = () => {
    navigate('/chat');
  };

  return (
    <div className="customer-service-page">
      <header className="service-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="service-title">{t('serve')}</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="service-content">
        <div className="service-image-container">
          <img
            src="/src/assets/customer_service_rep.png"
            alt="Customer Service Representative"
            className="service-image"
          />
        </div>

        <div className="service-card">
          <div className="service-icon">
            <HeadsetMicIcon />
          </div>

          <h2 className="service-heading">{t('customerService')}</h2>

          <p className="service-hours">Opening Hours 00:00-23:59 Daily</p>

          <button className="serve-btn" onClick={handleServe}>
            {t('serve')}
          </button>
        </div>
      </main>

      <style>{`
        .customer-service-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .service-header {
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

        .service-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .header-spacer {
          width: 40px;
        }

        .service-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }

        .service-image-container {
          width: 100%;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .service-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          aspect-ratio: 16 / 9;
        }

        .service-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-3xl) var(--space-2xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          box-shadow: var(--shadow-md);
        }

        .service-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          background: var(--color-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .service-icon svg {
          font-size: 32px;
        }

        .service-heading {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          text-align: center;
        }

        .service-hours {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
          text-align: center;
        }

        .serve-btn {
          width: 100%;
          padding: var(--space-lg);
          background: #2c3e50;
          border: none;
          border-radius: var(--radius-md);
          color: #ffffff;
          font-size: var(--font-size-base);
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-base);
          margin-top: var(--space-md);
        }

        .serve-btn:hover {
          background: #34495e;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .service-header {
            padding: var(--space-md) var(--space-lg);
          }

          .service-title {
            font-size: var(--font-size-xl);
          }

          .service-content {
            padding: var(--space-lg);
            gap: var(--space-xl);
          }

          .service-card {
            padding: var(--space-2xl) var(--space-xl);
          }

          .service-heading {
            font-size: var(--font-size-xl);
          }
        }

        @media (max-width: 480px) {
          .service-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .service-title {
            font-size: var(--font-size-lg);
          }

          .header-spacer {
            width: 36px;
          }

          .service-content {
            padding: var(--space-md);
            gap: var(--space-lg);
          }

          .service-card {
            padding: var(--space-xl) var(--space-lg);
          }

          .service-icon {
            width: 56px;
            height: 56px;
          }

          .service-icon svg {
            font-size: 28px;
          }

          .service-heading {
            font-size: var(--font-size-lg);
          }

          .service-hours {
            font-size: var(--font-size-xs);
          }

          .serve-btn {
            padding: var(--space-md);
          }
        }
      `}</style>
    </div>
  );
}
