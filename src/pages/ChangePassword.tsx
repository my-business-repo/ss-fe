import { useState } from 'react';
import { changePassword, changeFundPassword } from '../services/customerService';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordType = location.pathname.includes('login') ? 'Login' : 'Fund';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);
    try {
      if (passwordType === 'Login') {
        await changePassword({ oldPassword, newPassword });
      } else {
        await changeFundPassword({
          oldFundPassword: oldPassword || undefined,
          newFundPassword: newPassword
        });
      }
      alert(`${passwordType} password changed successfully!`);
      navigate('/profile');
    } catch (error) {
      console.error(`Failed to change ${passwordType.toLowerCase()} password:`, error);
      alert(error instanceof Error ? error.message : `Failed to change ${passwordType.toLowerCase()} password`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <header className="password-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowBackIcon />
        </button>
        <h1 className="password-title">Modify {passwordType.toLowerCase()} password</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="password-content">
        <p className="password-notice">
          Please Remember Your Password. If You Forgot Your Password, Please Contact Customer Service.
        </p>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label className="form-label">* Old Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Please Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">* New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Please Enter Your New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">* Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Please Enter Your Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Reset password'}
          </button>
        </form>
      </main>

      <style>{`
        .change-password-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .password-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border-primary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
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
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .back-btn:hover {
          background: var(--color-bg-tertiary);
        }

        .back-btn svg {
          font-size: 24px;
        }

        .password-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          flex: 1;
        }

        .header-spacer {
          width: 40px;
        }

        .password-content {
          padding: var(--space-2xl) var(--space-xl);
          max-width: 600px;
          margin: 0 auto;
        }

        .password-notice {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0 0 var(--space-3xl) 0;
          line-height: 1.6;
        }

        .password-form {
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

        .form-label::before {
          content: '* ';
          color: #ef4444;
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
          margin-top: var(--space-2xl);
        }

        .submit-btn:hover {
          background: #34495e;
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .password-header {
            padding: var(--space-md) var(--space-lg);
          }

          .password-title {
            font-size: var(--font-size-xl);
          }

          .password-content {
            padding: var(--space-lg);
          }

          .password-notice {
            font-size: var(--font-size-xs);
            margin-bottom: var(--space-2xl);
          }

          .form-input {
            padding: var(--space-md);
            font-size: var(--font-size-sm);
          }

          .submit-btn {
            padding: var(--space-md);
          }
        }

        @media (max-width: 480px) {
          .password-header {
            padding: var(--space-sm) var(--space-md);
          }

          .back-btn {
            width: 36px;
            height: 36px;
          }

          .back-btn svg {
            font-size: 20px;
          }

          .password-title {
            font-size: var(--font-size-lg);
          }

          .header-spacer {
            width: 36px;
          }

          .password-content {
            padding: var(--space-md);
          }

          .password-form {
            gap: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
}
