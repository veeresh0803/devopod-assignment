const pool = require('../config/db');

// Calculate project risk
exports.calculateProjectRisk = async (req, res) => {
  try {
    const { projectId } = req.params;

    const connection = await pool.getConnection();
    const [projects] = await connection.query(
      'SELECT * FROM projects WHERE id = ?',
      [projectId]
    );

    connection.release();

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];

    let riskScore = 0;
    let riskLevel = 'Low';
    let warnings = [];

    // Calculate budget usage percentage
    const budgetUsedPercent = (project.spent / project.budget) * 100;

    // Check if we're using too much budget too early
    if (budgetUsedPercent > 80) {
      riskScore += 40;
      warnings.push('High budget utilization (>80%)');
    } else if (budgetUsedPercent > 60) {
      riskScore += 20;
      warnings.push('Moderate budget utilization (>60%)');
    }

    // Check timeline risk
    if (project.start_date && project.end_date) {
      const startDate = new Date(project.start_date);
      const endDate = new Date(project.end_date);
      const today = new Date();
      const totalDuration = endDate - startDate;
      const elapsedDuration = today - startDate;
      const progressPercent = (elapsedDuration / totalDuration) * 100;

      // If we've spent more than expected for our progress
      if (budgetUsedPercent > progressPercent + 20) {
        riskScore += 40;
        warnings.push('Spending ahead of schedule');
      }

      // If project should have ended
      if (today > endDate) {
        riskScore += 30;
        warnings.push('Project deadline exceeded');
      }
    }

    // Determine risk level
    if (riskScore >= 70) {
      riskLevel = 'Critical';
    } else if (riskScore >= 40) {
      riskLevel = 'High';
    } else if (riskScore > 0) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'Low';
    }

    res.json({
      projectId: project.id,
      projectName: project.name,
      budget: project.budget,
      spent: project.spent,
      budgetUsedPercent: budgetUsedPercent.toFixed(2),
      riskScore,
      riskLevel,
      warnings,
    });
  } catch (error) {
    console.error('Calculate risk error:', error);
    res.status(500).json({ error: 'Server error calculating risk' });
  }
};

// Get dashboard insights (overall)
exports.getDashboardInsights = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get total revenue and project data
    const [projects] = await connection.query('SELECT * FROM projects');
    const [invoices] = await connection.query(
      'SELECT SUM(amount) as total_revenue FROM invoices WHERE status = ?',
      ['Paid']
    );

    // Calculate overall stats
    let totalBudget = 0;
    let totalSpent = 0;
    let highRiskProjects = 0;
    let activeProjects = 0;

    projects.forEach((project) => {
      totalBudget += project.budget;
      totalSpent += project.spent;

      if (project.status === 'Active') activeProjects++;

      const budgetUsedPercent = (project.spent / project.budget) * 100;
      if (budgetUsedPercent > 60) {
        highRiskProjects++;
      }
    });

    connection.release();

    const totalRevenue = invoices[0]?.total_revenue || 0;
    const overallBudgetHealth = ((totalBudget - totalSpent) / totalBudget * 100).toFixed(2);

    res.json({
      totalProjects: projects.length,
      activeProjects,
      totalBudget,
      totalSpent,
      totalRevenue,
      overallBudgetHealth,
      highRiskProjects,
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        budgetUsedPercent: ((p.spent / p.budget) * 100).toFixed(2),
      })),
    });
  } catch (error) {
    console.error('Dashboard insights error:', error);
    res.status(500).json({ error: 'Server error fetching insights' });
  }
};

// Get all project risks
exports.getAllProjectRisks = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [projects] = await connection.query('SELECT * FROM projects');

    connection.release();

    const risks = projects.map((project) => {
      let riskScore = 0;
      let riskLevel = 'Low';
      const budgetUsedPercent = (project.spent / project.budget) * 100;

      if (budgetUsedPercent > 80) {
        riskScore += 40;
      } else if (budgetUsedPercent > 60) {
        riskScore += 20;
      }

      if (riskScore >= 70) {
        riskLevel = 'Critical';
      } else if (riskScore >= 40) {
        riskLevel = 'High';
      } else if (riskScore > 0) {
        riskLevel = 'Medium';
      }

      return {
        projectId: project.id,
        projectName: project.name,
        riskScore,
        riskLevel,
        budgetUsedPercent: budgetUsedPercent.toFixed(2),
      };
    });

    res.json(risks);
  } catch (error) {
    console.error('Get all risks error:', error);
    res.status(500).json({ error: 'Server error fetching risks' });
  }
};
