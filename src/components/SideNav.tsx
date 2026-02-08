import HomeIcon from '@mui/icons-material/Home';
import GetAppIcon from '@mui/icons-material/GetApp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout, user, account } = useAuth();


  const handleSignOut = () => {
    logout(); // Clear authentication state
    onClose(); // Close the side nav
    navigate('/'); // Redirect to signin page
  };
  return (
    <>
      {isOpen && <div className="sidenav-overlay" onClick={onClose}></div>}

      <nav className={`sidenav ${isOpen ? 'sidenav-open' : ''}`}>
        <div className="sidenav-header">
          <button className="sidenav-close" onClick={onClose}>
            <span className="close-icon">✕</span>
          </button>
        </div>

        <div className="sidenav-content">
          {/* Credit Card View */}
          <div className="credit-card-view">
            <div className="card-icon">💳</div>
            <div className="card-info">
              <div className="card-route">{user?.name || 'Guest'} ★ {user?.level?.name || 'VIP1'}</div>
              <div className="card-details">Balance: ${account?.balance.toFixed(2) || '0.00'}</div>
            </div>
            <div className="card-percentage">100%</div>
          </div>

          {/* Balance Display */}
          <div className="balance-display">
            <div className="balance-card">
              <div className="balance-amount">${account?.balance.toFixed(2) || '0.00'}</div>
              <div className="balance-label">Balance</div>
            </div>
            <div className="balance-card">
              <div className="balance-amount">${account?.profit.toFixed(2) || '0.00'}</div>
              <div className="balance-label">{t('totalProfit')}</div>
            </div>
          </div>

          {/* Quick Menu Grid */}
          <div className="quick-menu-grid">
            <Link to="/shopping-center" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><HomeIcon /></div>
              <div className="menu-label">{t('initial')}</div>
            </Link>
            <Link to="/withdraw" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><GetAppIcon /></div>
              <div className="menu-label">{t('withdraw')}</div>
            </Link>
            <Link to="/deposit" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><AccountBalanceIcon /></div>
              <div className="menu-label">{t('deposit')}</div>
            </Link>
            <Link to="/clause" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><DescriptionIcon /></div>
              <div className="menu-label">{t('clause')}</div>
            </Link>
            <Link to="/events" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><EventIcon /></div>
              <div className="menu-label">{t('events')}</div>
            </Link>
            <Link to="/about-us" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><InfoIcon /></div>
              <div className="menu-label">{t('aboutUs')}</div>
            </Link>
            <a href="#" className="quick-menu-item">
              <div className="menu-icon"><HistoryIcon /></div>
              <div className="menu-label">{t('history')}</div>
            </a>
            <Link to="/customer-service" className="quick-menu-item" onClick={onClose}>
              <div className="menu-icon"><PeopleIcon /></div>
              <div className="menu-label">{t('customer')}</div>
            </Link>
          </div>

          {/* Transaction Section */}
          <div className="menu-section">
            <h3 className="section-title">{t('transaction')}</h3>
            <div className="section-items">
              <Link to="/chat" className="section-item">{t('message')}</Link>
              <Link to="/bank-info" className="section-item" onClick={onClose}>{t('bankInfo')}</Link>
              <Link to="/withdrawal-address" className="section-item" onClick={onClose}>{t('withdrawalAddress')}</Link>
              <Link to="/withdrawal-record" className="section-item" onClick={onClose}>{t('withdrawalRecord')}</Link>
              <Link to="/recharge-record" className="section-item" onClick={onClose}>{t('rechargeRecord')}</Link>
            </div>
          </div>

          {/* Profile Section */}
          <div className="menu-section">
            <h3 className="section-title">{t('profile')}</h3>
            <div className="section-items">
              <Link to="/profile" className="section-item" onClick={onClose}>{t('profile')}</Link>
              <Link to="/language" className="section-item" onClick={onClose}>{t('language')}</Link>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="sidenav-footer">
          <button className="signout-btn" onClick={handleSignOut}>{t('signOut')}</button>
        </div>
      </nav>

      <style>{`
        .sidenav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.3s ease-out;
        }

        .sidenav {
          position: fixed;
          top: 0;
          left: -90%;
          width: 90%;
          height: 100vh;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border-primary);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          transition: left var(--transition-slow);
          z-index: 1000;
          overflow: hidden;
        }

        .sidenav.sidenav-open {
          left: 0;
        }

        .sidenav-header {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: var(--space-lg);
        }

        .sidenav-close {
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          color: var(--color-text-secondary);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .sidenav-close:hover {
          background: var(--color-bg-elevated);
          color: var(--color-text-primary);
        }

        .close-icon {
          font-size: 20px;
        }

        .sidenav-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 var(--space-xl) var(--space-xl);
        }

        /* Credit Card View */
        .credit-card-view {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
        }

        .card-icon {
          font-size: 32px;
        }

        .card-info {
          flex: 1;
        }

        .card-route {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xs);
        }

        .card-details {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .card-percentage {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        /* Balance Display */
        .balance-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        .balance-card {
          text-align: center;
          padding: var(--space-lg);
        }

        .balance-amount {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xs);
        }

        .balance-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        /* Quick Menu Grid */
        .quick-menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        .quick-menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-lg) var(--space-sm);
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .quick-menu-item:hover {
          background: var(--color-bg-elevated);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .menu-icon {
          font-size: 28px;
        }

        .menu-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          text-align: center;
          font-weight: 500;
        }

        /* Menu Sections */
        .menu-section {
          margin-bottom: var(--space-2xl);
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-lg);
          padding-left: var(--space-sm);
        }

        .section-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .section-item {
          padding: var(--space-md) var(--space-lg);
          color: var(--color-text-secondary);
          font-size: var(--font-size-base);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border-secondary);
        }

        .section-item:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-tertiary);
          border-color: var(--color-border-primary);
          padding-left: var(--space-xl);
        }

        /* Footer */
        .sidenav-footer {
          padding: var(--space-xl);
          border-top: 1px solid var(--color-border-primary);
        }

        .signout-btn {
          width: 100%;
          padding: var(--space-lg);
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: var(--font-size-base);
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-md);
        }

        .signout-btn:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .sidenav {
            width: 95%;
            left: -95%;
          }

          .quick-menu-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-md);
          }

          .menu-icon {
            font-size: 24px;
          }

          .balance-amount {
            font-size: var(--font-size-2xl);
          }
        }

        @media (max-width: 480px) {
          .quick-menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
