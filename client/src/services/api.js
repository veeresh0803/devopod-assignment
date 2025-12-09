import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  create: (projectData) =>
    api.post('/projects', projectData),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, projectData) =>
    api.patch(`/projects/${id}`, projectData),
};

// Finance API
export const financeAPI = {
  createInvoice: (invoiceData) =>
    api.post('/invoices', invoiceData),
  getInvoices: () => api.get('/invoices'),
  getProjectInvoices: (projectId) =>
    api.get(`/invoices/project/${projectId}`),
  updateInvoiceStatus: (invoiceId, status) =>
    api.patch(`/invoices/${invoiceId}/status`, { status }),
  getLedger: () => api.get('/ledger'),
};

// Insights API
export const insightsAPI = {
  getDashboard: () => api.get('/insights/dashboard'),
  getProjectRisk: (projectId) =>
    api.get(`/insights/risks/${projectId}`),
  getAllRisks: () => api.get('/insights/risks'),
};

export default api;
