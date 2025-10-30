# Sistema de Gestão de Irregularidades

## Project Overview
A full-stack web application for managing telecommunications irregularities on utility poles. The system allows users to upload Excel files, track irregularities, manage verification processes, and generate reports.

## Recent Changes
**Date: October 30, 2025**
- ✅ Successfully migrated project from Lovable to Replit fullstack environment
- ✅ Restructured project with client/server separation
- ✅ Created backend API with in-memory storage
- ✅ Set up proper TypeScript configuration for fullstack development
- ✅ Configured workflow to run on port 5000 with Vite HMR
- ✅ Fixed Vite allowedHosts configuration for Replit environment
- ✅ Application is running successfully on Replit

## Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
│   └── index.html
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Storage interface (in-memory)
│   └── vite.ts          # Vite middleware setup
├── shared/              # Shared types between client and server
│   └── schema.ts        # Data schemas and types
└── attached_assets/     # User-uploaded images
```

## Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, tsx
- **Data Management**: In-memory storage (can be upgraded to database)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Excel Processing**: xlsx library

## Key Features
1. **File Upload**: Upload and process Excel files with irregularity data
2. **Dashboard**: View statistics and metrics for irregularities
3. **Filtering**: Filter by municipality, status, location, and irregularity type
4. **Verification**: JVM verification workflow for reoccurring irregularities
5. **Field Tracking**: Mark irregularities for field verification
6. **Export**: Export data to Excel and JSON formats
7. **Charts**: Visual flow analysis across time periods
8. **Analysis**: Detailed analytics dashboard

## Development
- Run `npm run dev` to start the development server
- The application runs on port 5000
- Frontend uses Vite for hot module replacement
- Backend uses tsx for TypeScript execution with auto-reload
- Workflow "Start application" is configured and running

## Storage
Currently using in-memory storage. Data is stored in:
- Irregularities array
- Chart data array

To persist data, upgrade to PostgreSQL database using Replit's built-in database.

## Migration Notes
This project was successfully migrated from Lovable to Replit fullstack environment. Key changes:
- Moved `src/` to `client/src/`
- Created `server/` directory for backend
- Created `shared/` directory for shared types
- Updated all import paths and configurations
- Set up proper fullstack development environment
- Configured Vite with `allowedHosts: true` for Replit environment
- All components now use shared schema types from `@shared/schema`

## Next Steps
The application is ready for development! You can:
- Upload Excel files to test the irregularity management system
- Add database persistence using Replit's PostgreSQL
- Deploy the application to production
- Customize the features as needed
