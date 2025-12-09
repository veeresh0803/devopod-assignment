const pool = require('../config/db');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { project_id, amount, description, invoice_date, due_date } = req.body;

    if (!project_id || !amount || !invoice_date) {
      return res.status(400).json({ error: 'project_id, amount, and invoice_date are required' });
    }

    const connection = await pool.getConnection();

    // Insert invoice
    const [result] = await connection.query(
      'INSERT INTO invoices (project_id, amount, description, invoice_date, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [project_id, amount, description || '', invoice_date, due_date, 'Pending']
    );

    // Update project spent amount
    await connection.query(
      'UPDATE projects SET spent = spent + ? WHERE id = ?',
      [amount, project_id]
    );

    connection.release();

    res.status(201).json({
      message: 'Invoice created successfully',
      invoiceId: result.insertId,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Server error creating invoice' });
  }
};

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [invoices] = await connection.query(
      'SELECT i.*, p.name as project_name FROM invoices i LEFT JOIN projects p ON i.project_id = p.id ORDER BY i.invoice_date DESC'
    );

    connection.release();

    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Server error fetching invoices' });
  }
};

// Get invoices for a specific project
exports.getProjectInvoices = async (req, res) => {
  try {
    const { projectId } = req.params;

    const connection = await pool.getConnection();
    const [invoices] = await connection.query(
      'SELECT * FROM invoices WHERE project_id = ? ORDER BY invoice_date DESC',
      [projectId]
    );

    connection.release();

    res.json(invoices);
  } catch (error) {
    console.error('Get project invoices error:', error);
    res.status(500).json({ error: 'Server error fetching invoices' });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE invoices SET status = ? WHERE id = ?',
      [status, invoiceId]
    );

    connection.release();

    res.json({ message: 'Invoice status updated successfully' });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Server error updating invoice' });
  }
};

// Get account ledger summary
exports.getAccountLedger = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [ledger] = await connection.query(`
      SELECT 
        COUNT(*) as total_invoices,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending_amount
      FROM invoices
    `);

    connection.release();

    res.json(ledger[0] || {});
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({ error: 'Server error fetching ledger' });
  }
};
