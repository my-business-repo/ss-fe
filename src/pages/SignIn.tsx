import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import shopeeLogo from '../assets/shopee_logo_no_bkg.png';
import flightPreview from '../assets/flight_preview.png';
import { useLanguage } from '../i18n/LanguageContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signinCustomer, activateOrderPlan, getOrderPlan } from '../services/customerService';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'username'>('phone');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation based on method
    if (loginMethod === 'phone') {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        setError('Phone number must have at least 7 digits');
        return;
      }
    } else {
      if (!formData.username) {
        setError('Username is required');
        return;
      }
    }

    if ((loginMethod === 'phone' && formData.phone) || (loginMethod === 'username' && formData.username)) {
      if (!formData.password) return;

      setIsLoading(true);
      try {
        // Call the signin API
        const response = await signinCustomer({
          ...(loginMethod === 'phone' ? { phoneNumber: formData.phone } : { username: formData.username }),
          password: formData.password,
        });
        // Activate order plan automatically
        let orderPlan = null;
        try {
          // We await this so the plan is created before they reach dashboard
          const planResponse = await activateOrderPlan(response.token);
          if (planResponse && planResponse.orderPlan) {
            orderPlan = planResponse.orderPlan;
          } else {
            // If activation didn't return a plan (maybe it returned null because it exists), try fetching it
            // Note: Our updated activateOrderPlan might return the existing plan now, but just in case
            try {
              const existingPlan = await getOrderPlan(response.token);
              if (existingPlan) orderPlan = existingPlan;
            } catch (fetchErr) {
              console.error('Failed to fetch existing order plan:', fetchErr);
            }
          }
        } catch (planError) {
          // Log error but don't stop login flow
          console.error('Failed to activate order plan on login:', planError);
        }

        // Use AuthContext to manage authentication state with the plan
        // The any cast is needed if the AuthContext type definition hasn't fully updated in the IDE's view yet
        login(response.token, response.customer, undefined, orderPlan as any);

        // Navigate to dashboard on success
        navigate('/dashboard');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Signin error:', err);
      } finally {
        setIsLoading(false);
      }
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
            <h2 className="auth-title">{t('signIn')}</h2>
          </div>

          <div className="login-method-tabs">
            <button
              type="button"
              className={`method-tab ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => setLoginMethod('phone')}
            >
              Phone Number
            </button>
            <button
              type="button"
              className={`method-tab ${loginMethod === 'username' ? 'active' : ''}`}
              onClick={() => setLoginMethod('username')}
            >
              Username
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loginMethod === 'phone' ? (
              <div className="form-group phone-group">
                <label className="form-label">Phone Number</label>
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
            ) : (
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group relative">
              <label htmlFor="password" className="form-label">{t('password')}</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input has-icon"
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: '38px' }} // Adjust for label
              >
                {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </button>
            </div>

            <div className="auth-options">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span className="text-secondary">Remember me</span>
              </label>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : t('signIn')}
            </button>

            <div className="auth-footer text-right">
              <Link to="/signup" className="auth-link text-muted">{t('signUp')}</Link>
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
          background-image: url(${flightPreview});
          background-size: cover;
          background-position: center;
        }

        .auth-background {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
          z-index: 0;
        }

        .auth-content {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }

        .auth-card {
           background: var(--color-bg-elevated);
           border-radius: 4px;
           padding: 40px 30px;
           box-shadow: 0 4px 20px rgba(0,0,0,0.1);
           border: 1px solid var(--color-border-primary);
        }

        .auth-header {
          text-align: left;
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

        .login-method-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--color-border-primary);
        }

        .method-tab {
          flex: 1;
          background: none;
          border: none;
          padding: 10px 0;
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .method-tab.active {
          color: var(--color-accent-primary);
          border-bottom-color: var(--color-accent-primary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--color-text-secondary);
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

        .has-icon {
            padding-right: 40px;
        }

        .input-icon-btn {
            position: absolute;
            right: 10px;
            /* Top is handled inline for label offset */
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
        }

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

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
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .error-message {
            background: #fee;
            color: #c33;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 14px;
            border: 1px solid #fcc;
        }
        
        [data-theme='dark'] .error-message {
            background: #4a1f1f;
            color: #ff6b6b;
            border-color: #6b2c2c;
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
        
        .auth-link {
            color: var(--color-accent-primary);
            text-decoration: none;
        }
        
        .auth-link:hover {
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
