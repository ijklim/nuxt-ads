# Ad App

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
- Production-ready Nuxt 3 setup


## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Google AdSense Publisher ID (if applicable)
NUXT_PUBLIC_AD_CLIENT=ca-pub-0000000000000000

# Backend API URL for fetching ads
NUXT_PUBLIC_ADS_SERVER=https://your-ads-api.com
```

**For Local Development:**
Copy from `.env.example`:
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


## Commands

```bash
# Nuxt project creation
npx nuxi init timer-nuxt

# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for Node.js server deployment (Vercel, Heroku, etc.)
# Creates server and client code, requires Node.js runtime
pnpm build

# Generate static site for static hosting (GitHub Pages, shared hosting, CDN)
# Pre-renders all routes to static HTML files
# Use this for deployment to shared hosting via SCP/FTP
pnpm generate

# Locally preview production build
pnpm preview

# Audit for security vulnerabilities in dependencies
pnpm audit

# Fix security vulnerabilities (auto-fix what's possible)
pnpm audit --fix

# Choose packages to update interactively to their newest versions
pnpm update --interactive --latest
```


## GitHub Action Auto Deploy to Shared Hosting Server

### Required Secrets

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

The GitHub Actions workflow (`.github/workflows/ssh-deploy.yml`) automatically:
1. Creates a `.env` file from these secrets before build
2. Runs `pnpm generate` to build the static site with environment variables embedded
3. Deploys the generated files to your server via SCP



