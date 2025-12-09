const express = require('express');
const router = express.Router();
const financeController = process.env.SKIP_DB_CHECK === 'true'
  ? require('../mockFinance')
  : require('../controllers/financeController');
const projectController = process.env.SKIP_DB_CHECK === 'true'
  ? require('../mockProjects')
  : require('../controllers/projectController');
const insightController = process.env.SKIP_DB_CHECK === 'true'
  ? require('../mockInsights')
  : require('../controllers/insightController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Finance routes (invoices)
router.post('/invoices', authenticateToken, financeController.createInvoice);
router.get('/invoices', authenticateToken, financeController.getInvoices);
router.get('/invoices/project/:projectId', authenticateToken, financeController.getProjectInvoices);
router.patch('/invoices/:invoiceId/status', authenticateToken, financeController.updateInvoiceStatus);
router.get('/ledger', authenticateToken, financeController.getAccountLedger);

// Project routes
router.post('/projects', authenticateToken, projectController.createProject);
router.get('/projects', authenticateToken, projectController.getProjects);
router.get('/projects/:projectId', authenticateToken, projectController.getProject);
router.patch('/projects/:projectId', authenticateToken, projectController.updateProject);

// Insights/Risk routes
router.get('/insights/dashboard', authenticateToken, insightController.getDashboardInsights);
router.get('/insights/risks', authenticateToken, insightController.getAllProjectRisks);
router.get('/insights/risks/:projectId', authenticateToken, insightController.calculateProjectRisk);

module.exports = router;
