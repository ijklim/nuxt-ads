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

**Important:** On shared hosting servers, you **must manually create the `.env` file** since it's not included in version control for security reasons. Contact your hosting provider or use their file manager to:

1. Create a new file named `.env` in the root directory
2. Add the required environment variables
3. Ensure the file has appropriate permissions (readable by the application)

For local development, you can copy from `.env.example` if available:
```bash
cp .env.example .env
```

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


## === GitHub Action Auto Deploy to Shared Hosting Server ===

* Ensure these secret names match the variables referenced in `.github/workflows/ssh-deploy.yml`

* In the repository, go to `Settings` > `Secrets and variables` > `Actions` > `Repository secrets` > `New repository secret`

  * SSH_HOST: Server hostname/IP

  * SSH_USERNAME: Your SSH username

  * SSH_KEY: Your private SSH key content (the entire key including headers)

  * SSH_PORT: SSH port number (default is 22)

  * SSH_DEPLOY_PATH: Path on host to copy files

* Create GitHub action file (e.g. `.github/workflows/ssh-deploy.yml`)



