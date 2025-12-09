import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI, insightsAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [risks, setRisks] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, risksRes] = await Promise.all([
        projectsAPI.getAll(),
        insightsAPI.getAllRisks(),
      ]);

      setProjects(projectsRes.data);
      const riskMap = {};
      risksRes.data.forEach((risk) => {
        riskMap[risk.projectId] = risk;
      });
      setRisks(riskMap);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'budget' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.budget) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await projectsAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'Active',
      });
      fetchData();
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };

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

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Create New Project</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label>Budget *</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter budget"
                step="0.01"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Create Project
            </button>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => {
            const risk = risks[project.id];
            const budgetUsed = ((project.spent / project.budget) * 100).toFixed(2);

            return (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  {risk && (
                    <span
                      className="risk-badge"
                      style={{ backgroundColor: getRiskColor(risk.riskLevel) }}
                    >
                      {risk.riskLevel}
                    </span>
                  )}
                </div>

                <div className="project-details">
                  <div className="detail-row">
                    <span className="label">Budget</span>
                    <span className="value">${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Spent</span>
                    <span className="value">${project.spent.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Remaining</span>
                    <span className="value">
                      ${(project.budget - project.spent).toLocaleString()}
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${budgetUsed}%`,
                        backgroundColor: getRiskColor(risk?.riskLevel || 'Low'),
                      }}
                    ></div>
                  </div>
                  <p className="progress-label">{budgetUsed}% Budget Used</p>

                  {project.start_date && (
                    <div className="detail-row">
                      <span className="label">Start Date</span>
                      <span className="value">
                        {new Date(project.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {project.end_date && (
                    <div className="detail-row">
                      <span className="label">End Date</span>
                      <span className="value">
                        {new Date(project.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="label">Status</span>
                    <span className={`status status-${project.status.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {risk && (
                  <div className="risk-info">
                    <p>Risk Score: <strong>{risk.riskScore}/100</strong></p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No projects yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
