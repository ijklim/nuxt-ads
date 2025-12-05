# Ad App

[![Dependabot Status](https://img.shields.io/badge/Dependabot-enabled-success?logo=dependabot&logoColor=white)](https://github.com/ijklim/nuxt-ads/network/updates)

A Nuxt-based ad server that displays randomized advertisements from a backend API. This application:

- Fetches ads dynamically from a Laravel backend API
- Displays ads in multiple formats: Google AdSense, Amazon banners, and image-based ads
- Provides a reusable `ads.js` embed script that websites can include via a simple `<script>` tag
- Auto-resizes iframes based on content dimensions while maintaining aspect ratio
- Supports responsive sizing to adapt to container width
- Offers optional shuffle functionality for testing

**Key Features:**
- Lightweight embeddable script for third-party sites
- Automatic dimension calculation based on image aspect ratio
- Dynamic ad rotation with configurable parameters
- Cross-origin iframe communication via postMessage
- Production-ready Nuxt 4 setup

---

## 🎯 Technical Highlights

**Architecture & Design Patterns:**
- **Type-Safe Development** - Full TypeScript implementation across Vue components and server-side code
- **Component-Based Architecture** - Reusable Vue 3 components with strict interface contracts (IAmazonAdObject, IGoogleAdObject, IImageAdObject)
- **Reactive State Management** - Vue 3 Composition API with reactive stores and computed properties
- **Error Handling** - Comprehensive error boundary implementation with graceful fallbacks

**Frontend Technologies:**
- **Vue 3 + Nuxt 4** - Modern SSR-capable framework with auto-imports and file-based routing
- **Server-Side Rendering (SSR)** - SEO-friendly dynamic rendering with static generation support
- **Responsive Design** - CSS Grid/Flexbox with container queries for adaptive layouts
- **Cross-Origin Communication** - Iframe resizing via postMessage API with origin validation

**Backend Integration:**
- **RESTful API Consumption** - Structured API calls with $fetch composable and proper error handling
- **Data Normalization** - API response validation with TypeScript interfaces
- **Query String Management** - Dynamic parameter passing and URL encoding

**DevOps & CI/CD:**
- **Automated Testing & Quality Gates** - Vitest unit tests (13+ tests) run on every PR with automatic blocking if tests fail
- **Continuous Integration** - GitHub Actions workflows enforce code quality with mandatory test passage before merge
- **Test Automation** - Unit tests verify component functionality, state management, and API integration
- **Static Site Generation** - Nuxt generate for serverless deployment (CDN-friendly)
- **Environment Configuration** - Runtime-config management via GitHub Secrets (no hardcoded values)
- **SSH Deployment** - Automated SCP-based file transfer to shared hosting with pre-deployment testing

**Security & Best Practices:**
- **CORS Middleware** - Proper cross-origin request handling with configurable headers
- **XSS Prevention** - Content sanitization and trusted origin validation
- **Secret Management** - GitHub Secrets for sensitive credentials (never committed to repo)
- **Access Control** - postMessage origin verification for iframe communication

---

## Prerequisites

- **Node.js** 18+ or 20+ (check with `node --version`)
- **pnpm** 9.0+ (install with `npm install -g pnpm`)
- **Git** for version control
- **SSH access** (for deployment to shared hosting)

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Google AdSense Publisher ID (if applicable)
NUXT_PUBLIC_AD_CLIENT=ca-pub-0000000000000000

# Backend API URL for fetching ads
NUXT_PUBLIC_ADS_SERVER=https://your-ads-api.com
```

**For Local Development:**
```bash
cp .env.example .env
```

**For GitHub Actions Deployment:**
Since the app uses static generation (`pnpm generate`), environment variables must be set **at build time**. The GitHub Actions workflow creates a `.env` file from GitHub Secrets before generating the static site.

Add these secrets to your GitHub repository:
- `Settings` > `Secrets and variables` > `Actions` > `New repository secret`
  - `NUXT_PUBLIC_AD_CLIENT`: Your Google AdSense Publisher ID
  - `NUXT_PUBLIC_ADS_SERVER`: Your ads API URL

Once set, the values are baked into the static HTML during deployment. **To change values, update the secrets and trigger a new deployment.**

**Important:** Do NOT manually create `.env` on shared hosting servers. The environment variables must be provided during the build phase via GitHub Secrets.

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start the development server (http://localhost:8810)
pnpm dev

# Generate static site for static hosting (GitHub Pages, shared hosting, CDN)
# Pre-renders all routes to static HTML files
pnpm generate

# Build for Node.js server deployment (Vercel, Heroku, etc.)
# Creates server and client code, requires Node.js runtime
pnpm build

# Locally preview production build
pnpm preview

# Audit for security vulnerabilities in dependencies
pnpm audit

# Fix security vulnerabilities (auto-fix what's possible)
pnpm audit --fix

# Update packages interactively to their newest versions
pnpm update --interactive --latest
```

---

## Deployment

### GitHub Actions Auto Deploy to Shared Hosting

#### Required Secrets

In your repository, go to `Settings` > `Secrets and variables` > `Actions` > `Repository secrets`:

**Nuxt Build Configuration:**
- `NUXT_PUBLIC_ADS_SERVER`: Backend API URL for fetching ads (e.g., `https://api.example.com`)
- `NUXT_PUBLIC_AD_CLIENT`: Google AdSense Publisher ID (e.g., `ca-pub-0000000000000000`)

**SSH Deployment Credentials:**
- `SSH_HOST`: Server hostname/IP
- `SSH_USERNAME`: Your SSH username
- `SSH_KEY`: Your private SSH key content (the entire key including headers)
- `SSH_PORT`: SSH port number (default is 22)
- `SSH_DEPLOY_PATH`: Path on host to copy files to

#### How It Works

The GitHub Actions workflow (`.github/workflows/ssh-deploy.yml`) automatically:
1. Creates a `.env` file from these secrets before build
2. Runs `pnpm generate` to build the static site with environment variables embedded
3. Deploys the generated files to your server via SCP

#### Trigger Deployment

- **Automatic**: Every push to the `main` branch
- **Manual**: Go to `Actions` tab and click "Run workflow"
