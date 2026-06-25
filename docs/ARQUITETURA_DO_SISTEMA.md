# Arquitetura do Sistema - ReserveAí

O **ReserveAí** foi organizado em duas aplicações principais, separadas por responsabilidade e prontas para execução independente ou orquestrada por contêineres.

## Visão geral

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | React, Vite, Tailwind CSS | Interface do usuário, navegação, autenticação e páginas de reserva |
| Backend | Node.js, Express, TypeScript, Prisma ORM | Regras de negócio, autenticação, APIs REST e persistência |
| Banco de dados | MySQL | Armazenamento de usuários, restaurantes, mesas, reservas e configurações |
| Infraestrutura local | Docker Compose + Nginx | Orquestração dos serviços e entrega do frontend |

## Backend

O backend foi estruturado em camadas para facilitar manutenção e evolução.

| Diretório | Papel |
|---|---|
| `src/controllers` | Recebe requisições HTTP e devolve respostas padronizadas |
| `src/services` | Implementa regras de negócio |
| `src/repositories` | Centraliza operações com Prisma ORM |
| `src/middlewares` | Trata autenticação, autorização, erros e validação |
| `src/utils` | Funções utilitárias, como JWT e erros de aplicação |
| `prisma` | Schema do banco de dados e geração do client ORM |

## Frontend

O frontend segue uma organização voltada a páginas, componentes compartilhados e contexto global.

| Diretório | Papel |
|---|---|
| `client/src/pages` | Páginas da aplicação |
| `client/src/components` | Componentes reutilizáveis |
| `client/src/routes` | Configuração de rotas e proteção de acesso |
| `client/src/contexts` | Estado global, como autenticação |
| `client/src/services` | Comunicação com a API |

## Entidades principais

As principais entidades da plataforma são:

- **Usuário**
- **Restaurante**
- **Mesa**
- **Reserva**
- **RefreshToken**
- **AuditLog**
- **RestaurantSetting**
- **RestaurantImage**

## Segurança

A API utiliza autenticação baseada em **JWT**, renovação de sessão por **refresh token**, tratamento centralizado de erros, limitação de taxa por IP e organização por papéis de usuário.

## White Label

A base White Label foi prevista por meio das entidades de configuração do restaurante, permitindo evolução para personalização visual, slug próprio, galeria de imagens e metadados de SEO.
