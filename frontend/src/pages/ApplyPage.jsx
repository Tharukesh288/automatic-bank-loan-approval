import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Card, CardBody, CardHeader } from '../components/Card';
import { Header } from '../components/Header';
import { predictLoan } from '../services/api';

export function ApplyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    pan: '',
    dependents: '0',
    education: 'Graduate',
    self_employed: 'No',
    applicant_income: '',
    coapplicant_income: '0',
    loan_amount: '',
    loan_amount_term: '360',
    credit_history: '1',
    property_area: 'Urban'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // PAN validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      setError('Invalid PAN format (e.g. ABCDE1234F)');
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        pan: formData.pan.toUpperCase(),
        applicant_income: Number(formData.applicant_income),
        coapplicant_income: Number(formData.coapplicant_income),
        loan_amount: Number(formData.loan_amount),
        loan_amount_term: Number(formData.loan_amount_term),
        credit_history: Number(formData.credit_history)
      };

      const result = await predictLoan(formattedData);
      navigate(`/result/${result.application_id}`, { state: { result } });
    } catch (err) {
      setError(err.message || 'An error occurred submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
        <Card>
          <CardHeader>
          <h2>Apply for a Loan</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
            
            <div className="grid-2 gap-4">
              <Input label="Applicant Name" name="applicant_name" required value={formData.applicant_name} onChange={handleChange} />
              <Input label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
              <Input label="Phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
              <Input label="PAN" name="pan" required value={formData.pan} onChange={handleChange} placeholder="ABCDE1234F" />
              
              <Select label="Dependents" name="dependents" required value={formData.dependents} onChange={handleChange} options={[
                {label: '0', value: '0'}, {label: '1', value: '1'}, {label: '2', value: '2'}, {label: '3+', value: '3+'}
              ]} />
              
              <Select label="Education" name="education" required value={formData.education} onChange={handleChange} options={[
                {label: 'Graduate', value: 'Graduate'}, {label: 'Not Graduate', value: 'Not Graduate'}
              ]} />
              
              <Select label="Self Employed" name="self_employed" required value={formData.self_employed} onChange={handleChange} options={[
                {label: 'No', value: 'No'}, {label: 'Yes', value: 'Yes'}
              ]} />
              
              <Input label="Applicant Income" type="number" name="applicant_income" required value={formData.applicant_income} onChange={handleChange} />
              <Input label="Coapplicant Income" type="number" name="coapplicant_income" required value={formData.coapplicant_income} onChange={handleChange} />
              <Input label="Loan Amount" type="number" name="loan_amount" required value={formData.loan_amount} onChange={handleChange} />
              <Input label="Loan Amount Term (days)" type="number" name="loan_amount_term" required value={formData.loan_amount_term} onChange={handleChange} />
              
              <Select label="Credit History" name="credit_history" required value={formData.credit_history} onChange={handleChange} options={[
                {label: 'Good (1)', value: '1'}, {label: 'Bad (0)', value: '0'}
              ]} />
              
              <Select label="Property Area" name="property_area" required value={formData.property_area} onChange={handleChange} options={[
                {label: 'Urban', value: 'Urban'}, {label: 'Semiurban', value: 'Semiurban'}, {label: 'Rural', value: 'Rural'}
              ]} />
            </div>
            
            <div className="mt-4">
              <Button type="submit" variant="logo" size="lg" fullWidth disabled={loading}>
                {loading ? 'Processing...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      </div>
    </div>
  );
}
