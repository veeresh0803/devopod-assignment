import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insightsAPI, projectsAPI, financeAPI } from '../services/api';
import Card from '../components/Card';
import RiskChart from '../components/RiskChart';
import './Dashboard.css';

const Dashboard = () => {
  const [insights, setInsights] = useState(null);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [insightsRes, risksRes] = await Promise.all([
        insightsAPI.getDashboard(),
        insightsAPI.getAllRisks(),
      ]);

      setInsights(insightsRes.data);
      setRisks(risksRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!insights) return <div className="loading">No data available</div>;

  // Safely extract insight values with defaults to avoid runtime errors
  const {
    totalProjects = 0,
    activeProjects = 0,
    totalBudget = 0,
    totalSpent = 0,
    totalRevenue = 0,
    overallBudgetHealth = 0,
    highRiskProjects = 0,
  } = insights || {};

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical':
        return '#dc3545';
      case 'High':
        return '#fd7e14';
      case 'Medium':
        return '#ffc107';
      default:
        return '#28a745';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          + New Project
        </button>
      </div>

      <div className="dashboard-grid">
        <Card title="Total Projects" value={totalProjects} subtitle={`${activeProjects} Active`} />
        <Card
          title="Total Budget"
          value={`$${Number(totalBudget).toLocaleString()}`}
          subtitle={`$${Number(totalSpent).toLocaleString()} Spent`}
        />
        <Card title="Total Revenue" value={`$${Number(totalRevenue).toLocaleString()}`} subtitle="From Invoices" />
        <Card title="Budget Health" value={`${overallBudgetHealth}%`} subtitle={`${highRiskProjects} High-Risk Projects`} />
      </div>

      <div className="dashboard-content">
        <div className="section">
          <h2>Project Risk Overview</h2>
          {risks.length > 0 ? (
            <div className="risk-list">
              {risks.map((risk) => (
                <div key={risk.projectId} className="risk-item">
                  <div className="risk-info">
                    <h3>{risk.projectName}</h3>
                    <p className="risk-score">Risk Score: {risk.riskScore}/100</p>
                  </div>
                  <div
                    className="risk-level"
                    style={{ backgroundColor: getRiskColor(risk.riskLevel) }}
                  >
                    {risk.riskLevel}
                  </div>
                  <div className="risk-percent">{risk.budgetUsedPercent}% Budget Used</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No projects yet. Create one to get started!</p>
          )}
        </div>

        <div className="section">
          <h2>Risk Distribution</h2>
          <RiskChart data={risks} />
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate('/finance')} className="btn-secondary">
          View Finances
        </button>
        <button onClick={fetchData} className="btn-secondary">
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
