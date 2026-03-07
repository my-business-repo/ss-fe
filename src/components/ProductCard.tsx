import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../context/AuthContext';
import shopeeSgLogo from '../assets/shopee_sg.png';
import shopeeMyLogo from '../assets/shopee_my.png';
import shopeeThLogo from '../assets/shopee_th.png';
import flightPreview from '../assets/flight_preview.png';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ProductCard() {
  const navigate = useNavigate();
  const { user, orderPlan, account } = useAuth();
  const shops = [
    { name: 'Shopee Singapore', logo: shopeeSgLogo, rating: 5 },
    { name: 'Shopee Malaysia', logo: shopeeMyLogo, rating: 5 },
    { name: 'Shopee Thailand', logo: shopeeThLogo, rating: 5 }
  ];

  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-route">{user?.name || 'Guest'} + {user?.level?.name || 'VIP1'}</h3>
      </div>

      <div className="product-preview">
        <img
          src={flightPreview}
          alt="Product preview"
          className="product-image"
        />
      </div>

      <div className="product-details card-glass">
        <div className="pricing">
          <div className="pricing-item">
            <div className="pricing-icon">
              <AccountBalanceWalletIcon />
            </div>
            <div className="pricing-info">
              <span className="pricing-label">Total Balance</span>
              <span className="pricing-amount">${account?.balance?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="pricing-item">
            <div className="pricing-icon">
              <TrendingUpIcon />
            </div>
            <div className="pricing-info">
              <span className="pricing-label">Total Profit</span>
              <span className="pricing-amount">${account?.profit?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="shopping-carousel">
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
                  <div className="shop-image-container">
                    <img src={shop.logo} alt={shop.name} className="shop-cover-image" />
                  </div>
                  <div className="shop-details">
                    <div className="shop-name">{shop.name}</div>
                    <div className="shop-rating">
                      {'⭐'.repeat(shop.rating)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="starting-btn" onClick={() => navigate('/shopping-center')}>
            <span className="starting-text">Starting</span>
            <span className="starting-count">({orderPlan?.completedOrders || 0}/{orderPlan?.totalOrders || 0})</span>
            <span className="starting-arrow">→</span>
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          max-width: 400px;
          margin: 0 auto;
        }

        .product-header {
          margin-bottom: var(--space-md);
        }

        .product-route {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .product-preview {
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-lg);
          box-shadow: var(--shadow-lg);
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .product-details {
          padding: var(--space-xl);
        }

        .pricing {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .pricing-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-primary);
        }

        .pricing-icon {
          font-size: 24px;
        }

        .pricing-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .pricing-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pricing-amount {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .shopping-carousel {
          position: relative;
          padding: var(--space-sm) 0;
        }

        .shop-swiper {
          padding-bottom: var(--space-xl);
        }

        .shop-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          overflow: hidden;
        }

        .shop-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .shop-image-container {
          width: 100%;
          height: 180px;
        }

        .shop-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .shop-details {
          padding: var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .shop-name {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .shop-rating {
          font-size: var(--font-size-base);
        }

        .starting-btn {
          width: 100%;
          background: #1a1d28;
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--space-lg) var(--space-xl);
          margin-top: var(--space-lg);
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

        /* Swiper Pagination */
        .shop-swiper :global(.swiper-pagination-bullet) {
          background: var(--color-text-secondary);
          opacity: 0.5;
        }

        .shop-swiper :global(.swiper-pagination-bullet-active) {
          background: #3b82f6;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .pricing {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
