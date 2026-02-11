import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Drawer, Button, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideNav from '../components/SideNav';
import amazonLogo from '../assets/amazon_logo.png';
import ebayLogo from '../assets/ebay_logo.png';
import aliexpressLogo from '../assets/aliexpress_logo.png';
import { useAuth } from '../context/AuthContext';
import { startOrder, confirmOrder, completeOrder, activateOrderPlan, type StartOrderResponse } from '../services/customerService';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ShoppingCenter() {
    const navigate = useNavigate();
    const { user, orderPlan, refreshOrderPlan, account } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        refreshOrderPlan();
    }, []);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<StartOrderResponse['order'] | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
    const [depositErrorMsg, setDepositErrorMsg] = useState('');
    const [isPendingOrdersDialogOpen, setIsPendingOrdersDialogOpen] = useState(false);

    const handleStartOrder = async () => {
        if (!orderPlan) return;

        let currentPlanOrders = orderPlan.orders;

        // Check if current plan is completed
        if (orderPlan.status === 'COMPLETED') {
            setIsLoadingOrder(true);
            try {
                const activationResponse = await activateOrderPlan();
                if (activationResponse && activationResponse.orderPlan) {
                    // Refresh context to sync with text
                    await refreshOrderPlan();
                    // Use the new orders immediately
                    currentPlanOrders = activationResponse.orderPlan.orders;
                } else {
                    console.error('Failed to activate new order plan');
                    // Fallback or alert? Proceeding might fail if no orders.
                }
            } catch (error) {
                console.error('Error activating new plan:', error);
            } finally {
                setIsLoadingOrder(false); // We'll set it true again if we find an order, or keep it false?
                // Actually, if we are about to start an order, we should keep it true or manage it carefully.
            }
        }

        // Find the first pending order
        // Note: orderPlan.orders might not be populated if we just fetched the plan summary
        // But assumed to be populated based on previous context. If not, we should probably fetch details.
        // For now, let's assume looking at the 'completedOrders' count is enough to know which to fetch?
        // Actually, the user requirement says "get the first order id (with status of not start)".
        // We rely on the orderPlan.orders array to be present and sorted by orderNumber.

        const nextOrder = currentPlanOrders?.find((o: any) => o.status === 'NOT_START');
        if (nextOrder) {
            setIsLoadingOrder(true);
            try {
                const response = await startOrder(nextOrder.order_id);
                setCurrentOrder(response.order);
                setIsDrawerOpen(true);
            } catch (error) {
                console.error('Failed to start order:', error);
                // Optionally show error toast
            } finally {
                setIsLoadingOrder(false);
            }
        } else {
            console.log('No pending orders found');
            setIsPendingOrdersDialogOpen(true);
        }
    };

    const handleConfirmOrder = async () => {
        if (!currentOrder) return;
        setIsLoadingOrder(true);
        try {
            const response = await confirmOrder(currentOrder.order_id);
            // Success
            setCurrentOrder(response.order);
        } catch (error: any) {
            console.error('Failed to confirm order:', error);
            if (error.message && error.message.includes('Insufficient balance')) {
                setDepositErrorMsg(error.message);
                setIsDepositDialogOpen(true);
                setIsDrawerOpen(false);
            } else {
                alert(error.message || 'Failed to confirm order');
            }
        } finally {
            setIsLoadingOrder(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!currentOrder) return;
        setIsLoadingOrder(true);
        try {
            await completeOrder(currentOrder.order_id);
            setIsDrawerOpen(false);
            window.location.reload();
        } catch (error: any) {
            console.error('Failed to complete order:', error);
            alert(error.message || 'Failed to complete order');
        } finally {
            setIsLoadingOrder(false);
        }
    };


    const shops = [
        { name: 'Amazon', logo: amazonLogo, rating: 5 },
        { name: 'eBay', logo: ebayLogo, rating: 4 },
        { name: 'AliExpress', logo: aliexpressLogo, rating: 4 }
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
                            Hello!welcome <span className="user-name">{user?.name || 'Guest'} ★ {user?.level?.name || 'VIP1'}</span>
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
                                    <span className="balance-amount">${account?.balance?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>

                            <div className="balance-item">
                                <div className="balance-icon">
                                    <TrendingUpIcon />
                                </div>
                                <div className="balance-info">
                                    <span className="balance-label">Today Profit</span>
                                    <span className="balance-amount">${account?.profit?.toFixed(2) || '0.00'}</span>
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

                        <button className="starting-btn" onClick={handleStartOrder} disabled={isLoadingOrder}>
                            <span className="starting-text">Starting</span>
                            <span className="starting-count">({orderPlan?.completedOrders || 0}/{orderPlan?.totalOrders || 0})</span>
                            <span className="starting-arrow">→</span>
                        </button>
                    </div>
                </div>
            </main>

            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        maxHeight: '85vh',
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)'
                    }
                }}
            >
                {currentOrder && (
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700 }}>
                                Order Details
                            </Typography>
                            <IconButton
                                onClick={() => setIsDrawerOpen(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'text.secondary'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <img
                                src={currentOrder.product.image}
                                alt={currentOrder.product.name}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {currentOrder.product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    {currentOrder.product.description}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                                    ID: {currentOrder.product.product_id}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                    Rating: {'⭐'.repeat(Math.round(currentOrder.product.rating))} ({currentOrder.product.rating})
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${currentOrder.product.price.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order ID</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.order_id}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Status</Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ color: 'warning.main' }}>
                                    {currentOrder.status}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order Date</Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {new Date(currentOrder.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                            {currentOrder.completedAt && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Completed Time</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        {new Date(currentOrder.completedAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order Number</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.orderNumber}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Commission Rate</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.product.commission}%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Estimated Commission</Typography>
                                <Typography variant="body2" fontWeight="600" color="success.main">
                                    ${(currentOrder.product.price * (currentOrder.product.commission / 100)).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        {currentOrder.status === 'COMPLETED' ? (
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleCompleteOrder}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    bgcolor: 'success.main',
                                    '&:hover': { bgcolor: 'success.dark' }
                                }}
                            >
                                COMPLETE ORDER
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleConfirmOrder}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    bgcolor: '#1a1d28',
                                    '&:hover': { bgcolor: '#2c2d45' }
                                }}
                            >
                                Submit Order
                            </Button>
                        )}
                    </Box>
                )}
            </Drawer>

            <Dialog
                open={isDepositDialogOpen}
                onClose={() => setIsDepositDialogOpen(false)}
            >
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>Insufficient Balance</DialogTitle>
                <DialogContent>
                    <Typography>
                        {depositErrorMsg}
                    </Typography>
                    <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                        Please deposit funds to continue processing orders.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsDepositDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => navigate('/deposit')}
                        variant="contained"
                        color="primary"
                        autoFocus
                    >
                        Go to Deposit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isPendingOrdersDialogOpen}
                onClose={() => setIsPendingOrdersDialogOpen(false)}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Pending Orders</DialogTitle>
                <DialogContent>
                    <Typography>
                        Please complete all the pending orders.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsPendingOrdersDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => navigate('/order-history')}
                        variant="contained"
                        color="primary"
                        autoFocus
                    >
                        Go to Order History
                    </Button>
                </DialogActions>
            </Dialog>

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
