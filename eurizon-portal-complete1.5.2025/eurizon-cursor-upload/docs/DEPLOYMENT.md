# Deployment Guide

Complete guide for deploying Eurizon Investment Portal to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Deployment Platforms](#deployment-platforms)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
  - [GitHub Pages](#github-pages)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:
- Node.js 16+ installed
- Git repository set up
- Production build tested locally
- Environment variables configured

---

## Building for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Production Build
```bash
npm run build
```

This creates an optimized build in the `/dist` directory.

### 3. Test Production Build Locally
```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### 4. Verify Build
Check that `/dist` contains:
- `index.html`
- `assets/` folder with JS and CSS files
- All static assets

---

## Deployment Platforms

### Netlify

**Recommended for quick deployment**

#### Method 1: Drag and Drop
1. Build the project: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `/dist` folder onto the page
4. Your site is live!

#### Method 2: Git Integration (Recommended)
1. Push code to GitHub
2. Log in to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Click "Deploy site"

#### Netlify Configuration File
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Vercel

**Great for React applications**

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Method 2: Git Integration
1. Push code to GitHub
2. Log in to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite
6. Click "Deploy"

#### Vercel Configuration
Create `vercel.json` in root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### GitHub Pages

**Free hosting for GitHub projects**

#### Steps:
1. Install gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/eurizon-portal",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/eurizon-portal/'
})
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages
   - Select `gh-pages` branch
   - Save

---

## Environment Variables

### For Development
Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Eurizon Portal
```

### For Production

#### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables:
   - `VITE_API_URL`
   - `VITE_APP_NAME`

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, Development

#### GitHub Pages
- Add to repository Secrets
- Access via GitHub Actions

### Using Environment Variables
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Custom Domain Setup

### Netlify
1. Go to Domain Settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. HTTPS is automatic

### GitHub Pages
1. Go to repository Settings → Pages
2. Add custom domain
3. Update DNS with CNAME record:
   ```
   CNAME → yourusername.github.io
   ```
4. Enable "Enforce HTTPS"

---

## Post-Deployment

### Verification Checklist
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Login functionality works
- [ ] Portfolio operations work
- [ ] Trading functions properly
- [ ] Currency converter functional
- [ ] Admin dashboard (if admin)
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors

### Performance Optimization
```bash
# Analyze bundle size
npm run build -- --mode production

# Use Lighthouse for auditing
# Chrome DevTools → Lighthouse
```

### Monitoring
Consider adding:
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

---

## Continuous Deployment

### Automatic Deployments
Both Netlify and Vercel support automatic deployments:
- Push to `main` → Production deployment
- Push to `develop` → Preview deployment
- Pull request → Deploy preview

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 Errors on Refresh
- Ensure SPA redirect rules are configured
- Netlify: Use `_redirects` or `netlify.toml`
- Vercel: Auto-handled
- GitHub Pages: May need hash routing

### Assets Not Loading
- Check `base` in `vite.config.js`
- Verify paths are relative
- Check browser console for errors

### Slow Performance
- Enable compression (Gzip/Brotli)
- Use CDN for assets
- Optimize images
- Enable caching headers

---

## Rollback Procedure

### Netlify
1. Go to Deploys
2. Click on previous successful deploy
3. Click "Publish deploy"

### Vercel
1. Go to Deployments
2. Select previous deployment
3. Click "Promote to Production"

### GitHub Pages
```bash
git revert HEAD
git push origin main
```

---

## Security Headers

Add security headers in platform config:

### Netlify (`netlify.toml`)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Vercel (`vercel.json`)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**Need help? Open an issue on GitHub!**
