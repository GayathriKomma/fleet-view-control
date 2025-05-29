
# Ship Maintenance Dashboard - ENTNT Technical Assignment

A comprehensive React-based ship maintenance management system that allows users to manage ships, components, and maintenance jobs with role-based access control.

## 🚢 Features

### Core Functionality
- **User Authentication**: Role-based access control (Admin, Inspector, Engineer)
- **Ships Management**: CRUD operations for ship fleet management
- **Components Management**: Track and manage ship components
- **Maintenance Jobs**: Create, assign, and track maintenance tasks
- **Calendar View**: Visual scheduling of maintenance activities
- **Notification System**: Real-time notifications for job updates
- **KPI Dashboard**: Visual analytics and performance metrics

### Role-Based Permissions
- **Admin**: Full access to all features including ship/component deletion
- **Inspector**: Can create and edit ships, components, and jobs (no deletion)
- **Engineer**: Can view all data and update assigned jobs

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM
- **State Management**: Context API
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Data Persistence**: Local Storage
- **Date Handling**: date-fns
- **Form Validation**: React Hook Form with Zod
- **Charts**: Recharts
- **Notifications**: Sonner Toast

## 📁 Project Structure

```
src/
├── components/
│   ├── Authentication/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── Ships/
│   │   └── ShipForm.tsx
│   ├── Components/
│   │   └── ComponentForm.tsx
│   ├── Jobs/
│   │   └── JobForm.tsx
│   └── Notifications/
│       └── NotificationCenter.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── ShipsContext.tsx
│   ├── ComponentsContext.tsx
│   ├── JobsContext.tsx
│   └── NotificationContext.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ShipsPage.tsx
│   ├── ShipDetailPage.tsx
│   ├── JobsPage.tsx
│   └── CalendarPage.tsx
├── utils/
│   ├── localStorageUtils.ts
│   └── roleUtils.ts
└── App.tsx
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ship-maintenance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Demo Credentials

The application comes with pre-configured demo accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@entnt.in | admin123 | Full access |
| Inspector | inspector@entnt.in | inspect123 | Create/Edit (no delete) |
| Engineer | engineer@entnt.in | engine123 | View all, edit assigned jobs |

## 🏗 Application Architecture

### Data Flow
1. **Authentication**: Context-based user management with localStorage persistence
2. **State Management**: Separate contexts for different data domains (Ships, Components, Jobs)
3. **Data Persistence**: All data stored in localStorage with utility functions
4. **Notifications**: Event-driven notification system for user actions

### Key Design Patterns
- **Context API**: Global state management without Redux complexity
- **Compound Components**: Reusable UI components with consistent styling
- **Custom Hooks**: Abstracted business logic and data operations
- **Role-Based Access**: Granular permission system based on user roles

### Component Hierarchy
```
App
├── AuthProvider
├── ShipsProvider
├── ComponentsProvider
├── JobsProvider
├── NotificationProvider
└── Router
    ├── LoginPage
    └── Layout
        ├── Sidebar
        ├── Header (with NotificationCenter)
        └── Page Components
