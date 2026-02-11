import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ShoppingRankings from '../components/ShoppingRankings';
import SideNav from '../components/SideNav';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import shopeeLogo from '../assets/shopee_logo_no_bkg.png';
import shopeeCartIcon from '../assets/shopee_cart_icon.png';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, refreshOrderPlan } = useAuth();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Refresh order plan data
    refreshOrderPlan();

    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <button
            className="menu-btn"
            onClick={() => setIsSideNavOpen(true)}
            aria-label="Open menu"
          >
            <div className="menu-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <DarkModeIcon className="theme-icon" /> : <LightModeIcon className="theme-icon" />}
          </button>

          <div className="dashboard-logo">
            <img src={shopeeLogo} alt="Shopee" className="logo-icon-img" />
          </div>

          <button className="user-avatar-btn" aria-label="Shopping cart" onClick={() => navigate('/profile')}>
            <div className="user-avatar">
              <img src={shopeeCartIcon} alt="Cart" className="cart-icon-img" />
            </div>
          </button>
        </div>
      </header>

      <div className="welcome-banner">
        <p className="welcome-text">
          Hello!welcome <span className="user-route">{user?.name || 'Guest'} ★ {user?.level?.name || 'VIP1'}</span>
        </p>
      </div>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-content">
            <ProductCard />
            <ShoppingRankings />
          </div>
        </div>
      </main>

      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

      {/* Floating Customer Support Button */}
      <button
        className="customer-support-btn"
        onClick={() => navigate('/chat')}
        aria-label="Customer Support"
        title="Chat with Customer Support"
      >
        <HeadsetMicIcon className="support-icon" />
      </button>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .dashboard-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #1a1d28;
          border-bottom: 1px solid var(--color-border-primary);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-md);
        }

        .header-content {
          max-width: 100%;
          padding: var(--space-lg) var(--space-xl);
          display: grid;
          grid-template-columns: 50px 40px 1fr 50px;
          align-items: center;
          gap: var(--space-md);
        }

        .menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--space-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .menu-btn:hover {
          opacity: 0.8;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 8px);
          grid-template-rows: repeat(2, 8px);
          gap: 4px;
        }

        .menu-grid span {
          width: 8px;
          height: 8px;
          background: #6b7280;
          border-radius: 1px;
        }

        .theme-toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--space-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          border-radius: var(--radius-md);
        }

        .theme-toggle-btn:hover {
          background: var(--color-bg-tertiary);
          transform: scale(1.1);
        }

        .theme-icon {
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .dashboard-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
        }

        .logo-icon-img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .logo-icon {
          font-size: 28px;
          display: flex;
          align-items: center;
          color: #ffffff;
        }

        .logo-text {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: #ffffff;
        }

        .user-avatar-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: transparent;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .avatar-icon {
          font-size: 20px;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .welcome-banner {
          background: var(--color-bg-secondary);
          padding: var(--space-md) var(--space-xl);
          text-align: center;
          border-bottom: 1px solid var(--color-border-secondary);
        }

        .welcome-text {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .user-route {
          color: var(--color-text-primary);
          font-weight: 600;
          margin-left: var(--space-xs);
        }

        .dashboard-main {
          padding: var(--space-2xl) 0;
          animation: fadeIn 0.5s ease-out;
        }

        .dashboard-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 var(--space-lg);
        }

        @media (max-width: 768px) {
          .header-content {
            padding: var(--space-md) var(--space-lg);
          }

          .logo-text {
            font-size: var(--font-size-lg);
          }

          .logo-icon {
            font-size: 24px;
          }

          .dashboard-main {
            padding: var(--space-lg) 0;
          }
        }

        /* Customer Support Floating Button */
        .customer-support-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
          z-index: 999;
          animation: slideInUp 0.5s ease-out;
        }

        .customer-support-btn:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
        }

        .customer-support-btn:active {
          transform: scale(0.95);
        }

        .support-icon {
          font-size: 28px;
          color: #ffffff;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .customer-support-btn {
            width: 56px;
            height: 56px;
            bottom: 20px;
            right: 20px;
          }

          .support-icon {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
