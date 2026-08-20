import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getApplication } from '../services/api';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Header } from '../components/Header';

export function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!result) {
      getApplication(id)
        .then(data => setResult(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) return <div className="container mt-4 text-center">Loading assessment...</div>;
  if (error) return <div className="container mt-4 text-center" style={{color: 'var(--color-danger)'}}>{error}</div>;
  if (!result) return <div className="container mt-4 text-center">Result not found.</div>;

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '4rem 0', maxWidth: '600px', textAlign: 'center' }}>
        <Card>
          <CardHeader>
          <h2>Application Assessed</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>ID: {result.application_id}</p>
        </CardHeader>
        <CardBody>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: '0.5rem' }}>
              {(result.approval_probability * 100).toFixed(0)}%
            </h1>
            <p style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approval Probability</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Recommendation</p>
              <StatusBadge status={result.recommendation} type="recommendation" />
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Risk Level</p>
              <StatusBadge status={result.risk_level} type="risk" />
            </div>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            <p>{result.message || 'The application has been forwarded to a manager for final review.'}</p>
          </div>
        </CardBody>
        <CardFooter>
          <Link to="/">
            <Button variant="secondary" fullWidth>Return Home</Button>
          </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
