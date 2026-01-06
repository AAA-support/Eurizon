# Contributing to Eurizon Investment Portal

Thank you for considering contributing to the Eurizon Investment Portal! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/environment details

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:
- Clear description of the enhancement
- Use cases and benefits
- Potential implementation approach
- Any relevant examples

### Pull Requests

1. **Fork the repository**
   ```bash
   git fork https://github.com/yourusername/eurizon-portal.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run dev
   # Test all affected features
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure all checks pass

## 📝 Code Style Guidelines

### React Components
```javascript
// Use functional components with hooks
import React, { useState } from 'react';

const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  return (
    <div className="component-class">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### File Naming
- Components: `PascalCase.jsx` (e.g., `LoginPage.jsx`)
- Utilities: `camelCase.js` (e.g., `formatCurrency.js`)
- Styles: `kebab-case.css` (e.g., `main-styles.css`)

### CSS Classes
- Use descriptive class names
- Follow existing naming conventions
- Prefer reusable utility classes

### State Management
- Use Context API for global state
- Keep component state local when possible
- Document state structure

## 🧪 Testing Guidelines

Before submitting a PR, test:
- ✅ All authentication flows
- ✅ Portfolio operations
- ✅ Trading functionality
- ✅ Currency conversion
- ✅ Admin features
- ✅ Form validation
- ✅ Responsive design
- ✅ Error handling

## 📁 Project Structure

When adding new files, follow this structure:
```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── context/        # Context API providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── styles/         # CSS files
```

## 🎨 Design Guidelines

- Maintain consistent color scheme (gray/blue theme)
- Ensure responsive design (mobile-first)
- Follow existing spacing and layout patterns
- Use Lucide React for icons
- Keep accessibility in mind (ARIA labels, keyboard navigation)

## 📚 Documentation

When adding features:
- Update README.md if needed
- Add code comments for complex logic
- Document new Context API functions
- Update relevant documentation files

## ⚡ Performance Considerations

- Avoid unnecessary re-renders
- Use React.memo() for expensive components
- Keep bundle size in mind
- Optimize images and assets

## 🔒 Security

- Validate all user inputs
- Sanitize data before display
- Never commit sensitive data
- Follow security best practices

## 📋 Checklist Before PR

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Forms have proper validation
- [ ] Accessibility maintained
- [ ] Git history is clean

## 🤔 Questions?

If you have questions about contributing:
- Check existing issues and PRs
- Review the codebase
- Open a discussion issue

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Eurizon Investment Portal! 🎉**
