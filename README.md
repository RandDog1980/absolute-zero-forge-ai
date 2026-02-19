# Absolute Zero Forge AI

Production-ready React + TypeScript application built with Vite and Tailwind CSS.

## Quick start

```bash
git clone <your-repository-url>
cd absolute-zero-forge-ai
npm install
npm run dev
```

App URL: `http://localhost:5173`

## Prerequisites

- Node.js 20+
- npm 10+

## Build and run in production mode

```bash
npm run build
npm run start
```

Preview URL: `http://localhost:4173`

## Quality checks

```bash
npm run lint
npm run typecheck
npm run check
```

## Docker (recommended for deployment)

```bash
docker build -t absolute-zero-forge-ai:latest .
docker run --rm -p 8080:80 absolute-zero-forge-ai:latest
```

URL: `http://localhost:8080`

### Docker Compose

```bash
docker compose up --build -d
```

## Create a downloadable release archive

You can generate a release tarball from the current commit:

```bash
./scripts/create-release.sh
```

This creates `releases/absolute-zero-forge-ai-<version>.tar.gz`.

## Troubleshooting

- If dependency install fails due peer conflicts, this project sets `legacy-peer-deps=true` in `.npmrc`.
- If your environment blocks `registry.npmjs.org`, configure your internal npm registry and proxy before running `npm install`.

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI + shadcn/ui patterns
