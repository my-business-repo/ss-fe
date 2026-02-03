import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Events() {
    const navigate = useNavigate();

    return (
        <div className="events-page">
            <header className="events-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowBackIcon />
                </button>
                <h1 className="events-title">Events</h1>
            </header>

            <main className="events-content">
                <div className="article-container">
                    <div className="article-image">
                        <img
                            src="/src/assets/shopee_shopping_banner.png"
                            alt="Shopee Shopping"
                            className="banner-image"
                        />
                    </div>

                    <div className="article-body">
                        <h2 className="article-title">How Do I Invest Here</h2>
                        <p className="article-date">02-11-2025</p>

                        <div className="article-text">
                            <p>
                                Shopee is one of the most popular online shopping platforms today, and it is a great business opportunity that can be profitable if you plan and invest properly. Investing in Shopee has the advantage of starting with a small capital and gradually expanding it into your own business.
                            </p>

                            <p>
                                First, those who want to invest in Shopee need to open a Shopee Account and register as a Seller. When opening an account, you must fill in your personal information correctly, and you can upload products, manage orders, and monitor sales profits through the Seller Center. Reading and understanding the rules carefully at the beginning can reduce difficulties later.
                            </p>

                            <p>
                                Second, product selection is the key to investment success. Choose products that are popular and in high market demand. For example, clothing, phone accessories, cosmetics, and daily necessities are products that are fast-moving and easy to sell. In addition, it is calculated in advance to ensure that there is enough profit between the purchase price and the selling price of the product.
                            </p>

                            <p>
                                Third, capital must be managed systematically. The money spent on purchasing products, Packaging and shipping costs, Shopee Ads and Promotion expenses are pre-calculated. It is best to test the sales situation without using all the capital at first and then gradually expand. This method can reduce risk.
                            </p>

                            <p>
                                Fourth, make effective use of Shopee's promotion systems. Using Vouchers, Discounts, Free Shipping Program and Shopee Live can increase product visibility and increase the number of buyers. In addition, good product photos, clear descriptions and good reviews can increase buyer confidence.
                            </p>

                            <p>
                                Finally, customer service and building trust are the most important factors for long-term profit. Shipping orders on time, answering customer questions quickly and handling returns fairly will help to raise the store's ranking.
                            </p>

                            <p>
                                In short, the key to successful investment in Shopee is to choose the right products, manage your capital, use promotion methods and focus on building customer trust. If done properly, Shopee can become a profitable business channel in the long run.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        .events-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .events-header {
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

        .events-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .events-content {
          padding: var(--space-xl);
        }

        .article-container {
          max-width: 800px;
          margin: 0 auto;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .article-image {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--color-bg-tertiary);
        }

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .article-body {
          padding: var(--space-2xl);
        }

        .article-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0 0 var(--space-sm) 0;
        }

        .article-date {
          font-size: var(--font-size-sm);
          color: var(--color-text-tertiary);
          margin-bottom: var(--space-2xl);
        }

        .article-text {
          line-height: 1.8;
        }

        .article-text p {
          margin-bottom: var(--space-lg);
          color: var(--color-text-secondary);
          font-size: var(--font-size-base);
        }

        .article-text p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .events-header {
            padding: var(--space-md) var(--space-lg);
          }

          .events-title {
            font-size: var(--font-size-xl);
          }

          .events-content {
            padding: var(--space-lg);
          }

          .article-body {
            padding: var(--space-xl) var(--space-lg);
          }

          .article-title {
            font-size: var(--font-size-2xl);
          }

          .article-text {
            line-height: 1.6;
          }
        }
      `}</style>
        </div>
    );
}
