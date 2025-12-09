/**
 * Mock Insights Module
 * 
 * Risk analysis and dashboard insights without a database.
 */

// Sample projects for reference
const mockProjects = [
  {
    id: 1,
    name: 'Downtown Office Complex',
    budget: 500000,
    spent: 250000,
    status: 'Active',
    progress: 50,
  },
  {
    id: 2,
    name: 'Residential Community Project',
    budget: 800000,
    spent: 400000,
    status: 'Active',
    progress: 40,
  },
  {
    id: 3,
    name: 'Shopping Mall Expansion',
    budget: 1200000,
    spent: 600000,
    status: 'Planning',
    progress: 30,
  },
  {
    id: 4,
    name: 'Road Infrastructure',
    budget: 950000,
    spent: 750000,
    status: 'In Progress',
    progress: 80,
  },
  {
    id: 5,
    name: 'School Building',
    budget: 450000,
    spent: 225000,
    status: 'Active',
    progress: 50,
  },
];

// Calculate risk for a project
function calculateRisk(project) {
  let riskScore = 0;
  let riskLevel = 'Low';

  // Budget risk: how much of budget is spent
  const budgetUsedPercent = (project.spent / project.budget) * 100;
  if (budgetUsedPercent > 80) riskScore += 3;
  else if (budgetUsedPercent > 60) riskScore += 2;
  else if (budgetUsedPercent > 40) riskScore += 1;

  // Progress risk: are we on track?
  if (project.progress < 30 && project.status === 'Active') riskScore += 2;
  else if (project.progress < 50 && project.status === 'In Progress') riskScore += 1;

  // Status risk
  if (project.status === 'On Hold' || project.status === 'Delayed') riskScore += 3;
  else if (project.status === 'At Risk') riskScore += 2;

  // Determine risk level
  if (riskScore >= 6) riskLevel = 'Critical';
  else if (riskScore >= 4) riskLevel = 'High';
  else if (riskScore >= 2) riskLevel = 'Medium';
  else riskLevel = 'Low';

  return {
    riskScore,
    riskLevel,
    budgetUsedPercent: Math.round(budgetUsedPercent),
  };
}

// Calculate project risk (mock)
async function calculateProjectRisk(req, res) {
  try {
    const { projectId } = req.params;
    const project = mockProjects.find(p => p.id === parseInt(projectId));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const risk = calculateRisk(project);

    res.json({
      projectId: project.id,
      projectName: project.name,
      ...risk,
    });
  } catch (error) {
    console.error('Calculate risk error:', error);
    res.status(500).json({ error: 'Server error calculating risk' });
  }
}

// Get all project risks (mock)
async function getAllProjectRisks(req, res) {
  try {
    const risks = mockProjects.map(project => {
      const risk = calculateRisk(project);
      return {
        projectId: project.id,
        projectName: project.name,
        ...risk,
      };
    });

    res.json(risks);
  } catch (error) {
    console.error('Get all risks error:', error);
    res.status(500).json({ error: 'Server error fetching risks' });
  }
}

// Get dashboard insights (mock)
async function getDashboardInsights(req, res) {
  try {
    const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
    const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
    const completedProjects = mockProjects.filter(p => p.status === 'Completed').length;

    const risks = mockProjects.map(project => {
      const risk = calculateRisk(project);
      return {
        projectId: project.id,
        projectName: project.name,
        ...risk,
      };
    });

    const criticalRisks = risks.filter(r => r.riskLevel === 'Critical').length;
    const highRisks = risks.filter(r => r.riskLevel === 'High').length;

    res.json({
      summary: {
        totalProjects: mockProjects.length,
        activeProjects,
        completedProjects,
        totalBudget,
        totalSpent,
        budgetUtilization: Math.round((totalSpent / totalBudget) * 100),
      },
      risks: {
        critical: criticalRisks,
        high: highRisks,
        all: risks,
      },
      recentActivity: [
        {
          timestamp: new Date().toISOString(),
          type: 'project_update',
          message: 'Dashboard insights generated',
        },
      ],
    });
  } catch (error) {
    console.error('Get dashboard insights error:', error);
    res.status(500).json({ error: 'Server error fetching insights' });
  }
}

module.exports = {
  calculateProjectRisk,
  getAllProjectRisks,
  getDashboardInsights,
};
