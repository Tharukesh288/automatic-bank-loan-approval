import React, { useEffect, useState } from 'react';
import { getManagerApplications, bulkUpdateApplications } from '../services/api';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { Header } from '../components/Header';

export function ManagerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const fetchApps = () => {
    setLoading(true);
    getManagerApplications()
      .then(data => setApplications(data.applications || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateApplications(Array.from(selectedIds), action);
      setSelectedIds(new Set());
      fetchApps();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="flex justify-between items-center mb-4">
        <h2>Manager Dashboard</h2>
        <div>
          <span style={{ marginRight: '1rem', color: 'var(--color-text-muted)' }}>
            {selectedIds.size} selected
          </span>
          <Button variant="secondary" size="sm" onClick={() => handleBulkAction('REVIEW')} disabled={selectedIds.size === 0} style={{ marginRight: '0.5rem' }}>Review</Button>
          <Button variant="danger" size="sm" onClick={() => handleBulkAction('REJECT')} disabled={selectedIds.size === 0} style={{ marginRight: '0.5rem' }}>Reject</Button>
          <Button variant="success" size="sm" onClick={() => handleBulkAction('SHORTLIST')} disabled={selectedIds.size === 0}>Shortlist</Button>
        </div>
      </div>
      
      <Card>
        <CardBody style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell isHeader style={{ width: '40px' }}></TableCell>
                  <TableCell isHeader>ID</TableCell>
                  <TableCell isHeader>Applicant</TableCell>
                  <TableCell isHeader>Prob.</TableCell>
                  <TableCell isHeader>Recommendation</TableCell>
                  <TableCell isHeader>Risk</TableCell>
                  <TableCell isHeader>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(app => (
                  <TableRow key={app.application_id}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(app.application_id)}
                        onChange={() => handleSelect(app.application_id)}
                      />
                    </TableCell>
                    <TableCell>{app.application_id}</TableCell>
                    <TableCell><strong>{app.applicant_name}</strong></TableCell>
                    <TableCell>{(app.approval_probability * 100).toFixed(0)}%</TableCell>
                    <TableCell><StatusBadge status={app.recommendation} type="recommendation" /></TableCell>
                    <TableCell><StatusBadge status={app.risk_level} type="risk" /></TableCell>
                    <TableCell><StatusBadge status={app.status} type="status" /></TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center" style={{ padding: '2rem' }}>No applications found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
      </div>
    </div>
  );
}
