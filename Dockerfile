# Production-ready image for running the Playwright suite in CI or on-demand.
# Pin to the same Playwright version as package.json for browser/runtime parity.
FROM mcr.microsoft.com/playwright:v1.48.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Browsers are already preinstalled in the base image; this is a no-op
# safety net in case package.json bumps the Playwright version.
RUN npx playwright install --with-deps

ENV CI=true

ENTRYPOINT ["npx", "playwright", "test"]
