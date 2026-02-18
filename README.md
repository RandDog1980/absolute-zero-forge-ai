# Absolute Zero Forge AI

Production-ready React + TypeScript dashboard application built with Vite and Tailwind CSS.

## Prerequisites

- Node.js 20+
- npm 10+

## Local installation

```bash
git clone <your-repository-url>
cd absolute-zero-forge-ai
npm install
```

## Development

```bash
npm run dev
```

The app runs by default at `http://localhost:5173`.

## Production build

```bash
npm run build
```

Build output is generated in `dist/`.

## Local production preview

```bash
npm run start
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run check
```

## Docker deployment

Build image:

```bash
docker build -t absolute-zero-forge-ai:latest .
```

Run container:

```bash
docker run --rm -p 8080:80 absolute-zero-forge-ai:latest
```

Then open `http://localhost:8080`.

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI + shadcn/ui patterns
