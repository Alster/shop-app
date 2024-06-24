# Base node image:
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Installing dev dependencies:
FROM base AS install-dev-dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,sharing=locked,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Installing prod dependencies:
FROM base AS install-prod-dependencies
ENV NODE_ENV production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,sharing=locked,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Creating a build:
FROM base AS create-build
ENV NODE_ENV production
WORKDIR /app
COPY . .
COPY --from=install-dev-dependencies /app ./
RUN yarn run build
USER node

# Running the application:
FROM base AS run
ENV NODE_ENV production
WORKDIR /app
COPY --from=create-build /app/build ./
COPY --from=install-prod-dependencies /app/node_modules ./node_modules

CMD ["yarn", "start"]

