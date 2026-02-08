import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useLanguage } from '../i18n/LanguageContext';
import { submitWithdrawal } from '../services/withdrawalService';
import { getCustomerInfo } from '../services/customerService';
import { getWithdrawalAddresses, type WithdrawalAddress as WithdrawalAddressType } from '../services/withdrawalAddressService';

export default function Withdraw() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'trc20' | 'erc20'>('trc20');
  const [amount, setAmount] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<WithdrawalAddressType[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Fetch user balance and addresses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerData = localStorage.getItem('customer');
        if (!customerData) {
          setError('Please sign in to continue');
          setIsLoadingBalance(false);
          return;
        }

        const customer = JSON.parse(customerData);

        // Parallel fetching
        const [customers, addresses] = await Promise.all([
          getCustomerInfo(),
          getWithdrawalAddresses()
        ]);

        // Process balance
        const currentCustomer = customers.find(c => c.email === customer.email || c.id === customer.id);
        if (currentCustomer && currentCustomer.accounts && currentCustomer.accounts.length > 0) {
          const activeAccount = currentCustomer.accounts.find(acc => acc.status === 'active');
          if (activeAccount) {
            setAvailableBalance(activeAccount.balance);
          }
        }

        // Process addresses
        setSavedAddresses(addresses);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load account data');
      } finally {
        setIsLoadingBalance(false);
        setIsLoadingAddresses(false);
      }
    };

    fetchData();
  }, []);

  // Filter addresses based on selected method
  const filteredAddresses = savedAddresses.filter(
    addr => addr.type === 'CRYPTO' && addr.network?.toLowerCase() === selectedMethod.toLowerCase()
  );

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Get customer info from localStorage to verify authentication
      const customerData = localStorage.getItem('customer');
      if (!customerData) {
        setError('Please sign in to continue');
        setIsSubmitting(false);
        return;
      }

      const customer = JSON.parse(customerData);

      // Fetch latest customer info including accounts from API
      const customers = await getCustomerInfo();

      // Find the current customer by email or ID
      const currentCustomer = customers.find(c => c.email === customer.email || c.id === customer.id);

      if (!currentCustomer || !currentCustomer.accounts || currentCustomer.accounts.length === 0) {
        setError('Account information not found. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Get the first active account
      const activeAccount = currentCustomer.accounts.find(acc => acc.status === 'active');

      if (!activeAccount) {
        setError('No active account found. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Submit withdrawal request
      const response = await submitWithdrawal({
        accountId: activeAccount.id,
        amount: parseFloat(amount),
        address: withdrawalAddress,
      });

      // Show success message
      alert(`Withdrawal request submitted successfully!\nTransaction ID: ${response.transaction.transaction_id}\nAmount: $${response.transaction.amount}\nAddress: ${response.transaction.address}\nStatus: ${response.transaction.status}`);

      // Clear form and navigate
      setAmount('');
      setWithdrawalAddress('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      console.error('Withdrawal submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit withdrawal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="withdraw-page">
      <header className="withdraw-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="withdraw-title">{t('withdrawTitle')}</h1>
        <button className="menu-btn" onClick={() => navigate('/withdrawal-address')}>
          <DescriptionIcon />
        </button>
      </header>

      <main className="withdraw-content">
        <div className="balance-card">
          <div className="balance-label">{t('withdrawalAmount')}</div>
          <div className="balance-amount">
            {isLoadingBalance ? (
              <span style={{ color: 'var(--color-text-secondary)' }}>Loading...</span>
            ) : (
              <>
                {availableBalance.toFixed(2)} <span className="currency">USDT</span>
              </>
            )}
          </div>
        </div>

        <div className="method-buttons">
          <button
            className={`method-btn ${selectedMethod === 'trc20' ? 'active' : ''}`}
            onClick={() => {
              setSelectedMethod('trc20');
              setWithdrawalAddress(''); // Reset address when changing network
            }}
          >
            TRC-20
          </button>
          <button
            className={`method-btn ${selectedMethod === 'erc20' ? 'active' : ''}`}
            onClick={() => {
              setSelectedMethod('erc20');
              setWithdrawalAddress(''); // Reset address when changing network
            }}
          >
            ERC-20
          </button>
        </div>

        <form onSubmit={handleSubmit} className="withdraw-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="withdraw-all-btn"
                onClick={handleWithdrawAll}
                disabled={isSubmitting}
              >
                {t('withdrawalAmount')}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">* Withdrawal Address</label>
              <button
                type="button"
                className="add-address-link"
                onClick={() => navigate('/withdrawal-address')}
              >
                + Add New
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="loading-text">Loading addresses...</div>
            ) : filteredAddresses.length > 0 ? (
              <select
                className="form-select"
                value={withdrawalAddress}
                onChange={(e) => setWithdrawalAddress(e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select withdrawal address</option>
                {filteredAddresses.map((addr) => (
                  <option key={addr.id} value={addr.address}>
                    {addr.accountName ? `${addr.accountName} - ` : ''}{addr.address}
                  </option>
                ))}
              </select>
            ) : (
              <div className="no-address-message">
                No {selectedMethod.toUpperCase()} addresses found.
                <button type="button" onClick={() => navigate('/withdrawal-address')}>Add one now</button>
              </div>
            )}
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
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : t('submitWithdraw')}
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

        .withdraw-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          border: 1px solid #fcc;
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

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-address-link {
          background: transparent;
          border: none;
          color: var(--color-accent-primary);
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .add-address-link:hover {
          text-decoration: underline;
        }

        .form-select {
          width: 100%;
          padding: var(--space-lg);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          outline: none;
          cursor: pointer;
          appearance: none; /* Consider custom arrow if needed */
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }

        .form-select:focus {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 3px var(--color-accent-primary-alpha);
        }

        .no-address-message {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          padding: var(--space-md);
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .no-address-message button {
          background: transparent;
          border: none;
          color: var(--color-accent-primary);
          font-weight: 600;
          cursor: pointer;
          margin-left: var(--space-xs);
          padding: 0;
          text-decoration: underline;
        }

        .loading-text {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          padding: var(--space-sm) 0;
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

        .submit-btn:disabled,
        .form-input:disabled,
        .withdraw-all-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn:disabled:hover {
          transform: none;
          background: #2c3e50;
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
