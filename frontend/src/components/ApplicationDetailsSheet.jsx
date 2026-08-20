import React from 'react';
import { StatusBadge } from './StatusBadge';

export function ApplicationDetailsSheet({ application, onClose }) {
  if (!application) return null;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return typeof val === 'number' ? `₹${val.toLocaleString('en-IN')}` : `₹${val}`;
  };

  const formatCreditHistory = (val) => {
    if (val === 1 || val === '1' || val === 1.0) return '1.0 (Good Credit History)';
    if (val === 0 || val === '0' || val === 0.0) return '0.0 (Poor/No Credit History)';
    return val !== undefined && val !== null ? String(val) : 'N/A';
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--color-border)',
          animation: 'slideUp 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Loan Application Details
            </div>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {application.application_id}
              <StatusBadge status={application.status} type="status" />
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '8px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* Section 1: APPLICANT INFORMATION */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.875rem',
              paddingBottom: '0.375rem',
              borderBottom: '1.5px solid #eff6ff'
            }}>
              APPLICANT INFORMATION
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={labelStyle}>Application ID</span>
                <div style={valueStyle}>{application.application_id || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Applicant Name</span>
                <div style={valueStyle}>{application.applicant_name || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Email</span>
                <div style={valueStyle}>{application.email || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Phone</span>
                <div style={valueStyle}>{application.phone || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>PAN Number</span>
                <div style={{ ...valueStyle, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{application.pan || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Section 2: APPLICANT PROFILE */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.875rem',
              paddingBottom: '0.375rem',
              borderBottom: '1.5px solid #eff6ff'
            }}>
              APPLICANT PROFILE
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={labelStyle}>Dependents</span>
                <div style={valueStyle}>{application.dependents ?? 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Education</span>
                <div style={valueStyle}>{application.education || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Self Employed</span>
                <div style={valueStyle}>{application.self_employed || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Property Area</span>
                <div style={valueStyle}>{application.property_area || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Section 3: FINANCIAL INFORMATION */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.875rem',
              paddingBottom: '0.375rem',
              borderBottom: '1.5px solid #eff6ff'
            }}>
              FINANCIAL INFORMATION
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={labelStyle}>Applicant Income</span>
                <div style={valueStyle}>{formatCurrency(application.applicant_income)}</div>
              </div>
              <div>
                <span style={labelStyle}>Co-applicant Income</span>
                <div style={valueStyle}>{formatCurrency(application.coapplicant_income)}</div>
              </div>
              <div>
                <span style={labelStyle}>Loan Amount</span>
                <div style={valueStyle}>{formatCurrency(application.loan_amount)}</div>
              </div>
              <div>
                <span style={labelStyle}>Loan Term</span>
                <div style={valueStyle}>{application.loan_amount_term ? `${application.loan_amount_term} months` : 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Credit History</span>
                <div style={valueStyle}>{formatCreditHistory(application.credit_history)}</div>
              </div>
            </div>
          </div>

          {/* Section 4: AI ASSESSMENT */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.875rem',
              paddingBottom: '0.375rem',
              borderBottom: '1.5px solid #cbd5e1'
            }}>
              AI ASSESSMENT
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={labelStyle}>Prediction</span>
                <div style={{ ...valueStyle, textTransform: 'capitalize' }}>{application.prediction || 'N/A'}</div>
              </div>
              <div>
                <span style={labelStyle}>Approval Probability</span>
                <div style={{ ...valueStyle, color: '#0284c7', fontWeight: 700 }}>
                  {application.approval_probability !== undefined 
                    ? `${(application.approval_probability * 100).toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
              <div>
                <span style={labelStyle}>Recommendation</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <StatusBadge status={application.recommendation} type="recommendation" />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Risk Level</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <StatusBadge status={application.risk_level} type="risk" />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Current Status</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <StatusBadge status={application.status} type="status" />
                </div>
              </div>
            </div>

            {application.message && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6',
                fontSize: '0.875rem',
                color: '#334155'
              }}>
                <span style={{ fontWeight: 600, display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>ASSESSMENT NOTE</span>
                {application.message}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'flex-end',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px'
        }}>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#64748b',
  marginBottom: '0.25rem',
  textTransform: 'uppercase',
  letterSpacing: '0.03em'
};

const valueStyle = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: '#0f172a'
};
