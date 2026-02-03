import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useLanguage } from '../i18n/LanguageContext';

export default function Deposit() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'trc20' | 'erc20'>('trc20');
  const [amount, setAmount] = useState('');
  const currentBalance = 0.00;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    // Navigate to upload page with deposit details
    navigate('/deposit-upload', { state: { amount, method: selectedMethod } });
  };

  return (
    <div className="deposit-page">
      <header className="deposit-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="deposit-title">{t('topUp')}</h1>
        <button className="menu-btn">
          <DescriptionIcon />
        </button>
      </header>

      <main className="deposit-content">
        <div className="balance-card">
          <div className="balance-label">{t('topUpAmount')}</div>
          <div className="balance-amount">
            {currentBalance.toFixed(2)} <span className="currency">USDT</span>
          </div>
        </div>

        <div className="method-buttons">
          <button
            className={`method-btn ${selectedMethod === 'trc20' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('trc20')}
          >
            TRC-20
          </button>
          <button
            className={`method-btn ${selectedMethod === 'erc20' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('erc20')}
          >
            ERC-20
          </button>
        </div>

        <form onSubmit={handleSubmit} className="deposit-form">
          <div className="form-group">
            <label className="form-label">* {t('rechargeAmount')}</label>
            <input
              type="number"
              className="form-input"
              placeholder={t('enterAmount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {t('submitDeposit')}
          </button>
        </form>

        <div className="notice-section">
          <p className="notice-title">Notice:</p>
          <p className="notice-text">1 Daily deposit time:00:00 - 23:59</p>
        </div>

        <div className="floating-actions">
          <button className="float-btn home-btn" onClick={() => navigate('/dashboard')}>
            <HomeIcon />
          </button>
          <button className="float-btn support-btn">
            <SupportAgentIcon />
          </button>
        </div>
      </main>

      <style>{`
        .deposit-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .deposit-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border-primary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn,
        .menu-btn {
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

        .back-btn:hover,
        .menu-btn:hover {
          background: var(--color-bg-tertiary);
        }

        .back-btn svg,
        .menu-btn svg {
          font-size: 24px;
        }

        .deposit-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .deposit-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .balance-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          margin-bottom: var(--space-2xl);
        }

        .balance-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-sm);
        }

        .balance-amount {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .currency {
          font-size: var(--font-size-lg);
          font-weight: 400;
          color: var(--color-text-secondary);
        }

        .method-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
        }

        .method-btn {
          padding: var(--space-md) var(--space-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .method-btn:hover {
          background: var(--color-bg-tertiary);
        }

        .method-btn.active {
          background: #2c3e50;
          color: #ffffff;
          border-color: #2c3e50;
        }

        .deposit-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .form-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: var(--space-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          transition: all var(--transition-fast);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
        }

        .form-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .submit-btn {
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
        }

        .submit-btn:hover {
          background: #34495e;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .notice-section {
          margin-top: var(--space-2xl);
          padding: var(--space-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
        }

        .notice-title {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 var(--space-xs) 0;
          font-weight: 600;
        }

        .notice-text {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .floating-actions {
          position: fixed;
          right: var(--space-xl);
          bottom: var(--space-3xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .float-btn {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-base);
        }

        .float-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
        }

        .float-btn svg {
          font-size: 28px;
        }

        .home-btn {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
        }

        .support-btn {
          background: #2c3e50;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .deposit-header {
            padding: var(--space-md) var(--space-lg);
          }

          .deposit-title {
            font-size: var(--font-size-xl);
          }

          .deposit-content {
            padding: var(--space-lg);
          }

          .balance-amount {
            font-size: var(--font-size-3xl);
          }

          .balance-card {
            padding: var(--space-xl);
          }

          .method-buttons {
            gap: var(--space-sm);
          }

          .method-btn {
            padding: var(--space-md);
            font-size: var(--font-size-sm);
          }

          .form-input {
            padding: var(--space-md);
            font-size: var(--font-size-sm);
          }

          .submit-btn {
            padding: var(--space-md);
          }

          .floating-actions {
            right: var(--space-lg);
            bottom: var(--space-2xl);
          }

          .float-btn {
            width: 48px;
            height: 48px;
          }

          .float-btn svg {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .deposit-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn,
          .menu-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg,
          .menu-btn svg {
            font-size: 20px;
          }

          .deposit-title {
            font-size: var(--font-size-lg);
          }

          .deposit-content {
            padding: var(--space-md);
          }

          .balance-card {
            padding: var(--space-lg);
          }

          .balance-amount {
            font-size: var(--font-size-2xl);
          }

          .currency {
            font-size: var(--font-size-base);
          }

          .method-buttons {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
          }

          .method-btn {
            width: 100%;
          }

          .deposit-form {
            gap: var(--space-lg);
          }

          .floating-actions {
            right: var(--space-md);
            bottom: var(--space-xl);
          }

          .float-btn {
            width: 44px;
            height: 44px;
          }

          .float-btn svg {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
