export default function FlightBooking() {
    return (
        <div className="flight-booking">
            <div className="flight-header">
                <h3 className="flight-route">Sing44 + VIP1</h3>
            </div>

            <div className="flight-preview">
                <img
                    src="/src/assets/flight_preview.png"
                    alt="Flight preview"
                    className="flight-image"
                />
            </div>

            <div className="flight-details card-glass">
                <div className="flight-pricing">
                    <div className="pricing-item">
                        <div className="pricing-icon">💳</div>
                        <div className="pricing-info">
                            <span className="pricing-label">Credit</span>
                            <span className="pricing-amount">$803.96</span>
                        </div>
                    </div>

                    <div className="pricing-item">
                        <div className="pricing-icon">💵</div>
                        <div className="pricing-info">
                            <span className="pricing-label">Debit</span>
                            <span className="pricing-amount">$0.00</span>
                        </div>
                    </div>
                </div>

                <div className="payment-methods">
                    <div className="payment-badge">MASTER CARD</div>
                    <div className="payment-badge">Paypal</div>
                </div>

                <button className="btn btn-primary btn-block">
                    Starting
                </button>
            </div>

            <style>{`
        .flight-booking {
          max-width: 400px;
          margin: 0 auto;
        }

        .flight-header {
          margin-bottom: var(--space-md);
        }

        .flight-route {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .flight-preview {
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--space-lg);
          box-shadow: var(--shadow-lg);
        }

        .flight-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .flight-details {
          padding: var(--space-xl);
        }

        .flight-pricing {
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

        .payment-methods {
          display: flex;
          gap: var(--space-sm);
          margin-bottom: var(--space-xl);
        }

        .payment-badge {
          flex: 1;
          padding: var(--space-sm);
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-sm);
          text-align: center;
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .flight-pricing {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
