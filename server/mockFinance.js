/**
 * Mock Finance Module
 * 
 * In-memory invoice and ledger storage for testing without a database.
 */

let invoices = [
  {
    id: 1,
    project_id: 1,
    amount: 50000,
    status: 'Paid',
    invoice_date: '2024-02-01',
    due_date: '2024-03-01',
    description: 'Phase 1 Materials',
  },
  {
    id: 2,
    project_id: 1,
    amount: 75000,
    status: 'Pending',
    invoice_date: '2024-03-15',
    due_date: '2024-04-15',
    description: 'Phase 2 Labor',
  },
  {
    id: 3,
    project_id: 2,
    amount: 100000,
    status: 'Paid',
    invoice_date: '2024-03-01',
    due_date: '2024-04-01',
    description: 'Foundation Work',
  },
  {
    id: 4,
    project_id: 2,
    amount: 60000,
    status: 'Overdue',
    invoice_date: '2024-04-01',
    due_date: '2024-05-01',
    description: 'Structural Work',
  },
];

let accounts = [
  {
    id: 1,
    project_id: 1,
    account_type: 'Income',
    amount: 500000,
    description: 'Project Budget',
    date: '2024-01-01',
  },
  {
    id: 2,
    project_id: 1,
    account_type: 'Expense',
    amount: 250000,
    description: 'Materials & Labor',
    date: '2024-03-15',
  },
  {
    id: 3,
    project_id: 2,
    account_type: 'Income',
    amount: 800000,
    description: 'Project Budget',
    date: '2024-02-01',
  },
  {
    id: 4,
    project_id: 2,
    account_type: 'Expense',
    amount: 400000,
    description: 'Construction Costs',
    date: '2024-04-01',
  },
];

let nextInvoiceId = invoices.length + 1;
let nextAccountId = accounts.length + 1;

// Create invoice (mock)
async function createInvoice(req, res) {
  try {
    const { project_id, amount, status, invoice_date, due_date, description } = req.body;

    if (!project_id || !amount) {
      return res.status(400).json({ error: 'project_id and amount are required' });
    }

    const newInvoice = {
      id: nextInvoiceId++,
      project_id,
      amount,
      status: status || 'Pending',
      invoice_date: invoice_date || new Date().toISOString().split('T')[0],
      due_date,
      description: description || '',
    };

    invoices.push(newInvoice);

    res.status(201).json({
      message: 'Invoice created successfully',
      invoiceId: newInvoice.id,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Server error creating invoice' });
  }
}

// Get all invoices (mock)
async function getInvoices(req, res) {
  try {
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Server error fetching invoices' });
  }
}

// Get project invoices (mock)
async function getProjectInvoices(req, res) {
  try {
    const { projectId } = req.params;
    const projectInvoices = invoices.filter(inv => inv.project_id === parseInt(projectId));
    res.json(projectInvoices);
  } catch (error) {
    console.error('Get project invoices error:', error);
    res.status(500).json({ error: 'Server error fetching invoices' });
  }
}

// Update invoice status (mock)
async function updateInvoiceStatus(req, res) {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    const invoice = invoices.find(inv => inv.id === parseInt(invoiceId));

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    invoice.status = status || invoice.status;

    res.json({ message: 'Invoice updated successfully' });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Server error updating invoice' });
  }
}

// Get account ledger (mock)
async function getAccountLedger(req, res) {
  try {
    res.json(accounts);
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({ error: 'Server error fetching ledger' });
  }
}

module.exports = {
  createInvoice,
  getInvoices,
  getProjectInvoices,
  updateInvoiceStatus,
  getAccountLedger,
};
