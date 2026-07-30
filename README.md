# Practicum Site

Next.js 16 site with an embedded Sanity Studio. The public site uses the App Router under `app/`; the CMS is available locally at `/studio`.

## Tech Stack

- Next.js `16.2.10`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- Sanity `5`
- npm lockfile workflow
- Optional Docker development environment

## Prerequisites

- Node.js 22.x recommended. The Docker image uses `node:22-alpine`.
- npm. Use the committed `package-lock.json` instead of switching package managers.
- Access to the Sanity project used by this site. Studio editing requires a Sanity account with access to the configured project and dataset.

## Environment Setup

Create a local environment file from the example:

```bash
cp .env.example .env
```

Fill in the Sanity values:

```bash
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
```

Both values are required. The app reads them in `sanity/env.ts`, and startup fails if either is missing.

Optional:

```bash
NEXT_PUBLIC_SANITY_API_VERSION="2026-07-07"
```

If this is not set, the project defaults to `2026-07-07`.

## Install

Install dependencies with the lockfile:

```bash
npm ci
```

Use `npm install <package>` only when intentionally adding or updating dependencies.

## Local Development

Start the development server:

```bash
npm run dev
```

Open:

- Site: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

The Studio uses the same Sanity project and dataset from `.env`.

## Available Scripts

```bash
npm run dev
```

Runs the Next.js development server.

```bash
npm run build
```

Creates a production build. Run this before deployment-oriented changes.

```bash
npm run start
```

Runs the production server after `npm run build`.

```bash
npm run lint
```

Runs ESLint.

## Docker Development

You can run the project in Docker if you do not want to use a local Node install:

```bash
docker compose up --build
```

This reads `.env`, mounts the project into the container, and serves the app on `http://localhost:3000`.

Stop the container with:

```bash
docker compose down
```

## Project Structure

```text
app/
  layout.tsx              Root layout and global font setup
  page.tsx                Home page
  globals.css             Global styles
  studio/[[...tool]]/     Embedded Sanity Studio route

sanity/
  env.ts                  Sanity environment validation
  lib/                    Sanity client, live preview, and image helpers
  schemaTypes/            Sanity schema definitions
  structure.ts            Studio desk structure

sanity.config.ts          Studio configuration
sanity.cli.ts             Sanity CLI configuration
next.config.ts            Next.js configuration
Dockerfile                Development container image
docker-compose.yml        Docker Compose development setup
```

## Working With Sanity

Add or edit content schemas in `sanity/schemaTypes/`, then export them from `sanity/schemaTypes/index.ts`.

The Studio includes:

- Structure tool for editing content.
- Vision tool for running GROQ queries inside Studio.

Keep schema changes versioned with the application code so future developers can reproduce the Studio locally.

### Project filter taxonomy

Project documents have three distinct filter fields. Keep them separate in Studio so the Projects page remains easy to browse:

- **Tech Stack**: technologies and platforms, such as React, Next.js, FastAPI, or AWS.
- **Semester**: one value in the format `Fall 2025`, `Spring 2026`, `Summer 2026`, or `Winter 2026`.
- **Other Tags**: project domains or capabilities, such as Video Management, Academic Publishing, Scheduling, or Workflow Automation.

The Projects page exposes these as **Tech Stack**, **Semester**, and **Other** filters. It also recognizes old semester-formatted tags so existing content continues to filter correctly, but new and edited projects should use the dedicated Semester field.

## Development Notes

- This project uses the Next.js App Router. Routes, layouts, and pages belong under `app/`.
- This repo includes local Next.js documentation in `node_modules/next/dist/docs/`. Check those docs before changing Next-specific APIs or conventions because this version may differ from older examples.
- Keep secrets out of git. Only commit `.env.example`; use `.env` for local values.
- Prefer small, focused changes and run `npm run lint` plus `npm run build` before opening a PR or deploying.

## Troubleshooting

If the app fails with a missing Sanity variable error, confirm `.env` exists and includes both `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.

If dependencies behave strangely, remove generated install artifacts and reinstall from the lockfile:

```bash
rm -rf node_modules .next
npm ci
```

If Docker does not pick up environment changes, restart the container:

```bash
docker compose down
docker compose up --build
```
