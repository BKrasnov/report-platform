FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @report-platform/shared build
RUN pnpm --filter @report-platform/api build

CMD ["pnpm", "--filter", "@report-platform/api", "start:prod"]
