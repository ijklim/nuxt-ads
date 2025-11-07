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

