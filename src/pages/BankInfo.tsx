import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import flightBg from '../assets/flight_preview.png';

export default function BankInfo() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        nation: '',
        bankName: '',
        cardHolder: '',
        cardNumber: '',
        iban: '',
        fundPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Bank Info Submitted:', formData);
        // Add submission logic here
    };

    return (
        <div className="bank-info-page">
            <header className="bank-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowBackIcon />
                </button>
                <h1 className="bank-title">{t('bankInfo')}</h1>
                <div className="header-spacer"></div>
            </header>

            <main className="bank-content">
                <form onSubmit={handleSubmit} className="bank-form">

                    {/* Nation */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('nation')}
                        </label>
                        <input
                            type="text"
                            name="nation"
                            className="form-input"
                            placeholder={t('pleaseSelectNation')}
                            value={formData.nation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Bank Name */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('bankName')}
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            className="form-input"
                            placeholder={t('pleaseSelectBank')}
                            value={formData.bankName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Card Holder */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('cardHolder')}
                        </label>
                        <input
                            type="text"
                            name="cardHolder"
                            className="form-input"
                            placeholder={t('pleaseSelectCardHolder')}
                            value={formData.cardHolder}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Card Number */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('cardNumber')}
                        </label>
                        <input
                            type="text"
                            name="cardNumber"
                            className="form-input"
                            placeholder={t('pleaseSelectCardNumber')}
                            value={formData.cardNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {/* IBAN */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('iban')}
                        </label>
                        <input
                            type="text"
                            name="iban"
                            className="form-input"
                            placeholder={t('pleaseSelectIBAN')}
                            value={formData.iban}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Fund Password */}
                    <div className="form-group">
                        <label className="form-label">
                            <span className="required">*</span> {t('fundPassword')}
                        </label>
                        <input
                            type="password"
                            name="fundPassword"
                            className="form-input"
                            placeholder={t('enterFundPassword')}
                            value={formData.fundPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="submit-btn">{t('submit')}</button>
                </form>
            </main>

            <style>{`
        .bank-info-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .bank-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          min-height: 180px; /* Taller header based on image */
          background-image: url('${flightBg}');
          background-size: cover;
          background-position: center;
          color: var(--color-text-primary); /* Ensure text is visible depending on image brightness */
          position: relative;
        }
        
        .bank-header::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: var(--color-bg-glass); /* Overlay to ensure text readability */
             z-index: 0;
        }
        
        .bank-header > * {
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

        .bank-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        .bank-content {
          padding: var(--space-xl) var(--space-lg);
          max-width: 600px;
          margin: 0 auto;
        }

        .bank-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
          background: var(--color-accent-primary); /* Dark navy color from image */
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
