import amazonLogo from '../assets/amazon_logo.png';
import ebayLogo from '../assets/ebay_logo.png';
import aliexpressLogo from '../assets/aliexpress_logo.png';
import walmartLogo from '../assets/walmart_logo.png';
import etsyLogo from '../assets/etsy_logo.png';
import alibabaLogo from '../assets/alibaba_logo.png';

const shoppingSites = [
  { rank: 1, name: 'Amazon', logo: amazonLogo, country: 'USA' },
  { rank: 2, name: 'eBay', logo: ebayLogo, country: 'USA' },
  { rank: 3, name: 'AliExpress', logo: aliexpressLogo, country: 'China' },
  { rank: 4, name: 'Walmart', logo: walmartLogo, country: 'USA' },
  { rank: 5, name: 'Etsy', logo: etsyLogo, country: 'USA' },
  { rank: 6, name: 'Alibaba', logo: alibabaLogo, country: 'China' },
  { rank: 7, name: 'Rakuten', logo: '🛍️', country: 'Japan' },
  { rank: 8, name: 'Mercado Libre', logo: '💰', country: 'Argentina' },
  { rank: 9, name: 'Shopify', logo: '🏪', country: 'Canada' },
  { rank: 10, name: 'Temu', logo: '🎁', country: 'USA' }
];

export default function ShoppingRankings() {
  return (
    <div className="shopping-rankings">
      <div className="rankings-header">
        <h2 className="rankings-title">Top 10 best online shopping sites in the world 2025</h2>
      </div>

      <div className="rankings-list">
        {shoppingSites.map((site) => {
          const isEven = site.rank % 2 === 0;

          return (
            <div key={site.rank} className={`ranking-item ${isEven ? 'ranking-item-reverse' : ''}`}>
              <div className="rank-info-box">
                <div className="rank-number">★ NO.{site.rank}</div>
                <div className="site-name">{site.name}</div>
                <div className="arrow-down">↓</div>
              </div>

              <div className="site-logo-container">
                {site.logo.startsWith('/') ? (
                  <img src={site.logo} alt={site.name} className="site-logo-image" />
                ) : (
                  <div className="logo-emoji">{site.logo}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .shopping-rankings {
          margin-top: var(--space-2xl);
        }

        .rankings-header {
          text-align: center;
          margin-bottom: var(--space-3xl);
        }

        .rankings-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .rankings-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3xl);
          max-width: 800px;
          margin: 0 auto;
        }

        .ranking-item {
          display: grid;
          grid-template-columns: minmax(180px, 200px) 1fr;
          gap: var(--space-xl);
          align-items: center;
        }

        .ranking-item-reverse {
          grid-template-columns: 1fr minmax(180px, 200px);
        }

        .ranking-item-reverse .rank-info-box {
          order: 2;
        }

        .ranking-item-reverse .site-logo-container {
          order: 1;
        }

        .rank-info-box {
          background: #4a4a4a;
          color: white;
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          min-height: 180px;
        }

        .rank-number {
          font-size: var(--font-size-lg);
          font-weight: 700;
          white-space: nowrap;
        }

        .site-name {
          font-size: var(--font-size-base);
          font-weight: 600;
          text-align: center;
        }

        .arrow-down {
          font-size: var(--font-size-2xl);
          margin-top: var(--space-sm);
        }

        .site-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          min-height: 180px;
          border: 1px solid var(--color-border-primary);
        }

        .site-logo-image {
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
        }

        .logo-emoji {
          font-size: 80px;
        }

        @media (max-width: 768px) {
          .ranking-item,
          .ranking-item-reverse {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .ranking-item-reverse .rank-info-box,
          .ranking-item-reverse .site-logo-container {
            order: initial;
          }

          .rank-info-box {
            min-height: 140px;
            padding: var(--space-lg);
          }

          .site-logo-container {
            min-height: 140px;
            padding: var(--space-lg);
          }

          .site-logo-image {
            max-height: 100px;
          }

          .logo-emoji {
            font-size: 60px;
          }
        }
      `}</style>
    </div>
  );
}
