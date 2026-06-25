# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY patches ./patches

# Instalar PNPM
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage - usar Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copiar configuração Nginx customizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist/public/ /usr/share/nginx/html/

# Criar diretório para logs
RUN mkdir -p /var/log/nginx

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
