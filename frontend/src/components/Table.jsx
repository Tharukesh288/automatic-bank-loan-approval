import React from 'react';

export function Table({ children, className = '', ...props }) {
  return (
    <div className="table-wrapper">
      <table className={`data-table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }) {
  return <thead className={className}>{children}</thead>;
}

export function TableBody({ children, className = '' }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = '', ...props }) {
  return <tr className={className} {...props}>{children}</tr>;
}

export function TableCell({ children, isHeader = false, className = '', ...props }) {
  const Tag = isHeader ? 'th' : 'td';
  return <Tag className={className} {...props}>{children}</Tag>;
}
