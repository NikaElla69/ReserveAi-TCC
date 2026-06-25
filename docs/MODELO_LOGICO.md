# Modelo Lógico - ReserveAí

Este documento resume as entidades centrais do banco de dados definidas na camada Prisma do projeto **ReserveAí**.

## Entidades e relacionamentos

| Entidade | Descrição | Relacionamentos principais |
|---|---|---|
| `User` | Representa clientes, proprietários e administradores | Pode possuir restaurantes, reservas, tokens e logs |
| `Restaurant` | Representa um restaurante cadastrado na plataforma | Pertence a um proprietário e possui mesas, reservas, imagens e configurações |
| `Table` | Representa uma mesa disponível em um restaurante | Pertence a um restaurante e pode ser vinculada a reservas |
| `Reservation` | Representa uma reserva feita por um usuário | Relaciona usuário, restaurante e mesa |
| `RefreshToken` | Mantém sessões renováveis de autenticação | Pertence a um usuário |
| `AuditLog` | Registra eventos relevantes do sistema | Pode referenciar usuário e entidade afetada |
| `RestaurantSetting` | Armazena parâmetros de White Label do restaurante | Relação 1:1 com restaurante |
| `RestaurantImage` | Armazena imagens de galeria do restaurante | Relação 1:N com restaurante |

## Regras principais

- Um **usuário** pode criar várias **reservas**.
- Um **proprietário** pode possuir um ou mais **restaurantes**.
- Um **restaurante** possui várias **mesas**.
- Uma **reserva** pertence a exatamente um **usuário**, um **restaurante** e uma **mesa**.
- Um **restaurante** possui uma configuração White Label principal e várias imagens associadas.

## Observações

O modelo foi desenhado para suportar evolução incremental do TCC, preservando extensibilidade para SEO, personalização visual, multi-tenant e auditoria.
