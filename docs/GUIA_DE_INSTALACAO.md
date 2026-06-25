# Guia de Instalação - ReserveAí

Este documento descreve como executar o **ReserveAí** em ambiente local, tanto com **Docker Compose** quanto em modo manual, separando frontend e backend.

## 1. Pré-requisitos

| Item | Versão sugerida |
|---|---|
| Node.js | 22.x |
| npm | 10.x ou superior |
| pnpm | 9.x ou superior |
| MySQL | 8.x |
| Docker | versão recente |
| Docker Compose | versão recente |

## 2. Execução com Docker

No diretório raiz do projeto, execute:

```bash
docker compose up --build
```

Após a inicialização, os serviços esperados são:

| Serviço | URL padrão |
|---|---|
| Frontend | http://localhost:8080 |
| Backend | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |

## 3. Execução manual do backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Copie o ambiente de exemplo:

```bash
cp .env.example .env
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Compile o projeto:

```bash
npm run build
```

Execute em desenvolvimento:

```bash
npm run dev
```

## 4. Execução manual do frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
pnpm install
```

Execute em desenvolvimento:

```bash
pnpm dev
```

Compile para produção:

```bash
pnpm build
```

## 5. Testes

No backend, execute:

```bash
npm test -- --runInBand
```

## 6. Observações importantes

> O ambiente atual já foi validado com compilação de backend e frontend. A validação sintática do Docker Compose não pôde ser executada neste ambiente porque o binário do Docker não estava disponível na sandbox.

Caso deseje executar o projeto em seu computador, recomenda-se validar localmente os contêineres com `docker compose config` e depois subir a stack completa com `docker compose up --build`.
