# Setup Guide

Complete setup instructions for Eurizon Investment Portal.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
  - Download: https://nodejs.org/
  - Check version: `node --version`

- **npm** (comes with Node.js) or **yarn**
  - Check version: `npm --version`

- **Git** (for cloning repository)
  - Download: https://git-scm.com/
  - Check version: `git --version`

- **Code Editor** (recommended: VS Code)
  - Download: https://code.visualstudio.com/

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eurizon-portal.git
cd eurizon-portal
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` in your web browser.

## 🎮 First Run

### Demo Login

When you first open the application:

1. You'll see the login page
2. Click **"Admin Demo"** for admin access
3. Or click **"User Demo"** for standard user access
4. Or enter any email and password (minimum 6 characters)

### Explore Features

- **Dashboard**: View market overview and statistics
- **Portfolio**: Add stocks and track performance
- **Demo Trading**: Practice trading with $100,000 virtual money
- **Currency Converter**: Convert between 10 major currencies
- **Admin Dashboard**: Manage users (admin only)

## 📁 Project Structure

After cloning, you'll have:

```
eurizon-portal/
├── .github/              # GitHub Actions workflows
├── docs/                 # Documentation
├── src/                  # Source code
│   ├── components/       # React components
│   ├── context/          # State management
│   ├── pages/            # Page components
│   └── styles/           # CSS files
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # MIT License
├── README.md             # Main documentation
├── SETUP.md              # This file
├── index.html            # HTML template
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (when ESLint is configured)
npm run lint

# Format code (when Prettier is configured)
npm run format
```

### Development Server Features

- **Hot Module Replacement (HMR)**: Changes reflect instantly
- **Fast Refresh**: Preserves component state during edits
- **Error Overlay**: Shows errors in browser
- **Port**: Default 5173 (configurable)

### Making Changes

1. Open project in your code editor
2. Navigate to `src/` folder
3. Edit files (changes auto-reload)
4. Check browser for updates

### Adding New Features

#### Add a New Page

1. Create file in `src/pages/`
   ```javascript
   // src/pages/MyNewPage.jsx
   const MyNewPage = () => {
     return <div>My New Page</div>;
   };
   export default MyNewPage;
   ```

2. Import in `AppRouter.jsx`
   ```javascript
   import MyNewPage from '../pages/MyNewPage';
   ```

3. Add route case
   ```javascript
   case 'mynewpage':
     return <MyNewPage />;
   ```

4. Add to navigation in `Layout.jsx`

#### Add Component

1. Create in `src/components/`
   ```javascript
   // src/components/MyComponent.jsx
   const MyComponent = ({ prop1, prop2 }) => {
     return <div>{prop1}</div>;
   };
   export default MyComponent;
   ```

2. Import where needed
   ```javascript
   import MyComponent from '../components/MyComponent';
   ```

## 🎨 Customization

### Styling

All styles are in `src/styles/main.css`. Modify:

- **Colors**: Search for color values
- **Spacing**: Update utility classes
- **Components**: Modify component styles

### Branding

Update in multiple files:

1. **Logo**: `src/pages/LoginPage.jsx` - Update logo element
2. **Title**: `index.html` - Change `<title>` tag
3. **Colors**: `src/styles/main.css` - Update color scheme
4. **Name**: Throughout application

## 🔧 Configuration

### Vite Configuration

Edit `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Change port
    open: true,        // Auto-open browser
  },
  build: {
    outDir: 'dist',    // Output directory
  }
})
```

### Environment Variables

Create `.env` file in root:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Eurizon Portal
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Check Node version (requires 16+)
node --version

# Update dependencies
npm update

# Try clean build
rm -rf dist
npm run build
```

### Hot Reload Not Working

```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

### Browser Issues

- **Clear cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- **Try incognito**: Rules out extension conflicts
- **Check console**: Look for JavaScript errors
- **Update browser**: Use latest version

## 📦 Installing Additional Packages

### UI Libraries

```bash
# Tailwind CSS (if needed)
npm install -D tailwindcss postcss autoprefixer

# React Router (for routing)
npm install react-router-dom

# State Management (if expanding)
npm install zustand
# or
npm install redux @reduxjs/toolkit
```

### Utilities

```bash
# Date handling
npm install date-fns

# HTTP requests
npm install axios

# Form validation
npm install react-hook-form

# Icons (more)
npm install react-icons
```

## 🧪 Testing Setup (Optional)

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"scripts": {
  "test": "vitest"
}

# Run tests
npm test
```

## 🚀 Production Build

### Build

```bash
npm run build
```

Creates optimized files in `/dist` folder.

### Test Production Build

```bash
npm run preview
```

Serves production build locally at `http://localhost:4173`

### Deploy

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Learning Resources

### React
- [React Docs](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)
- [Vite Config](https://vitejs.dev/config/)

### JavaScript
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

## 🆘 Getting Help

### Documentation
1. Read [README.md](README.md)
2. Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. Review [CONTRIBUTING.md](CONTRIBUTING.md)

### Community
1. Open an [issue](https://github.com/yourusername/eurizon-portal/issues)
2. Check existing issues
3. Ask in discussions

### Code Examples

Look at existing code:
- `src/pages/Portfolio.jsx` - Form handling
- `src/context/AppContext.jsx` - State management
- `src/components/Layout.jsx` - Component structure

## ✅ Checklist

Before starting development:

- [ ] Node.js 16+ installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Application opens in browser
- [ ] Can log in with demo credentials
- [ ] Code editor set up

## 🎓 Next Steps

1. **Explore the code** - Understand project structure
2. **Try features** - Use portfolio, trading, converter
3. **Make changes** - Edit a component and see it update
4. **Read docs** - Review architecture documentation
5. **Build something** - Add your own feature
6. **Deploy** - Put it online!

## 💡 Tips

- **Save often**: Changes auto-reload
- **Use console**: Check for errors
- **Read errors**: They usually tell you what's wrong
- **Git commits**: Commit working code frequently
- **Backup**: Push to GitHub regularly

---

**Ready to build? Run `npm run dev` and start coding! 🚀**

For questions, see [README.md](README.md) or open an issue.
