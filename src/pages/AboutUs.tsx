import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <header className="about-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowBackIcon />
                </button>
                <h1 className="about-title">About Us</h1>
            </header>

            <main className="about-content">
                <div className="article-container">
                    <div className="article-image">
                        <img
                            src="/src/assets/about_us_banner.jpg"
                            alt="Shopee Company"
                            className="banner-image"
                        />
                    </div>


                    <div className="article-body">
                        <h2 className="article-title">Company Qualification</h2>

                        <div className="article-text">
                            <p>
                                Shopee is a successful online shopping platform company in the digital economy, and has a complete set of international company qualifications. Shopee is owned and operated by Sea Group (Sea Limited), a global technology-based business development company.
                            </p>

                            <p>
                                One of Shopee's key company qualifications is that it operates in accordance with the regulations of each country as a legally registered company. Shopee has set its own Terms & Conditions, Privacy Policy and Seller Policy, and has a systematic governance structure that maintains fairness for all companies that cooperate with buyers and sellers.
                            </p>

                            <p>
                                Technically, Shopee uses a high-security online platform infrastructure, and uses advanced Data Protection and Cyber Security systems to protect user information. In addition, Shopee Guarantee System and Secure Payment System create a reliable trading environment for buyers and sellers.
                            </p>

                            <p>
                                Shopee's company qualifications also include business cooperation experience and brand management capabilities. Shopee has partnered with international brands and local SMEs to build systems such as Shopee Mall, providing a qualified system for brands to sell legally with a guarantee of authenticity.
                            </p>

                            <p>
                                Shopee is also a company with high standards in customer service and business support systems. It supports sellers' business development through Seller Education Programs, Seller Centre Tools, and Customer Support Systems. These factors prove Shopee as a sustainable business platform.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        .about-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .about-header {
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

        .about-title {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
        }

        .about-content {
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
          margin: 0 0 var(--space-2xl) 0;
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
          .about-header {
            padding: var(--space-md) var(--space-lg);
          }

          .about-title {
            font-size: var(--font-size-xl);
          }

          .about-content {
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
