import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { QRCodeSVG } from 'qrcode.react';
import { submitDeposit } from '../services/depositService';
import { getCustomerInfo } from '../services/customerService';

export default function DepositUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, method } = location.state || { amount: '0.00', method: 'trc20' };

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(''); // Clear any previous errors
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      setError('Please upload payment proof');
      return;
    }

    setIsSubmitting(true);
    setError('');

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

      // Submit deposit request
      const response = await submitDeposit({
        accountId: activeAccount.id,
        amount: parseFloat(amount),
        proofImage: uploadedFile,
      });

      // Show success message
      alert(`Deposit request submitted successfully!\nTransaction ID: ${response.transaction.transaction_id}\nStatus: ${response.transaction.status}`);

      // Navigate to dashboard or transaction history
      navigate('/dashboard');
    } catch (err) {
      console.error('Deposit submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit deposit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="deposit-upload-page">
      <header className="upload-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </button>
        <h1 className="upload-title">Top-up</h1>
        <button className="menu-btn">
          <DescriptionIcon />
        </button>
      </header>

      <main className="upload-content">
        <div className="info-card">
          <div className="info-label">Top-Up Amount</div>
          <div className="info-amount">
            {amount} <span className="currency">USDT</span>
          </div>
          <div className="info-method">Method: {method.toUpperCase()}</div>

          <div className="bitcoin-info">
            <div className="bitcoin-address-section">
              <label className="bitcoin-label">Bitcoin Address</label>
              <div className="address-container">
                <input
                  type="text"
                  className="address-input"
                  value="abcdefghijklmnop"
                  readOnly
                />
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText('abcdefghijklmnop');
                    alert('Bitcoin address copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="qr-code-section">
              <div className="qr-code-container">
                <QRCodeSVG
                  value="abcdefghijklmnop"
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="qr-hint">Scan QR code to get Bitcoin address</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label className="form-label">* Upload Payment Proof</label>
            <p className="form-hint">Please upload a screenshot of your payment transaction</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="upload-area">
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Payment proof" className="preview-image" />
                  <button
                    type="button"
                    className="change-btn"
                    onClick={() => document.getElementById('file-input')?.click()}
                    disabled={isSubmitting}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label htmlFor="file-input" className="upload-label">
                  <CloudUploadIcon className="upload-icon" />
                  <span className="upload-text">Click to upload image</span>
                  <span className="upload-subtext">Supports: JPG, PNG (Max 10MB)</span>
                </label>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>

        <div className="notice-section">
          <p className="notice-title">Notice:</p>
          <p className="notice-text">1. Please ensure the payment proof is clear and readable</p>
          <p className="notice-text">2. Deposit will be processed within 10-30 minutes</p>
          <p className="notice-text">3. Contact customer service if you need assistance</p>
        </div>
      </main>

      <style>{`
        .deposit-upload-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .upload-header {
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

        .upload-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
          text-align: center;
        }

        .upload-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 600px;
          margin: 0 auto;
        }

        .info-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          margin-bottom: var(--space-2xl);
          text-align: center;
        }

        .info-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-sm);
        }

        .info-amount {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
        }

        .currency {
          font-size: var(--font-size-lg);
          font-weight: 400;
          color: var(--color-text-secondary);
        }

        .info-method {
          font-size: var(--font-size-sm);
          color: var(--color-accent-primary);
          font-weight: 600;
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid var(--color-border-primary);
        }

        .bitcoin-info {
          margin-top: var(--space-xl);
        }

        .bitcoin-address-section {
          margin-bottom: var(--space-xl);
        }

        .bitcoin-label {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          font-weight: 600;
          margin-bottom: var(--space-sm);
          text-align: left;
        }

        .address-container {
          display: flex;
          gap: var(--space-md);
          align-items: center;
        }

        .address-input {
          flex: 1;
          padding: var(--space-md);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
          font-family: monospace;
          text-align: center;
        }

        .copy-btn {
          padding: var(--space-md) var(--space-lg);
          background: #2c3e50;
          border: none;
          border-radius: var(--radius-md);
          color: #ffffff;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .copy-btn:hover {
          background: #34495e;
        }

        .qr-code-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qr-code-container {
          background: white;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .qr-hint {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          text-align: center;
          margin: 0;
        }

        .upload-form {
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

        .form-hint {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          border: 1px solid #fcc;
          margin-bottom: var(--space-md);
        }

        .upload-area {
          border: 2px dashed var(--color-border-primary);
          border-radius: var(--radius-lg);
          padding: var(--space-2xl);
          background: var(--color-bg-secondary);
          transition: all var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--color-accent-primary);
          background: var(--color-bg-tertiary);
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          cursor: pointer;
        }

        .upload-icon {
          font-size: 64px;
          color: var(--color-accent-primary);
        }

        .upload-text {
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .upload-subtext {
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }

        .file-input {
          display: none;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
        }

        .preview-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: var(--radius-md);
          object-fit: contain;
        }

        .change-btn {
          padding: var(--space-sm) var(--space-xl);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .change-btn:hover {
          background: var(--color-bg-elevated);
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

        .submit-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
          transform: none;
          opacity: 0.6;
        }

        .change-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          margin: var(--space-xs) 0;
        }

        @media (max-width: 768px) {
          .upload-header {
            padding: var(--space-md) var(--space-lg);
          }

          .upload-title {
            font-size: var(--font-size-xl);
          }

          .upload-content {
            padding: var(--space-lg);
          }

          .info-amount {
            font-size: var(--font-size-3xl);
          }

          .info-card {
            padding: var(--space-xl);
          }

          .upload-icon {
            font-size: 48px;
          }

          .address-container {
            flex-direction: column;
            align-items: stretch;
          }

          .copy-btn {
            width: 100%;
          }

          .qr-code-container svg {
            width: 150px !important;
            height: 150px !important;
          }
        }

        @media (max-width: 480px) {
          .upload-header {
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

          .upload-title {
            font-size: var(--font-size-lg);
          }

          .upload-content {
            padding: var(--space-md);
          }

          .info-card {
            padding: var(--space-lg);
          }

          .info-amount {
            font-size: var(--font-size-2xl);
          }

          .currency {
            font-size: var(--font-size-base);
          }

          .upload-area {
            padding: var(--space-lg);
          }

          .upload-icon {
            font-size: 40px;
          }

          .preview-image {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
