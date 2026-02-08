import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import flightBg from '../assets/flight_preview.png';
import {
  getWithdrawalAddresses,
  addWithdrawalAddress,
  type WithdrawalAddress as WithdrawalAddressType
} from '../services/withdrawalAddressService';

export default function WithdrawalAddress() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [addresses, setAddresses] = useState<WithdrawalAddressType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const [chainName, setChainName] = useState<'trc20' | 'erc20'>('trc20');
  const [walletAddress, setWalletAddress] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await getWithdrawalAddresses();
      setAddresses(data);
      setError('');
    } catch (err) {
      console.error('Error fetching addresses:', err);
      // Don't show error to user immediately if it's just empty or network issue on load, 
      // but maybe helpful for debugging. 
      // sticking to console for now or minimal UI feedback.
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!walletAddress) {
        throw new Error(t('walletAddressCantBeEmpty'));
      }

      await addWithdrawalAddress({
        type: 'CRYPTO',
        network: chainName,
        address: walletAddress,
        accountName: accountName
      });

      // Refresh list and reset form
      await fetchAddresses();
      setWalletAddress('');
      setAccountName('');
      setShowForm(false);
      alert(t('withdrawalAddressAddedSub')); // Or some success message
    } catch (err) {
      console.error('Error adding address:', err);
      setError(err instanceof Error ? err.message : 'Failed to add address');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* List of Addresses */}
        <div className="address-list">
          <h2 className="section-title">Saved Addresses</h2>
          {isLoading ? (
            <div className="loading-state">Loading...</div>
          ) : addresses.length === 0 ? (
            <div className="empty-state">No withdrawal addresses found</div>
          ) : (
            <div className="address-grid">
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  <div className="address-header">
                    <span className="address-type">{addr.type}</span>
                    <span className="address-network">{addr.network}</span>
                  </div>
                  <div className="address-value">{addr.address}</div>
                  {/* If delete functionality is needed later, add button here */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Form Button */}
        {!showForm && (
          <button className="add-new-btn" onClick={() => setShowForm(true)}>
            + Add New Address
          </button>
        )}

        {/* Add New Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="withdrawal-form animate-slide-up">
            <h3 className="form-title">Add New Address</h3>

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
                disabled={isSubmitting}
              />
            </div>

            {/* Account Name */}
            <div className="form-group">
              <label className="form-label">
                {t('accountName')}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={t('accountName')}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : t('submit')}
              </button>
            </div>
          </form>
        )}
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

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--color-text-primary);
        }

        .address-list {
          margin-bottom: 32px;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 20px;
          color: var(--color-text-secondary);
          background: var(--color-bg-secondary);
          border-radius: 8px;
        }

        .address-card {
          background: var(--color-bg-secondary);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid var(--color-border-primary);
        }

        .address-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .address-type {
          font-size: 12px;
          font-weight: 600;
          background: var(--color-bg-tertiary);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .address-network {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-accent-primary);
          text-transform: uppercase;
        }

        .address-value {
          font-size: 14px;
          word-break: break-all;
          color: var(--color-text-primary);
        }

        .add-new-btn {
          width: 100%;
          padding: 16px;
          background: var(--color-bg-secondary);
          border: 1px dashed var(--color-border-primary);
          border-radius: 8px;
          color: var(--color-accent-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-new-btn:hover {
          background: var(--color-bg-tertiary);
          border-color: var(--color-accent-primary);
        }

        .withdrawal-form {
          background: var(--color-bg-secondary);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--color-border-primary);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-title {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
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
          background: var(--color-bg-primary);
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
          background: var(--color-bg-primary);
          border: none;
          border-radius: 4px;
          color: var(--color-text-primary);
          font-size: 14px;
          border: 1px solid var(--color-border-primary);
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-accent-primary);
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .cancel-btn {
          flex: 1;
          padding: 16px;
          background: transparent;
          border: 1px solid var(--color-border-primary);
          border-radius: 4px;
          color: var(--color-text-secondary);
          font-weight: 600;
          cursor: pointer;
        }

        .submit-btn {
          flex: 2;
          padding: 16px;
          background: var(--color-accent-primary);
          border: none;
          border-radius: 4px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--color-accent-primary-hover);
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
