# Report Platform

MVP-платформа для асинхронной генерации отчетов. Проект организован как `pnpm` workspace с backend, frontend и общим пакетом типов/схем.

## Технологии

- `NestJS` + `TypeORM`
- `PostgreSQL`
- `React` + `Vite`
- `Vitest` + `Playwright`
- Генерация артефактов: `exceljs`, `pdfkit`

## Структура репозитория

```text
apps/api        # backend API + worker
apps/web        # frontend
packages/shared # общие типы, константы и схемы
```

## Требования

- `Node.js` 20+
- `pnpm` 9+
- `Docker` + `Docker Compose` (для запуска через контейнеры)

## Быстрый старт

1. Установить зависимости:

```bash
pnpm install
```

2. Запустить backend (PostgreSQL + init + API + worker) и frontend одной командой:

```bash
pnpm dev:start
```

После запуска:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5173/api`

Остановка контейнеров:

```bash
pnpm dev:stop
```

## Работа с базой данных

Применить миграции:

```bash
pnpm db:migrate
```

Заполнить тестовыми данными:

```bash
pnpm db:seed
```

## Полезные команды

Сборка всех пакетов:

```bash
pnpm build
```

Полная сборка проекта + docker-образов:

```bash
pnpm build:full
```

Линтинг:

```bash
pnpm lint
```

Тесты:

```bash
pnpm test
pnpm test:web
pnpm test:e2e:web
```

## Docker Compose

Запуск:

```bash
docker compose up --build
```

Сервисы:

- `postgres` — база данных
- `init` — одноразовый контейнер (миграции + сидирование)
- `api` — HTTP API (`127.0.0.1:3000`)
- `worker` — обработка очереди отчетов

## Пример API-флоу

Получить список доступных отчетов:

```bash
curl http://localhost:3000/api/reports
```

Создать запуск отчета:

```bash
curl -X POST http://localhost:3000/api/report-runs \
  -H "Content-Type: application/json" \
  -d "{\"reportId\":\"driver-medical-checks\",\"params\":{\"from\":\"2026-04-01\",\"to\":\"2026-04-13\"}}"
```

Проверить статус:

```bash
curl http://localhost:3000/api/report-runs/<runId>
```

Скачать артефакт:

```bash
curl -OJ http://localhost:3000/api/report-runs/<runId>/download
```

## Поддерживаемые отчеты

- `driver-medical-checks` — детальный XLSX по медосмотрам водителей
- `company-summary` — агрегированный PDF по компании

## Дополнительно

- Артефакты отчетов сохраняются в `storage/reports` (или в docker volume `report_artifacts`).
- Ограничения текущего MVP и направления развития описаны в [ARCHITECTURE.md](ARCHITECTURE.md).
