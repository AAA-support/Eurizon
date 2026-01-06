# Architecture Documentation

## Overview

Eurizon Investment Portal is built using modern React architecture with functional components, Context API for state management, and a modular component structure.

## Technology Stack

- **React 19.1.1** - UI Library
- **Vite 7.1.7** - Build Tool
- **Context API** - State Management
- **Lucide React** - Icons
- **CSS3** - Styling

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   App.jsx                        │
│            (Root Component)                      │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │         ErrorBoundary                    │   │
│  │    (Error Handling Layer)                │   │
│  │                                           │   │
│  │  ┌──────────────────────────────────┐   │   │
│  │  │      AppProvider                  │   │   │
│  │  │   (Context API State)             │   │   │
│  │  │                                    │   │   │
│  │  │  ┌───────────────────────────┐   │   │   │
│  │  │  │     AppRouter             │   │   │   │
│  │  │  │  (Route Management)       │   │   │   │
│  │  │  │                            │   │   │   │
│  │  │  │  ┌──────────────────┐    │   │   │   │
│  │  │  │  │    Layout        │    │   │   │   │
│  │  │  │  │  (Sidebar +      │    │   │   │   │
│  │  │  │  │   Content)       │    │   │   │   │
│  │  │  │  │                   │    │   │   │   │
│  │  │  │  │  Pages/          │    │   │   │   │
│  │  │  │  │  Components      │    │   │   │   │
│  │  │  │  └──────────────────┘    │   │   │   │
│  │  │  └───────────────────────────┘   │   │   │
│  │  └──────────────────────────────────┘   │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppRouter.jsx    # Handles application routing
│   ├── ErrorBoundary.jsx # Error boundary wrapper
│   └── Layout.jsx       # Main layout with sidebar
│
├── context/             # State management
│   └── AppContext.jsx   # Global application state
│
├── pages/               # Page components (routes)
│   ├── LoginPage.jsx
│   ├── MarketDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── Portfolio.jsx
│   ├── DemoTrading.jsx
│   ├── CurrencyConverter.jsx
│   ├── Trading.jsx
│   ├── UserPayment.jsx
│   ├── Documents.jsx
│   ├── SettingsPage.jsx
│   └── LearningCenter.jsx
│
├── styles/              # CSS files
│   └── main.css         # Main stylesheet
│
├── App.jsx              # Root component
└── main.jsx             # Application entry point
```

## Component Architecture

### 1. App Component
- Root component that wraps entire application
- Provides ErrorBoundary and AppProvider
- Minimal logic, delegates to child components

### 2. ErrorBoundary
- Class component for error handling
- Catches JavaScript errors in component tree
- Displays fallback UI on error
- Prevents complete application crash

### 3. AppProvider (Context API)
- Centralized state management
- Provides global state to all components
- Handles authentication, portfolio, notifications
- Persists data to localStorage

### 4. AppRouter
- Manages application routing
- Renders correct page based on activeTab
- Protects admin routes
- Handles authentication redirects

### 5. Layout
- Provides consistent layout structure
- Includes sidebar navigation
- Mobile-responsive
- Role-based menu items

### 6. Page Components
- Self-contained page logic
- Access global state via useApp hook
- Handle page-specific operations
- Include validation and error handling

## State Management

### Context API Structure

```javascript
AppContext provides:
{
  // Authentication
  isLoggedIn: boolean,
  userRole: 'admin' | 'user',
  user: UserObject,
  handleLogin: (credentials, role) => void,
  handleLogout: () => void,

  // Navigation
  activeTab: string,
  setActiveTab: (tab) => void,
  sidebarOpen: boolean,
  setSidebarOpen: (open) => void,

  // Portfolio
  portfolio: Array<Stock>,
  updatePortfolio: (portfolio) => void,
  demoBalance: number,
  updateDemoBalance: (amount) => void,
  demoPortfolio: Array<Trade>,
  updateDemoPortfolio: (trade) => void,

  // Notifications
  notifications: Array<Notification>,
  addNotification: (type, message) => void
}
```

### State Flow

```
User Action → Component → Context Function → State Update → Re-render
```

Example:
```
Login Click → LoginPage → handleLogin() → setUser() → All components re-render
```

## Data Flow

### Authentication Flow
```
1. User enters credentials
2. LoginPage validates input
3. Calls handleLogin() from context
4. Context updates user state
5. Saves to localStorage
6. AppRouter redirects to dashboard
7. Layout shows user-specific menu
```

### Portfolio Update Flow
```
1. User adds stock in Portfolio page
2. Form validates input
3. Calls updatePortfolio() from context
4. Context updates portfolio state
5. MarketDashboard reflects changes
6. Portfolio page shows updated list
```

### Notification Flow
```
1. Component calls addNotification()
2. Context adds notification to array
3. Notification component renders
4. Auto-dismiss after 5 seconds
5. Context removes from array
```

## Component Communication

### Parent to Child
```javascript
// Props
<ChildComponent data={parentData} />
```

### Child to Parent
```javascript
// Callback props
<ChildComponent onAction={handleAction} />
```

### Cross-Component (via Context)
```javascript
// Any component
const { user, addNotification } = useApp();
```

## Error Handling Strategy

### Levels of Error Handling

1. **Component Level**
   - Try-catch blocks in async operations
   - Validation before state updates
   - User-friendly error messages

2. **Form Validation**
   - Input validation on all forms
   - Real-time feedback
   - Prevent invalid submissions

3. **Error Boundary**
   - Catches unhandled errors
   - Prevents app crash
   - Shows fallback UI

4. **Network Errors** (Future)
   - Retry logic
   - Timeout handling
   - Offline detection

## Styling Architecture

### CSS Organization

```css
main.css structure:
├── Global Styles (reset, typography)
├── Layout System (grid, flexbox)
├── Components (cards, buttons, forms)
├── Utilities (spacing, colors)
└── Responsive (media queries)
```

### Naming Convention
- BEM-inspired naming
- Semantic class names
- Utility-first for common patterns

### Responsive Strategy
- Mobile-first approach
- Breakpoints: 768px, 1024px
- Flexible grid system
- Touch-friendly UI

## Security Considerations

### Input Validation
- All forms validate inputs
- Regex for email validation
- Numeric validation for amounts
- Length checks for passwords

### XSS Prevention
- React escapes by default
- No dangerouslySetInnerHTML
- Sanitized user inputs

### Authentication
- Role-based access control
- Protected routes
- Session persistence
- Secure logout

## Performance Optimizations

### Current
- Context API prevents prop drilling
- Minimal re-renders
- CSS external to JS
- Efficient event handlers

### Future Opportunities
- React.memo() for expensive components
- Code splitting with React.lazy()
- Virtual scrolling for large lists
- Image optimization
- Service workers

## Testing Strategy (Recommended)

### Unit Tests
- Context functions
- Validation logic
- Utility functions

### Integration Tests
- Component interactions
- Context provider
- Form submissions

### E2E Tests
- Complete user flows
- Authentication
- Trading operations
- Portfolio management

## Deployment

### Build Process
```bash
npm run build
# Creates optimized production build in /dist
```

### Deployment Options
- Netlify (recommended)
- Vercel
- GitHub Pages
- Traditional hosting

### Environment Variables
```
VITE_API_URL=your_api_url
VITE_ENV=production
```

## Future Architecture Plans

### Planned Improvements
1. TypeScript migration
2. React Router for routing
3. API layer abstraction
4. WebSocket integration
5. State persistence service
6. Unit test suite
7. Storybook for components
8. Performance monitoring

### Scalability
- Current architecture supports:
  - 50+ components
  - 10+ pages
  - Multiple user roles
  - Growing feature set

## Best Practices

### Component Design
- Single Responsibility Principle
- Functional components with hooks
- Props validation
- Clear naming conventions

### State Management
- Global state for shared data
- Local state for component-specific
- Avoid prop drilling
- Minimal state duplication

### Code Quality
- Consistent formatting
- Meaningful comments
- DRY principle
- Error handling

## Conclusion

This architecture provides:
- ✅ Maintainable codebase
- ✅ Scalable structure
- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Developer-friendly
- ✅ Production-ready

---

For questions or clarifications, please open an issue on GitHub.
