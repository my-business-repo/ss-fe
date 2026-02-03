import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SideNav from '../components/SideNav';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ShoppingCenter() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const shops = [
        { name: 'Amazon', logo: '/src/assets/amazon_logo.png', rating: 5 },
        { name: 'eBay', logo: '/src/assets/ebay_logo.png', rating: 4 },
        { name: 'AliExpress', logo: '/src/assets/aliexpress_logo.png', rating: 4 }
    ];

    useEffect(() => {
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
        <div className="shopping-center">
            <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

            <header className="shopping-header">
                <div className="header-content">
                    <button className="menu-btn" onClick={() => setIsSideNavOpen(true)} aria-label="Menu">
                        <div className="menu-grid">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>

                    <h1 className="header-title">Shopping Center</h1>

                    <div className="header-actions">
                        <button className="icon-btn" aria-label="Notifications">
                            📋
                        </button>
                        <button className="icon-btn" aria-label="Cart">
                            🛒
                        </button>
                    </div>
                </div>
            </header>

            <main className="shopping-main">
                <div className="container">
                    <div className="user-greeting">
                        <p className="greeting-text">
                            Hello!welcome <span className="user-name">Sing44 ★ VIP1</span>
                        </p>
                    </div>

                    <div className="content-card">
                        <div className="balance-section">
                            <div className="balance-item">
                                <div className="balance-icon">
                                    <AccountBalanceWalletIcon />
                                </div>
                                <div className="balance-info">
                                    <span className="balance-label">Total Balance</span>
                                    <span className="balance-amount">$0.00</span>
                                </div>
                            </div>

                            <div className="balance-item">
                                <div className="balance-icon">
                                    <TrendingUpIcon />
                                </div>
                                <div className="balance-info">
                                    <span className="balance-label">Today Profit</span>
                                    <span className="balance-amount">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="shop-carousel">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                className="shop-swiper"
                            >
                                {shops.map((shop, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="shop-card">
                                            <div className="shop-content">
                                                <div className="shop-logo">
                                                    <img src={shop.logo} alt={shop.name} className="shop-logo-image" />
                                                </div>
                                                <div className="shop-details">
                                                    <div className="shop-name">{shop.name}</div>
                                                    <div className="shop-rating">
                                                        {'⭐'.repeat(shop.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progress-line">
                                                <div className="progress-fill" style={{ width: '60%' }}></div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <button className="starting-btn">
                            <span className="starting-text">Starting</span>
                            <span className="starting-count">(0/0)</span>
                            <span className="starting-arrow">→</span>
                        </button>
                    </div>
                </div>
            </main>

            <div className="floating-nav">
                <button className="nav-btn home-btn" onClick={() => navigate('/dashboard')} aria-label="Home">
                    <HomeIcon />
                </button>
                <button className="nav-btn theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </button>
            </div>

            <style>{`
                .shopping-center {
                    min-height: 100vh;
                    background: var(--color-bg-primary);
                }

                .shopping-header {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: #1a1d28;
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-md);
                }

                .header-content {
                    padding: var(--space-lg) var(--space-xl);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .menu-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: var(--space-sm);
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

                .header-title {
                    font-size: var(--font-size-xl);
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    gap: var(--space-sm);
                }

                .icon-btn {
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    padding: var(--space-xs);
                }

                .shopping-main {
                    padding: var(--space-xl) var(--space-lg);
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .user-greeting {
                    text-align: center;
                    margin-bottom: var(--space-xl);
                    padding: var(--space-md);
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-md);
                }

                .greeting-text {
                    color: var(--color-text-secondary);
                    font-size: var(--font-size-sm);
                    margin: 0;
                }

                .user-name {
                    color: var(--color-text-primary);
                    font-weight: 600;
                }

                .content-card {
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border-primary);
                    border-radius: var(--radius-lg);
                    padding: var(--space-xl);
                    box-shadow: var(--shadow-lg);
                }

                .balance-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-md);
                    margin-bottom: var(--space-xl);
                }

                .balance-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-sm);
                    padding: var(--space-md);
                    background: var(--color-bg-primary);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border-primary);
                }

                .balance-icon {
                    font-size: 24px;
                    color: var(--color-text-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .balance-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-xs);
                }

                .balance-label {
                    font-size: var(--font-size-xs);
                    color: var(--color-text-tertiary);
                    text-align: center;
                }

                .balance-amount {
                    font-size: var(--font-size-xl);
                    font-weight: 700;
                    color: var(--color-text-primary);
                }

                .shop-carousel {
                    margin-bottom: var(--space-lg);
                }

                .shop-swiper {
                    padding-bottom: var(--space-xl);
                }

                .shop-card {
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border-primary);
                    border-radius: var(--radius-md);
                    padding: var(--space-lg);
                }

                .shop-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-lg);
                    margin-bottom: var(--space-md);
                }

                .shop-logo {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .shop-logo-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .shop-details {
                    flex: 1;
                }

                .shop-name {
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin-bottom: var(--space-xs);
                }

                .shop-rating {
                    font-size: var(--font-size-sm);
                }

                .progress-line {
                    width: 100%;
                    height: 4px;
                    background: var(--color-bg-tertiary);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
                    border-radius: var(--radius-full);
                    transition: width 0.3s ease;
                }

                .starting-btn {
                    width: 100%;
                    background: #1a1d28;
                    color: white;
                    border: none;
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg) var(--space-xl);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: var(--font-size-base);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .starting-btn:hover {
                    background: #252936;
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-md);
                }

                .starting-text {
                    font-size: var(--font-size-lg);
                }

                .starting-count {
                    margin-left: auto;
                    margin-right: var(--space-md);
                    opacity: 0.8;
                }

                .starting-arrow {
                    font-size: var(--font-size-xl);
                }

                .floating-nav {
                    position: fixed;
                    bottom: var(--space-2xl);
                    right: var(--space-xl);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    z-index: 50;
                }

                .nav-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    box-shadow: var(--shadow-lg);
                }

                .home-btn {
                    background: #3b82f6;
                    color: white;
                }

                .home-btn:hover {
                    background: #2563eb;
                    transform: scale(1.1);
                }

                .theme-btn {
                    background: var(--color-bg-secondary);
                    color: var(--color-text-primary);
                }

                .theme-btn:hover {
                    transform: scale(1.1);
                }

                .shop-swiper :global(.swiper-pagination-bullet) {
                    background: var(--color-text-secondary);
                    opacity: 0.5;
                }

                .shop-swiper :global(.swiper-pagination-bullet-active) {
                    background: #3b82f6;
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    .balance-section {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
