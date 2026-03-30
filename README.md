# Corenic Construction Executive Dashboard

A modern, interactive executive financial analytics dashboard for Corenic Construction leadership.

## Features

- **Executive Dashboard** - KPI summary tiles with trend indicators
- **Interactive Visualizations** - Revenue, profit, cash, backlog, and project charts
- **File Upload** - Upload Excel (.xlsx) or CSV files to update the dashboard
- **Data Persistence** - Historical records maintained across sessions
- **Responsive Design** - Works on desktop and tablet

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Charts**: Apache ECharts
- **File Parsing**: SheetJS (xlsx)
- **Hosting**: Vercel (free tier)

## Getting Started

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Deployment to Vercel

1. Push this code to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically deploy

## Data Format

Upload Excel or CSV files with the following columns:

| Column | Description |
|--------|-------------|
| Month | Month name (e.g., "January 2026") |
| Revenue | Total revenue |
| Direct Costs | Direct costs/COGS |
| Gross Profit | Gross profit |
| Operating Income | Operating income |
| Net Income | Net income |
| Cash | Cash position |
| Backlog | Backlog value |
| Active Projects | Number of active projects |
| Headcount | Total headcount |
| DSO | Days Sales Outstanding |

The system automatically detects column headers regardless of naming conventions.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── data/route.ts    # GET KPIs and records
│   │   │   └── upload/route.ts   # POST file upload
│   │   ├── page.tsx             # Main dashboard
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── KPICard.tsx          # KPI tile component
│   │   ├── RevenueChart.tsx     # Revenue bar chart
│   │   ├── ProfitChart.tsx      # Profit line charts
│   │   ├── CashBacklogChart.tsx # Cash & backlog chart
│   │   ├── ProjectsChart.tsx    # Projects & headcount
│   │   ├── FileUpload.tsx       # Drag & drop upload
│   │   └── Sidebar.tsx          # Navigation sidebar
│   └── lib/
│       ├── types.ts             # TypeScript types
│       ├── dataStore.ts         # In-memory data store
│       └── parser.ts            # Excel/CSV parser
├── package.json
├── tailwind.config.js
└── next.config.js
```

## License

Private - Corenic Construction