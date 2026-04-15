# Report Platform

MVP for asynchronous report generation with backend + frontend applications in a pnpm workspace.

## Stack

- `NestJS`
- `TypeORM`
- `PostgreSQL`
- `Vitest`
- `React`
- `Vite`
- `Playwright`
- `exceljs`
- `pdfkit`
- `pnpm` workspaces

## Workspace

```text
apps/api
apps/web
packages/shared
```

## Local Commands

```bash
pnpm install
pnpm build
pnpm test
```

Run API and worker locally:

```bash
pnpm dev:api
pnpm dev:worker
```

Run frontend locally:

```bash
pnpm dev:web
```

Run everything with one command:

```bash
pnpm dev:start
```

Stop all docker services:

```bash
pnpm dev:stop
```

Build app + docker images in one command:

```bash
pnpm build:full
```

Database helpers:

```bash
pnpm db:migrate
pnpm db:seed
```

Frontend URL:

- Web: `http://localhost:5173`

## Docker Compose

```bash
docker compose up --build
```

Services:

- Init (one-shot migrations + seed): `report-platform-init-1`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

## Demo Flow

List reports:

```bash
curl http://localhost:3000/api/reports
```

Create a report run:

```bash
curl -X POST http://localhost:3000/api/report-runs \
  -H "Content-Type: application/json" \
  -d "{\"reportId\":\"driver-medical-checks\",\"params\":{\"from\":\"2026-04-01\",\"to\":\"2026-04-13\"}}"
```

Check status:

```bash
curl http://localhost:3000/api/report-runs/<runId>
```

Download artifact:

```bash
curl -OJ http://localhost:3000/api/report-runs/<runId>/download
```

## Reports

- `driver-medical-checks` -> XLSX row-level export
- `company-summary` -> PDF aggregate report

## Notes

- Report artifacts are stored in a local/shared volume under `storage/reports`.
- Production-oriented limitations and extension points are documented in [ARCHITECTURE.md](ARCHITECTURE.md).
