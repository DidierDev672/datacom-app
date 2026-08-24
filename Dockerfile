# Build context: carpeta datacom-app (package.json + quasar.conf.js)
#   cd datacom-app && docker compose build --no-cache frontend
#
# Salida: dist/spa/
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY quasar.conf.js babel.config.js jsconfig.json ./
# Quasar PostCSS config (autoprefixer). Generated here so the image build does not
# depend on a dotfile being present in the build context (e.g. fresh clone / CI).
RUN printf '%s\n' \
  'module.exports = {' \
  '  plugins: [require("autoprefixer")]' \
  '}' > .postcssrc.js
COPY .eslintrc.js .eslintignore ./
COPY .env.production ./
COPY public ./public/
COPY src ./src/
COPY src-pwa ./src-pwa/

ARG VUE_APP_API_BASE_URL=
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
ENV NODE_ENV=production

# Falla si quasar.conf aun registra lint en webpack (capas cacheadas)
RUN grep -E 'ESLintPlugin|eslint-webpack-plugin' quasar.conf.js \
  && (echo 'ERROR: quasar.conf.js aun tiene ESLint en webpack' && exit 1) \
  || true

RUN ./node_modules/.bin/quasar build -m spa

FROM nginx:stable-alpine

# Evitar conflicto con plantillas del entrypoint (conf.d) que rompen "server"/"upstream"
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/templates/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
