# Construction Mini ERP System

A full-stack Enterprise Resource Planning (ERP) system tailored for the construction industry. This application manages Users, Finances (General Ledger, Invoices), and provides AI-driven insights to help managers identify risks in projects.

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API Server
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

### Frontend
- **React.js** - User Interface
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **Vite** - Build Tool

## Features

### User Management
- User Registration & Login
- JWT Token-based Authentication
- Role-based Access Control (Admin, Manager, User)

### Project Management
- Create and manage construction projects
- Track project budgets and spending
- Monitor project status (Active, Completed, On Hold)
- Set project timelines

### Financial Management
- Invoice creation and tracking
- Accounts Receivable ledger
- Budget utilization tracking
- Payment status management (Pending, Paid)

### AI-Driven Insights
- **Project Risk Assessment**: Calculates risk scores based on:
  - Budget utilization vs. project progress
  - Timeline adherence
  - Spending patterns
- **Risk Levels**: Critical, High, Medium, Low
- **Dashboard Analytics**: Overview of portfolio health

## Project Structure

```
/mini-erp-project
├── /server (Backend)
│   ├── /config
│   │   └── db.js
│   ├── /controllers
│   │   ├── authController.js
│   │   ├── financeController.js
│   │   ├── projectController.js
│   │   └── insightController.js
│   ├── /routes
│   │   ├── authRoutes.js
│   │   └── apiRoutes.js
│   ├── /middleware
│   │   └── authMiddleware.js
│   ├── .env
│   ├── database.sql
│   ├── package.json
│   └── index.js
│
├── /client (Frontend)
│   ├── /src
│   │   ├── /components
│   │   │   ├── Card.jsx
│   │   │   ├── RiskChart.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── /pages
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Finance.jsx
│   │   ├── /services
│   │   │   └── api.js
│   │   ├── /context
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL Server
- Git

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Open MySQL Workbench or command line
   - Run the SQL script from `database.sql`
   - Update `.env` with your MySQL credentials

4. **Configure environment variables** (`.env`)
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=construction_erp
   DB_PORT=3306
   SERVER_PORT=5000
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

## Default Login Credentials

- **Username**: `admin`
- **Password**: `password` (change the hash in database.sql before production)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `POST /api/projects` - Create project (Protected)
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:projectId` - Get single project (Protected)
- `PATCH /api/projects/:projectId` - Update project (Protected)

### Finance
- `POST /api/invoices` - Create invoice (Protected)
- `GET /api/invoices` - Get all invoices (Protected)
- `GET /api/invoices/project/:projectId` - Get project invoices (Protected)
- `PATCH /api/invoices/:invoiceId/status` - Update invoice status (Protected)
- `GET /api/ledger` - Get account ledger (Protected)

### Insights
- `GET /api/insights/dashboard` - Get dashboard insights (Protected)
- `GET /api/insights/risks` - Get all project risks (Protected)
- `GET /api/insights/risks/:projectId` - Get project risk details (Protected)

## Usage

1. **Login** with admin credentials
2. **Create Projects** with budget and timeline information
3. **Create Invoices** linked to projects to track spending
4. **Monitor Dashboard** for real-time risk assessment
5. **Review Risk Scores** to identify high-risk projects

## Risk Calculation Logic

The system calculates project risk based on:
- **Budget Usage vs Progress**: If 85% of budget is spent but only 50% complete → HIGH RISK
- **Timeline Risk**: Projects past their end date get penalty
- **Budget Overrun**: Spending significantly ahead of schedule is flagged
- **Risk Score Range**: 0-100
- **Risk Levels**:
  - 0-29: Low
  - 30-39: Medium
  - 40-69: High
  - 70+: Critical

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Verify credentials in `.env`
- Check database was created from `database.sql`

### CORS Errors
- Ensure backend is running on port 5000
- Frontend is configured to call `http://localhost:5000`

### JWT Token Issues
- Clear localStorage and login again
- Check `JWT_SECRET` in `.env` matches code

## Future Enhancements

- Multi-currency support
- Advanced reporting and export
- Real-time notifications
- Mobile app version
- Integration with accounting software
- Document management system
- Resource allocation module



