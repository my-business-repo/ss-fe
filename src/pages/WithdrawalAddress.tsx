import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import flightBg from '../assets/flight_preview.png';

export default function WithdrawalAddress() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [chainName, setChainName] = useState<'trc20' | 'erc20'>('trc20');
  const [walletAddress, setWalletAddress] = useState('');
  const [fundPassword, setFundPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Withdrawal Address Submitted:', { chainName, walletAddress, fundPassword });
    // Add submission logic here
  };

  return (
    <div className="withdrawal-address-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="page-title">{t('withdrawalAddress')}</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="page-content">
        <form onSubmit={handleSubmit} className="withdrawal-form">

          {/* Chain Name */}
          <div className="chain-section">
            <label className="section-label">{t('chainName')}</label>
            <div className="chain-buttons">
              <button
                type="button"
                className={`chain-btn ${chainName === 'trc20' ? 'active' : ''}`}
                onClick={() => setChainName('trc20')}
              >
                TRC-20
              </button>
              <button
                type="button"
                className={`chain-btn ${chainName === 'erc20' ? 'active' : ''}`}
                onClick={() => setChainName('erc20')}
              >
                ERC-20
              </button>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="form-group">
            <label className="form-label">
              <span className="required">*</span> {t('walletAddress')}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t('walletAddressCantBeEmpty')}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>

          {/* Fund Password */}
          <div className="form-group">
            <label className="form-label">
              <span className="required">*</span> {t('fundPassword')}
            </label>
            <input
              type="password"
              className="form-input"
              placeholder={t('enterFundPassword')}
              value={fundPassword}
              onChange={(e) => setFundPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">{t('submit')}</button>
        </form>
      </main>

      <style>{`
        .withdrawal-address-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .page-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          min-height: 180px;
          background-image: url('${flightBg}');
          background-size: cover;
          background-position: center;
          color: var(--color-text-primary);
          position: relative;
        }
        
        .page-header::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: var(--color-bg-glass);
             z-index: 0;
        }
        
        .page-header > * {
            position: relative;
            z-index: 1;
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
          position: absolute;
          top: 20px;
          left: 20px;
        }

        .back-btn svg {
          font-size: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        .page-content {
          padding: 32px 24px;
          max-width: 600px;
          margin: 0 auto;
        }

        .withdrawal-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .chain-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-label {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .chain-buttons {
          display: flex;
          gap: 16px;
        }

        .chain-btn {
          flex: 1;
          padding: 12px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: 4px;
          color: var(--color-text-primary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chain-btn.active {
          background: var(--color-accent-primary);
          color: white;
          border-color: var(--color-accent-primary);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .required {
          color: var(--color-accent-danger);
          margin-right: 4px;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          background: var(--color-bg-secondary);
          border: none;
          border-radius: 4px;
          color: var(--color-text-primary);
          font-size: 14px;
          border: 1px solid transparent;
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .form-input:focus {
          outline: none;
          background: var(--color-bg-tertiary);
          border-color: var(--color-accent-primary);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--color-accent-primary);
          border: none;
          border-radius: 4px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 32px;
          transition: background 0.3s;
        }

        .submit-btn:hover {
          background: var(--color-accent-primary-hover);
        }
      `}</style>
    </div>
  );
}
