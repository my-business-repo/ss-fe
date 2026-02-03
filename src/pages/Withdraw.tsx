import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useLanguage } from '../i18n/LanguageContext';

export default function Withdraw() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'trc20' | 'erc20'>('trc20');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const availableBalance = 503.96;

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdrawal submission
    console.log('Withdrawal submitted:', { method: selectedMethod, amount, password });
  };

  return (
    <div className="withdraw-page">
      <header className="withdraw-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="withdraw-title">{t('withdrawTitle')}</h1>
        <button className="menu-btn">
          <DescriptionIcon />
        </button>
      </header>

      <main className="withdraw-content">
        <div className="balance-card">
          <div className="balance-label">{t('withdrawalAmount')}</div>
          <div className="balance-amount">
            {availableBalance.toFixed(2)} <span className="currency">USDT</span>
          </div>
        </div>

        <div className="method-buttons">
          <button
            className={`method-btn ${selectedMethod === 'bank' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('bank')}
          >
            Bank
          </button>
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

        <form onSubmit={handleSubmit} className="withdraw-form">
          <div className="form-group">
            <label className="form-label">* {t('withdrawalAmount')}</label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                placeholder={t('enterAmount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                required
              />
              <button
                type="button"
                className="withdraw-all-btn"
                onClick={handleWithdrawAll}
              >
                {t('withdrawalAmount')}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">* {t('withdrawalPassword')}</label>
            <input
              type="password"
              className="form-input"
              placeholder={t('enterOldPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {t('submitWithdraw')}
          </button>
        </form>

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
        .withdraw-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .withdraw-header {
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

        .withdraw-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .withdraw-content {
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
          grid-template-columns: repeat(3, 1fr);
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

        .withdraw-form {
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

        .input-wrapper {
          position: relative;
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

        .withdraw-all-btn {
          position: absolute;
          right: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--color-accent-info);
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          padding: var(--space-xs) var(--space-sm);
          transition: all var(--transition-fast);
        }

        .withdraw-all-btn:hover {
          color: var(--color-accent-primary);
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
          margin-top: var(--space-lg);
        }

        .submit-btn:hover {
          background: #34495e;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
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
          .withdraw-header {
            padding: var(--space-md) var(--space-lg);
          }

          .withdraw-title {
            font-size: var(--font-size-xl);
          }

          .withdraw-content {
            padding: var(--space-lg);
          }

          .balance-card {
            padding: var(--space-xl);
          }

          .balance-amount {
            font-size: var(--font-size-3xl);
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

          .withdraw-all-btn {
            font-size: var(--font-size-xs);
            padding: var(--space-xs);
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
          .withdraw-header {
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

          .withdraw-title {
            font-size: var(--font-size-lg);
          }

          .withdraw-content {
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

          .withdraw-form {
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

        @media (max-width: 360px) {
          .balance-amount {
            font-size: var(--font-size-xl);
          }

          .withdraw-all-btn {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            margin-top: var(--space-sm);
            width: 100%;
          }

          .input-wrapper {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
