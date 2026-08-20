import React from 'react';

export function StatusBadge({ status, type }) {
  // type can be 'status', 'recommendation', 'risk'
  
  let variant = 'neutral';
  
  if (type === 'status') {
    if (status === 'PENDING') variant = 'warning';
    if (status === 'AI_ASSESSED') variant = 'info';
    if (status === 'UNDER_REVIEW') variant = 'warning';
    if (status === 'SHORTLISTED') variant = 'success';
    if (status === 'REJECTED') variant = 'danger';
  } else if (type === 'recommendation') {
    if (status === 'strong_candidate') variant = 'success';
    if (status === 'manual_review') variant = 'warning';
    if (status === 'higher_risk') variant = 'danger';
  } else if (type === 'risk') {
    if (status === 'low') variant = 'success';
    if (status === 'medium') variant = 'warning';
    if (status === 'high') variant = 'danger';
  }

  const displayStatus = String(status).replace(/_/g, ' ').toUpperCase();

  return (
    <span className={`badge badge-${variant}`}>
      {displayStatus}
    </span>
  );
}
