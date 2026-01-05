# Eurizon Investment Client Portal

A comprehensive, secure, and user-friendly web application designed to provide clients and administrators with real-time access to investment portfolios, market data, trading capabilities, document management, and analytical tools.

## Features

- **Client Dashboard**: Real-time portfolio monitoring and performance tracking
- **Admin Panel**: User and document management, payment processing, analytics
- **Market Data**: Live market information and currency conversion
- **Demo Trading**: Virtual trading environment for practice
- **Document Management**: Secure document upload and access
- **Authentication**: Secure login with Supabase authentication

## Tech Stack

- **Framework**: React 19 with Create React App
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **Charts**: Chart.js and Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── admin/      # Admin-related components
│   │   ├── auth/       # Authentication components
│   │   ├── common/     # Shared components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── documents/  # Document management
│   │   └── trading/    # Trading and market components
│   ├── context/        # React context providers
│   ├── lib/            # Utility libraries (Supabase client)
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── archive/            # Archived/old project versions
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AAA-support/Eurizon.git
cd Eurizon
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App.

## User Roles

1. **Investment Clients** - Monitor portfolios and access documents
2. **Administrators** - Manage users, documents, and analytics
3. **Demo Users** - Practice trading with virtual funds
4. **Temporary Users** - Limited access for viewing

## Security

- Supabase Row Level Security (RLS) policies
- Secure authentication flows
- Environment-based configuration
- Input validation and sanitization

## Documentation

- [PRD.md](PRD.md) - Product Requirements Document
- [PROJECT_REVIEW.md](PROJECT_REVIEW.md) - Project review and analysis
- [REFACTORING_REVIEW.md](REFACTORING_REVIEW.md) - Code refactoring notes

## Support

For support and questions, please contact Eurizon Investment support at support@eurizoninvestment.com

## License

Private - Eurizon Investment Management
