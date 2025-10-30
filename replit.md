# Sistema de Gestão de Irregularidades em Postes

## Overview

This is a web-based management system for monitoring and managing irregularities found in telecommunications poles. The application enables users to import data from Excel/JSON files, track deadlines, manage regularization status, and visualize statistics through charts and dashboards. Built with React, TypeScript, and Vite, it provides a comprehensive interface for telecommunications compliance management.

## Recent Changes

**October 29, 2025**
- **Enhanced "Em Campo" functionality**: When an irregularity is marked as "regularizado" (regularized) in the "Em Campo" tab, it is now automatically removed from that tab. The system sets `emCampo` to "Não" when `regularizado` is set to "Sim", ensuring clean separation between active field work and completed items.

- **Improved JSON Export/Import System**: 
  - UpdateFileUpload now accepts both Excel (.xlsx) and JSON (.json) files for updates
  - Smart merge logic preserves critical states (regularizado, emCampo, statusVerificacao) when importing JSON
  - JSON-provided values override existing data, ensuring updates are applied correctly
  - Automatic detection of reincidences: items previously marked as "regularizado" that reappear are flagged for JVM verification
  - Complete workflow support: Export JSON → Edit/Update → Import JSON → States preserved
  - This enables conflict-free file updates while maintaining data integrity

**October 30, 2025**
- **Automatic timestamp on regularization**: When an irregularity is marked as "regularizado" (regularized), the system now automatically updates the `dataEnvioEmail` field with the current date and time in the format "dd/MM/yyyy HH:mm". This timestamp is preserved in JSON exports and appears in Excel exports of regularized items, providing accurate tracking of when items were completed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18.3+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- React Router (wouter) for lightweight client-side routing
- Single-page application (SPA) architecture with component-based design

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom HSL color variables
- Dark mode support via next-themes
- Responsive design patterns for mobile and desktop viewports

**State Management**
- React Query (@tanstack/react-query) for server state and data fetching
- Local component state using React hooks (useState, useMemo)
- No global state management library - state is managed at the component level
- Data flows from parent (Index page) to child components via props

**Data Visualization**
- Recharts library for rendering bar charts and pie charts
- Custom FluxoChart component for weekly trend visualization
- AnalysisDashboard component for statistical breakdowns by municipality, operator, and irregularity type

### Data Processing & Import

**File Upload System**
- Supports both .xlsx (Excel) and .json file formats for initial upload and updates
- XLSX library for parsing Excel workbooks
- Two upload modes:
  - Initial upload (FileUpload component): Creates new dataset from Excel or JSON
  - Update upload (UpdateFileUpload component): 
    - Accepts both .xlsx and .json files
    - Smart merge: preserves regularizado, emCampo, and statusVerificacao states
    - Uses nullish coalescing to honor JSON updates while falling back to existing values when fields are absent
    - Automatic JVM flagging for reincidences (previously regularized items that reappear)

**Data Normalization**
- Column name normalization handles accent removal, case-insensitivity, and whitespace
- Flexible column mapping to accommodate varying Excel formats
- Automatic data type conversion and validation

**Data Structure**
The core data model (Irregularity type) includes:
- Location data: municipio, bairro, logradouro, numLogradouro
- Identification: numFormulario, numeroPoste, operadora
- Status tracking: regularizado, statusVerificacao, emCampo
- Temporal data: vencidas (days overdue), emailEnviado, dataEnvioEmail
- Irregularity classification: irregularidade field

### Feature Components

**Filtering & Search System**
- Multi-dimensional filtering: municipality, status (overdue/on-time/regularized), irregularity type
- Text search across multiple fields
- Logradouro (street address) specific search
- Filters component provides reusable UI controls

**Table & Grouping**
- IrregularityTable: Groups records by numFormulario (form number)
- Expandable/collapsible groups using React state
- Inline checkbox controls for marking items as regularized or "em campo" (field verified)
- VerificacaoJVMTable: Special view for items requiring JVM verification (reappeared after being marked regularized)

**Statistics & Analytics**
- Real-time calculation of totals: total records, overdue, on-time, regularized, pending
- StatsCard components display key metrics with clickable filters
- Distribution analysis by municipality and operator
- Top irregularities ranking in AnalysisDashboard

**Export Functionality**
- Excel export using XLSX library
- Separate sheets for main data and chart/flow data
- Column formatting and header customization
- Exports respect current filter state

### Styling & Theming

**Design System**
- HSL-based color tokens defined in index.css
- Custom CSS variables for semantic colors (primary, secondary, success, warning, destructive)
- Dark theme with high contrast for accessibility
- Consistent spacing and typography through Tailwind configuration

**Component Variants**
- Badge component with status-based color variants
- Button variants (default, destructive, outline, ghost, link)
- Card-based layout for content sections
- Toast notifications for user feedback

### Development Configuration

**TypeScript Setup**
- Strict mode disabled for flexibility (noImplicitAny: false)
- Path aliases configured (@/ maps to ./src/)
- Separate configs for app and node environments
- ESM module system

**Vite Configuration**
- Custom server configuration for Replit environment
- HMR (Hot Module Replacement) via WebSocket with SSL
- SWC-based React plugin for fast refresh
- Host set to 0.0.0.0 for network accessibility

**Code Quality**
- ESLint with TypeScript support
- React Hooks plugin for rules enforcement
- Unused variable warnings disabled for development flexibility
- React Refresh plugin for component hot reloading

## External Dependencies

**UI Framework & Components**
- @radix-ui: Complete suite of accessible UI primitives (accordion, alert-dialog, checkbox, dialog, dropdown-menu, select, tabs, toast, etc.)
- class-variance-authority: Type-safe component variant handling
- cmdk: Command palette/menu functionality
- embla-carousel-react: Touch-friendly carousel component
- lucide-react: Icon library for UI elements

**Data & Forms**
- @hookform/resolvers: Form validation integration
- react-hook-form: Form state management (configured but not heavily used)
- date-fns: Date formatting and manipulation
- react-day-picker: Calendar/date picker component

**Charting & Visualization**
- recharts: Declarative charting library for bar and pie charts
- @tanstack/react-virtual: Virtualization for large datasets (performance optimization)

**File Processing**
- xlsx (SheetJS): Excel file parsing and generation

**Routing & State**
- wouter: Lightweight routing (minimal footprint alternative to React Router)
- @tanstack/react-query: Async state management and caching

**Styling**
- tailwindcss: Utility-first CSS framework
- tailwind-merge: Utility for merging Tailwind classes
- clsx: Conditional class name builder
- next-themes: Theme switching (dark/light mode)

**Build Tools**
- vite: Fast build tool and dev server
- @vitejs/plugin-react-swc: React plugin with SWC compiler
- typescript-eslint: TypeScript linting
- autoprefixer & postcss: CSS processing

**Potential Database Consideration**
While the current implementation uses in-memory state, the data structure and update patterns suggest the application could be enhanced with a persistent database (e.g., PostgreSQL with Drizzle ORM) for production deployments where data persistence across sessions is required.