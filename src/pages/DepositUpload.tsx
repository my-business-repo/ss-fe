import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function DepositUpload() {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount, method } = location.state || { amount: '0.00', method: 'trc20' };

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedFile) {
            alert('Please upload payment proof');
            return;
        }
        // Handle upload submission
        console.log('Upload submitted:', { amount, method, file: uploadedFile });
        alert('Deposit request submitted successfully!');
        navigate('/dashboard');
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
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label className="form-label">* Upload Payment Proof</label>
                        <p className="form-hint">Please upload a screenshot of your payment transaction</p>

                        <div className="upload-area">
                            {previewUrl ? (
                                <div className="preview-container">
                                    <img src={previewUrl} alt="Payment proof" className="preview-image" />
                                    <button
                                        type="button"
                                        className="change-btn"
                                        onClick={() => document.getElementById('file-input')?.click()}
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
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Submit Deposit Request
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
