import React, { useEffect, useState } from 'react';
import { projectsAPI, financeAPI } from '../services/api';
import './Finance.css';

const Finance = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    project_id: '',
    amount: '',
    description: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, projectsRes, ledgerRes] = await Promise.all([
        financeAPI.getInvoices(),
        projectsAPI.getAll(),
        financeAPI.getLedger(),
      ]);

      setInvoices(invoicesRes.data);
      setProjects(projectsRes.data);
      setLedger(ledgerRes.data);
    } catch (err) {
      setError('Failed to load finance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project_id || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await financeAPI.createInvoice(formData);
      setShowForm(false);
      setFormData({
        project_id: '',
        amount: '',
        description: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
      });
      fetchData();
    } catch (err) {
      setError('Failed to create invoice');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading finance data...</div>;

  return (
    <div className="finance-container">
      <div className="finance-header">
        <h1>Finance Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Invoice'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Create New Invoice</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project *</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a project</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Invoice description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Invoice Date *</label>
                <input
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Create Invoice
            </button>
          </form>
        </div>
      )}

      <div className="ledger-summary">
        <h2>Account Summary</h2>
        {ledger && (
          <div className="ledger-cards">
            <div className="ledger-card">
              <p className="label">Total Invoices</p>
              <p className="value">{ledger.total_invoices}</p>
            </div>
            <div className="ledger-card">
              <p className="label">Total Amount</p>
              <p className="value">${ledger.total_amount?.toLocaleString() || 0}</p>
            </div>
            <div className="ledger-card">
              <p className="label">Paid Amount</p>
              <p className="value" style={{ color: '#28a745' }}>
                ${ledger.paid_amount?.toLocaleString() || 0}
              </p>
            </div>
            <div className="ledger-card">
              <p className="label">Pending Amount</p>
              <p className="value" style={{ color: '#ffc107' }}>
                ${ledger.pending_amount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="invoices-section">
        <h2>Invoices</h2>
        {invoices.length > 0 ? (
          <div className="invoices-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Project</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>#{invoice.id}</td>
                    <td>{invoice.project_name || 'N/A'}</td>
                    <td>${invoice.amount.toLocaleString()}</td>
                    <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                    <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`status status-${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No invoices yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Finance;
