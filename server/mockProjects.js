/**
 * Mock Projects Module
 * 
 * In-memory project storage for testing without a database.
 * Pre-populated with sample construction projects.
 */

// In-memory project store
let projects = [
  {
    id: 1,
    name: 'Downtown Office Complex',
    budget: 500000,
    spent: 250000,
    status: 'Active',
    start_date: '2024-01-15',
    end_date: '2024-12-31',
    progress: 50,
    description: 'Modern office building construction',
  },
  {
    id: 2,
    name: 'Residential Community Project',
    budget: 800000,
    spent: 400000,
    status: 'Active',
    start_date: '2024-02-01',
    end_date: '2025-06-30',
    progress: 40,
    description: 'Multi-unit residential complex',
  },
  {
    id: 3,
    name: 'Shopping Mall Expansion',
    budget: 1200000,
    spent: 600000,
    status: 'Planning',
    start_date: '2024-06-01',
    end_date: '2025-12-31',
    progress: 30,
    description: 'Expansion of existing shopping mall',
  },
  {
    id: 4,
    name: 'Road Infrastructure',
    budget: 950000,
    spent: 750000,
    status: 'In Progress',
    start_date: '2023-09-01',
    end_date: '2024-09-30',
    progress: 80,
    description: 'Road construction and maintenance',
  },
  {
    id: 5,
    name: 'School Building',
    budget: 450000,
    spent: 225000,
    status: 'Active',
    start_date: '2024-03-15',
    end_date: '2025-02-28',
    progress: 50,
    description: 'New educational facility',
  },
];

let nextId = projects.length + 1;

// Create a new project (mock version)
async function createProject(req, res) {
  try {
    const { name, budget, start_date, end_date, status, description } = req.body;

    if (!name || !budget) {
      return res.status(400).json({ error: 'name and budget are required' });
    }

    const newProject = {
      id: nextId++,
      name,
      budget,
      spent: 0,
      status: status || 'Planning',
      start_date,
      end_date,
      progress: 0,
      description: description || '',
    };

    projects.push(newProject);

    res.status(201).json({
      message: 'Project created successfully',
      projectId: newProject.id,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
}

// Get all projects (mock version)
async function getProjects(req, res) {
  try {
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
}

// Get single project (mock version)
async function getProject(req, res) {
  try {
    const { projectId } = req.params;
    const project = projects.find(p => p.id === parseInt(projectId));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
}

// Update project (mock version)
async function updateProject(req, res) {
  try {
    const { projectId } = req.params;
    const { name, budget, status, start_date, end_date, progress, spent, description } = req.body;

    const project = projects.find(p => p.id === parseInt(projectId));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update fields if provided
    if (name !== undefined) project.name = name;
    if (budget !== undefined) project.budget = budget;
    if (status !== undefined) project.status = status;
    if (start_date !== undefined) project.start_date = start_date;
    if (end_date !== undefined) project.end_date = end_date;
    if (progress !== undefined) project.progress = progress;
    if (spent !== undefined) project.spent = spent;
    if (description !== undefined) project.description = description;

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error updating project' });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
};
