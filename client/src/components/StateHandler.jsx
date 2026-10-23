import React from 'react';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

/**
 * StateHandler - Enforces the 4 Required UI States (ICTAK Section 7.3):
 * 1. Loading: spinner or skeleton
 * 2. Success: children components
 * 3. Empty: friendly message + action prompt
 * 4. Error: clear non-technical explanation + retry trigger
 */
export const StateHandler = ({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No records found.',
  emptyAction = null,
  onRetry = null,
  children,
}) => {
  // 1. Loading State
  if (loading) {
    return (
      <div className="state-container" aria-live="polite" aria-busy="true">
        <div className="spinner" />
        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          Loading clinic records, please wait...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="state-container" style={{ borderColor: '#fca5a5', background: '#fff5f5' }}>
        <AlertCircle size={44} color="#dc2626" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: '#991b1b', marginBottom: '0.35rem' }}>Unable to Load Data</h3>
        <p style={{ color: '#7f1d1d', maxWidth: '420px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          {typeof error === 'string' ? error : error.message || 'An unexpected error occurred while fetching data.'}
        </p>
        {onRetry && (
          <button className="btn btn-secondary btn-sm" onClick={onRetry} style={{ gap: '0.4rem' }}>
            <RefreshCw size={14} /> Try Again
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (empty) {
    return (
      <div className="state-container">
        <FolderOpen size={46} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.35rem' }}>No Data Available</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', marginBottom: emptyAction ? '1.25rem' : '0', fontSize: '0.9rem' }}>
          {emptyMessage}
        </p>
        {emptyAction && <div>{emptyAction}</div>}
      </div>
    );
  }

  // 4. Success State
  return <>{children}</>;
};

export default StateHandler;
