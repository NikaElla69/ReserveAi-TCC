# ReserveAí - Entrega Completa

O **ReserveAí** é uma plataforma de reservas para restaurantes com backend em **Node.js + Express + Prisma ORM + MySQL** e frontend em **React + Vite + Tailwind CSS**, incluindo autenticação, gestão de usuários, restaurantes, mesas, reservas e base para personalização **White Label**.

## Estrutura do projeto

```text
ReserveAi-Final/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Como executar com Docker

1. Copie o arquivo `.env.example` conforme necessário.
2. No diretório raiz, execute:

```bash
docker compose up --build
```

3. A aplicação ficará disponível em:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Documentação da API: `http://localhost:3000/api-docs`

## Como executar sem Docker

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npm run build
npm run dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Funcionalidades principais

- Cadastro e login com JWT e refresh token.
- Gestão de usuários com papéis.
- Cadastro e gestão de restaurantes.
- Gestão de mesas por restaurante.
- Criação e acompanhamento de reservas.
- Estrutura inicial para páginas White Label por restaurante.
- Docker Compose com MySQL, backend e frontend.

## Observações

Esta entrega foi organizada para facilitar a execução local e posterior evolução acadêmica do TCC, incluindo separação entre frontend e backend, ORM moderno com Prisma e base de deploy em contêineres.
