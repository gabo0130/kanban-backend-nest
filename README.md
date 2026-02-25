# Kanban Backend (NestJS)

Backend para plataforma tipo Kanban con enfoque en **arquitectura limpia** y principios **SOLID**.

## Stack

- NestJS
- TypeORM
- PostgreSQL
- JWT
- class-validator
- bcryptjs

## Arquitectura

Estructura por capas:

- `src/domain`: entidades e interfaces de negocio (sin dependencias externas)
- `src/application`: casos de uso + DTOs
- `src/infrastructure`: adapters técnicos (TypeORM, bcrypt, JWT)
- `src/presentation`: controllers y guards HTTP
- `src/shared`: contratos compartidos (tokens DI, filtros de errores)

Esto mantiene la inversión de dependencias: la lógica depende de interfaces, no de implementaciones concretas.

## Configuración

1. Copia variables de entorno:

```bash
cp .env.example .env
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta en desarrollo:

```bash
npm run start:dev
```

## Variables de entorno

```env
PORT=4000
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kanban_db
CORS_ORIGIN=http://localhost:3000
```
