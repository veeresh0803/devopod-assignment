const pool = require('../config/db');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, budget, start_date, end_date, status } = req.body;

    if (!name || !budget) {
      return res.status(400).json({ error: 'name and budget are required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO projects (name, budget, spent, status, start_date, end_date) VALUES (?, ?, 0, ?, ?, ?)',
      [name, budget, status || 'Active', start_date, end_date]
    );

    connection.release();

    res.status(201).json({
      message: 'Project created successfully',
      projectId: result.insertId,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [projects] = await connection.query('SELECT * FROM projects ORDER BY id DESC');

    connection.release();

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

// Get single project
exports.getProject = async (req, res) => {
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

    res.json(projects[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error fetching project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, budget, status, start_date, end_date } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE projects SET name = ?, budget = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?',
      [name, budget, status, start_date, end_date, projectId]
    );

    connection.release();

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error updating project' });
  }
};
