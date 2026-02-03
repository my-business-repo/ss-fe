import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopeeLogo from '../assets/shopee_logo_no_bkg.png';
import { useLanguage } from '../i18n/LanguageContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fundPassword: '',
    inviteCode: '',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.inviteCode) {
      alert('Invite code is required');
      return;
    }

    if (formData.username && formData.phone && formData.password && formData.fundPassword) {
      // In real app, this would create account via backend
      console.log('Registering:', formData);
      navigate('/dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>

      <div className="auth-content animate-fadeIn">
        <div className="auth-card">
          <div className="auth-header">
            <img src={shopeeLogo} alt="Shopee Logo" className="auth-logo" />
            <h2 className="auth-title">{t('signUp')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username */}
            <div className="form-group">
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder={t('enterUsername')}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number with Country Code */}
            <div className="form-group phone-group">
              <PhoneInput
                country={'us'}
                value={formData.phone}
                onChange={handlePhoneChange}
                containerClass="phone-input-container"
                inputClass="phone-input-field"
                buttonClass="phone-input-button"
                placeholder={t('enterPhone')}
                enableSearch={true}
              />
            </div>

            {/* Password */}
            <div className="form-group relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input has-icon"
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="form-group relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-input has-icon"
                placeholder={t('enterPasswordAgain')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </button>
            </div>

            {/* Fund Password */}
            <div className="form-group">
              <input
                type="password"
                name="fundPassword"
                className="form-input"
                placeholder={t('enterFundPassword')}
                value={formData.fundPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Invite Code */}
            <div className="form-group">
              <input
                type="text"
                name="inviteCode"
                className="form-input"
                placeholder={t('enterInviteCode')}
                value={formData.inviteCode}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block submit-btn">
              {t('register')}
            </button>

            <div className="auth-footer text-right">
              <Link to="/" className="auth-link text-muted">{t('signIn')}</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .auth-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-image: url('../src/assets/flight_preview.png'); /* Or whatever the bg is */
          background-size: cover;
          background-position: center;
        }
        
        /* Overlay for background if needed */
        .auth-background {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.5); /* Light overlay */
          backdrop-filter: blur(5px);
          z-index: 0;
        }

        .auth-content {
          width: 100%;
          max-width: 400px; /* Narrow card as per screenshot */
          position: relative;
          z-index: 1;
        }

        .auth-card {
           background: var(--color-bg-elevated); /* White/Dark card */
           border-radius: 4px; /* Sharper corners as per screenshot */
           padding: 40px 30px;
           box-shadow: 0 4px 20px rgba(0,0,0,0.1);
           border: 1px solid var(--color-border-primary);
        }

        .auth-header {
          text-align: left; /* Screenshot alignment */
          margin-bottom: 30px;
        }

        .auth-logo {
          height: 50px;
          object-fit: contain;
          margin-bottom: 10px;
          display: block;
        }

        .auth-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          position: relative;
        }

        .relative {
            position: relative;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: #f5f5f5;
          border: 1px solid transparent;
          border-radius: 4px;
          color: #333;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        
        [data-theme='dark'] .form-input {
            background: #2a2a2a;
            color: #fff;
        }

        .form-input:focus {
          background: #fff;
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        
        [data-theme='dark'] .form-input:focus {
            background: #333;
        }

        .has-icon {
            padding-right: 40px;
        }

        .input-icon-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
        }

        /* React Phone Input Overrides */
        .phone-input-container {
             width: 100% !important;
        }
        
        .phone-input-field {
            width: 100% !important;
            height: 48px !important;
            background: #f5f5f5 !important;
            border: 1px solid transparent !important;
            border-radius: 4px !important;
            padding-left: 58px !important;
            font-size: 14px !important;
            color: #333 !important;
        }
        
        [data-theme='dark'] .phone-input-field {
             background: #2a2a2a !important;
             color: #fff !important;
            border: 1px solid transparent !important;
        }

        .phone-input-button {
             background: transparent !important;
             border: none !important;
             border-right: 1px solid transparent !important;
             left: 4px !important;
        }
        
        .phone-input-button .selected-flag {
             background: transparent !important;
        }

        /* Submit Button */
        .submit-btn {
            background: #1a1b2e;
            color: white;
            padding: 14px;
            border-radius: 4px;
            font-weight: 500;
            margin-top: 10px;
        }
        
        [data-theme='dark'] .submit-btn {
            background: var(--color-accent-primary);
        }
        
        .submit-btn:hover {
            background: #2c2d45;
            box-shadow: none;
        }

        .auth-footer {
            margin-top: 16px;
            text-align: right;
        }

        .auth-footer .auth-link {
            color: var(--color-text-secondary);
            font-size: 14px;
            text-decoration: none;
        }
        
        .auth-footer .auth-link:hover {
            color: var(--color-accent-primary);
        }
        
        .text-right {
            text-align: right;
        }

        @media (max-width: 640px) {
          .auth-card {
            padding: var(--space-xl);
          }
        }
      `}</style>
    </div>
  );
}
