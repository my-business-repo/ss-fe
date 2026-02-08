import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../i18n/LanguageContext';
import flightBg from '../assets/flight_preview.png';
import { getDepositRecords, type DepositRecord } from '../services/depositService';

export default function RechargeRecord() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [records, setRecords] = useState<DepositRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getDepositRecords();
        setRecords(data);
      } catch (err) {
        console.error('Error fetching deposit records:', err);
        setError('Failed to load recharge records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'approved':
      case 'success':
        return { color: 'var(--color-accent-success)', key: 'success' };
      case 'pending':
        return { color: 'var(--color-accent-warning)', key: 'pending' };
      case 'rejected':
      case 'failed':
        return { color: 'var(--color-accent-danger)', key: 'failed' };
      default:
        return { color: 'var(--color-text-primary)', key: normalizedStatus };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="record-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowBackIcon />
        </button>
        <h1 className="page-title">{t('rechargeRecord')}</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="page-content">
        {isLoading ? (
          <div className="loading-state">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : records.length > 0 ? (
          <div className="record-list">
            {records.map(record => {
              const statusConfig = getStatusConfig(record.status);
              return (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <span className="record-amount">+${record.amount.toFixed(2)}</span>
                    <span className="record-status" style={{ color: statusConfig.color }}>
                      {t(statusConfig.key as any) || record.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="record-row">
                    <span className="record-label">{t('date')}:</span>
                    <span className="record-value">{formatDate(record.createdAt)}</span>
                  </div>
                  <div className="record-row">
                    <span className="record-label">Transaction ID:</span>
                    <span className="record-value">{record.transaction_id.substring(0, 8)}...</span>
                  </div>
                  {record.adminNote && (
                    <div className="record-row">
                      <span className="record-label">Note:</span>
                      <span className="record-value">{record.adminNote}</span>
                    </div>
                  )}
                </div>
              );
            })}
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
          color: var(--color-accent-success); /* Green for recharge */
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

        .no-data, .loading-state, .error-message {
          text-align: center;
          padding: 40px;
          color: var(--color-text-muted);
          font-size: 16px;
          background: var(--color-bg-secondary);
          border-radius: 8px;
        }
        
        .error-message {
            color: var(--color-accent-danger);
            background: #fee;
        }
      `}</style>
    </div>
  );
}
