import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/logo.png" alt="Way to scam Logo" style={{ height: '40px', objectFit: 'contain' }} />
      </Link>
    </header>
  );
}
