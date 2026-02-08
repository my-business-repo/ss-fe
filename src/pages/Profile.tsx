import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyReferral = () => {
    // Try to get referral code from user context first, then localStorage, then fallback
    let referralCode = user?.referCode;

    if (!referralCode) {
      try {
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
          const parsedCustomer = JSON.parse(storedCustomer);
          referralCode = parsedCustomer.referCode;
        }
      } catch (e) {
        console.error('Error reading customer from local storage', e);
      }
    }

    referralCode = referralCode || 'INVITE2026';

    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="profile-title">{t('profile')}</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-icon">
              <svg viewBox="0 0 100 100" className="wings-icon">
                <path d="M50 20 L30 50 L20 45 L30 60 L50 40 L70 60 L80 45 L70 50 Z" fill="currentColor" />
                <path d="M50 40 L40 65 L35 60 L40 75 L50 55 L60 75 L65 60 L60 65 Z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="profile-info">
            <h2 className="username">
              {user?.name || 'User'} <StarIcon className="vip-star" /> {user?.level?.name || 'VIP1'}
            </h2>
            <div className="referral-section">
              <span className="referral-label">{t('referralCode')}: </span>
              <span className="referral-code">
                {user?.referCode || (() => {
                  try {
                    const stored = localStorage.getItem('customer');
                    return stored ? JSON.parse(stored).referCode : null;
                  } catch { return null; }
                })() || 'INVITE2026'}
              </span>
              <button
                className="copy-btn"
                onClick={handleCopyReferral}
                title="Copy referral code"
              >
                <ContentCopyIcon />
              </button>
              {copySuccess && <span className="copy-success">Copied!</span>}
            </div>
          </div>

          <div className="credit-section">
            <div className="credit-header">
              <span className="credit-label">{t('creditScore')}</span>
              <span className="credit-value">100%</span>
            </div>
            <div className="credit-bar">
              <div className="credit-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <button className="setting-item" onClick={() => navigate('/change-login-password')}>
            <span className="setting-text">{t('changeLoginPassword')}</span>
            <ArrowForwardIcon className="setting-arrow" />
          </button>

          <button className="setting-item" onClick={() => navigate('/change-fund-password')}>
            <span className="setting-text">{t('changeFundPassword')}</span>
            <ArrowForwardIcon className="setting-arrow" />
          </button>
        </div>
      </main>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .profile-header {
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

        .profile-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
        }

        .header-spacer {
          width: 40px;
        }

        .profile-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .profile-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .avatar-section {
          display: flex;
          justify-content: center;
        }

        .avatar-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .wings-icon {
          width: 50px;
          height: 50px;
        }

        .profile-info {
          text-align: center;
        }

        .username {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 var(--space-md) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
        }

        .vip-star {
          color: #fbbf24;
          font-size: var(--font-size-lg);
        }

        .referral-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          font-size: var(--font-size-sm);
        }

        .referral-label {
          color: var(--color-text-secondary);
        }

        .referral-code {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .copy-btn:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .copy-btn svg {
          font-size: 18px;
        }

        .copy-success {
          font-size: var(--font-size-xs);
          color: #10b981;
          font-weight: 600;
        }

        .credit-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .credit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .credit-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .credit-value {
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .credit-bar {
          width: 100%;
          height: 8px;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .credit-fill {
          height: 100%;
          background: linear-gradient(90deg, #000000 0%, #2c3e50 100%);
          transition: width var(--transition-base);
          border-radius: var(--radius-full);
        }

        .settings-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
        }

        .setting-item {
          background: transparent;
          border: none;
          padding: var(--space-lg) var(--space-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all var(--transition-fast);
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-item:hover {
          background: var(--color-bg-tertiary);
        }

        .setting-text {
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
          font-weight: 500;
          text-align: left;
        }

        .setting-arrow {
          color: var(--color-text-secondary);
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: var(--space-md) var(--space-lg);
          }

          .profile-title {
            font-size: var(--font-size-xl);
          }

          .profile-content {
            padding: var(--space-lg);
          }

          .profile-card {
            padding: var(--space-xl);
          }

          .avatar-icon {
            width: 70px;
            height: 70px;
          }

          .wings-icon {
            width: 40px;
            height: 40px;
          }

          .username {
            font-size: var(--font-size-lg);
          }
        }

        @media (max-width: 480px) {
          .profile-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .profile-title {
            font-size: var(--font-size-lg);
          }

          .header-spacer {
            width: 36px;
          }

          .profile-content {
            padding: var(--space-md);
            gap: var(--space-lg);
          }

          .profile-card {
            padding: var(--space-lg);
          }

          .avatar-icon {
            width: 60px;
            height: 60px;
          }

          .wings-icon {
            width: 35px;
            height: 35px;
          }

          .username {
            font-size: var(--font-size-base);
          }

          .referral-section {
            font-size: var(--font-size-xs);
          }

          .setting-text {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </div>
  );
}