```

## 📊 Data Models

### Ship
```typescript
interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Decommissioned';
  registrationDate: string;
  description?: string;
}
```

### Component
```typescript
interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  status: 'Active' | 'Maintenance Required' | 'Out of Service';
  description?: string;
}
```

### Job
```typescript
interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Routine Maintenance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description: string;
  estimatedHours: number;
  actualHours?: number;
  createdDate: string;
}
```

## 🎯 Key Features Explained

### Dashboard KPIs
- **Fleet Overview**: Total ships, active vs maintenance status
- **Component Health**: Components requiring maintenance
- **Job Metrics**: Active, completed, and priority-based job distribution
- **Recent Activity**: Latest maintenance activities

### Calendar Integration
- **Monthly View**: Visual representation of scheduled maintenance
- **Date Selection**: Click to view jobs for specific dates
- **Priority Highlighting**: High-priority jobs prominently displayed
- **Monthly Statistics**: Overview of job distribution

### Notification System
- **Real-time Updates**: Notifications for job creation, updates, and completion
- **Dismissible**: Users can mark notifications as read
- **Persistent**: Notifications stored and retrieved from localStorage

## 🔧 Technical Decisions

### Why Context API over Redux?
- **Simplicity**: Reduced boilerplate for this scale of application
- **Performance**: Adequate for the data size and update frequency
- **Learning Curve**: Easier to understand and maintain

### Local Storage Strategy
- **Persistence**: Data survives browser refreshes
- **No Backend Required**: Meets assignment constraints
- **Utility Layer**: Abstracted storage operations for maintainability

### Component Library Choice
- **Shadcn/UI**: Modern, accessible, and highly customizable
- **Tailwind CSS**: Utility-first styling for rapid development
- **Consistency**: Design system ensures uniform user experience

### Date Management
- **date-fns**: Lightweight alternative to moment.js
- **Immutability**: Functional approach to date operations
- **Bundle Size**: Tree-shakeable for optimal performance

## 🐛 Known Issues and Limitations

### Current Limitations
1. **Offline Storage**: Data limited to localStorage capacity (~5-10MB)
2. **No Data Validation**: Client-side only validation (would need server-side in production)
3. **Static Users**: User management is pre-configured (no user registration)
4. **No File Uploads**: Cannot attach documents or images to jobs
5. **Limited Charts**: Basic progress bars instead of complex visualizations

### Future Enhancements
- **Export Functionality**: PDF/Excel export for reports
- **Advanced Filtering**: Complex search and filter options
- **Bulk Operations**: Multi-select for batch updates
- **Drag & Drop**: Calendar job rescheduling
- **Real-time Sync**: WebSocket integration for multi-user scenarios

## 🔒 Security Considerations

### Current Implementation
- **Client-side Authentication**: Suitable for demo/internal use
- **Role-based UI**: Prevents unauthorized actions in interface
- **Input Validation**: Form validation prevents invalid data entry

### Production Recommendations
- **JWT Tokens**: Secure authentication with server validation
- **HTTPS**: Encrypted data transmission
- **RBAC Backend**: Server-side permission enforcement
- **Audit Logs**: Track all user actions and changes

## 📱 Responsive Design

The application is fully responsive across devices:
- **Desktop**: Full feature access with optimal layout
- **Tablet**: Adapted layouts for touch interaction
- **Mobile**: Condensed views with essential functionality

## 🧪 Testing Strategy

### Recommended Testing Approach
```typescript
// Unit Tests
- Utility functions (localStorageUtils, roleUtils)
- Component rendering and props
- Context state management

// Integration Tests
- User authentication flow
- CRUD operations for ships/components/jobs
- Role-based permission enforcement

// E2E Tests
- Complete user workflows
- Cross-page navigation
- Data persistence verification
```

## 📈 Performance Considerations

### Optimization Techniques
- **Code Splitting**: Route-based lazy loading
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large data lists (if needed)
- **Image Optimization**: Proper sizing and formats

### Bundle Analysis
```bash
npm run build
npm run preview
```

## 🔄 Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Platforms
- **Vercel**: Automatic deployments from GitHub
- **Netlify**: Simple drag-and-drop deployment
- **GitHub Pages**: Free hosting for static sites

### Environment Variables
Currently no environment variables required. In production:
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

## 📝 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting
- **Component Structure**: Props interfaces, proper exports
- **Naming Conventions**: PascalCase for components, camelCase for functions

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature
```

### Commit Message Format
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Testing additions

## 📞 Support and Contact

For questions about this implementation:
- **Technical Issues**: Check console for error messages
- **Feature Requests**: Document in project issues
- **Deployment Help**: Refer to platform-specific documentation

---

**Built with ❤️ for ENTNT Technical Assignment**

*This application demonstrates modern React development practices with enterprise-level architecture considerations.*
