import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import flightBg from '../assets/flight_preview.png';

// Mock data for demonstration
const mockRecords = [
    { id: 1, date: '2023-10-24 15:30', amount: '500.00', status: 'success', address: 'T9y...jK2' },
    { id: 2, date: '2023-10-22 09:15', amount: '120.00', status: 'pending', address: 'T9y...jK2' },
    { id: 3, date: '2023-10-20 18:45', amount: '1000.00', status: 'failed', address: 'T9y...jK2' },
];

export default function WithdrawalRecord() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'var(--color-accent-success)';
            case 'pending': return 'var(--color-accent-warning)';
            case 'failed': return 'var(--color-accent-danger)';
            default: return 'var(--color-text-primary)';
        }
    };

    return (
        <div className="record-page">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowBackIcon />
                </button>
                <h1 className="page-title">{t('withdrawalRecord')}</h1>
                <div className="header-spacer"></div>
            </header>

            <main className="page-content">
                {mockRecords.length > 0 ? (
                    <div className="record-list">
                        {mockRecords.map(record => (
                            <div key={record.id} className="record-card">
                                <div className="record-header">
                                    <span className="record-amount">${record.amount}</span>
                                    <span className="record-status" style={{ color: getStatusColor(record.status) }}>
                                        {t(record.status as any) || record.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="record-row">
                                    <span className="record-label">{t('date')}:</span>
                                    <span className="record-value">{record.date}</span>
                                </div>
                                <div className="record-row">
                                    <span className="record-label">{t('walletAddress')}:</span>
                                    <span className="record-value">{record.address}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">
                        <p>{t('noData')}</p>
                    </div>
                )}
            </main>

            <style>{`
        .record-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .page-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-bg-secondary);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          min-height: 180px;
          background-image: url('${flightBg}');
          background-size: cover;
          background-position: center;
          color: var(--color-text-primary);
          position: relative;
        }

        .page-header::before {
             content: '';
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background: var(--color-bg-glass);
             z-index: 0;
        }
        
        .page-header > * {
            position: relative;
            z-index: 1;
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
          position: absolute;
          top: 20px;
          left: 20px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          position: absolute;
          bottom: 20px;
          left: 20px;
        }

        .page-content {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .record-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .record-card {
          background: var(--color-bg-elevated);
          border-radius: 8px;
          padding: 16px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border-primary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--color-border-secondary);
          padding-bottom: 8px;
        }

        .record-amount {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .record-status {
          font-size: 14px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .record-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .record-label {
          color: var(--color-text-secondary);
        }

        .record-value {
          color: var(--color-text-primary);
          font-weight: 500;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: var(--color-text-muted);
          font-size: 16px;
        }
      `}</style>
        </div>
    );
}
