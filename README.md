# Survey SaaS Platform

Plataforma fullstack para creación, publicación y análisis de encuestas. Prueba técnica — arquitectura en dos capas independientes comunicadas vía REST API.

---

## Stack

| Capa      | Tecnologías                                              |
|-----------|----------------------------------------------------------|
| Frontend  | Angular 21 · TypeScript 5.9 · Bootstrap 5 · Chart.js 4 |
| Backend   | Node.js ≥18 · Express 4 · TypeScript 5.3 · Prisma 5    |
| Base de datos | SQLite (dev) / PostgreSQL (prod)                   |

---

## Arquitectura

```
Frontend (Angular 21)  →  HTTP REST /api/*  →  Backend (Express)  →  Prisma  →  SQLite/PostgreSQL
     :4200                                          :3000
```

**Backend** — Arquitectura Hexagonal (Ports & Adapters) con módulos verticales. Dominio puro sin frameworks, casos de uso como orquestadores, adaptadores Prisma en infraestructura. Inyección de dependencias vía `tsyringe`.

**Frontend** — Feature-based con Standalone Components (sin NgModules). Lazy loading por ruta, Angular Signals para estado local, servicio HTTP único con interceptor de errores centralizado.

Documentación detallada: [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)

---

## Inicio Rápido

### Requisitos

- Node.js ≥ 18
- npm ≥ 9

No se requiere base de datos instalada — el proyecto usa SQLite (archivo local).

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed          # opcional: datos de ejemplo
npm run dev           # http://localhost:3000
```

### Frontend

```bash
# En nueva terminal
cd frontend
npm install
npm start             # http://localhost:4200
```

Guía completa con solución de problemas: [`docs/GUIA-EJECUCION.md`](docs/GUIA-EJECUCION.md)

---

## Funcionalidades

- **Panel admin** — crear, editar, publicar y eliminar encuestas
- **Gestión de preguntas** — selección única, selección múltiple, texto libre, calificación (1–5)
- **Vista pública** — formulario dinámico para responder encuestas publicadas
- **Dashboard de resultados** — gráficas automáticas por tipo de pregunta (pie, barras, dona, lista)
- **Estados de encuesta** — `DRAFT` → `PUBLISHED` → `CLOSED`

---

## API REST

Base URL: `http://localhost:3000`

| Método | Ruta                                  | Descripción                |
|--------|---------------------------------------|----------------------------|
| GET    | `/api/surveys`                        | Listar encuestas           |
| POST   | `/api/surveys`                        | Crear encuesta             |
| GET    | `/api/surveys/:id`                    | Obtener encuesta           |
| PUT    | `/api/surveys/:id`                    | Actualizar encuesta        |
| DELETE | `/api/surveys/:id`                    | Eliminar encuesta          |
| GET    | `/api/surveys/:id/questions`          | Listar preguntas           |
| POST   | `/api/surveys/:id/questions`          | Agregar pregunta           |
| PUT    | `/api/surveys/:id/questions/:qId`     | Actualizar pregunta        |
| DELETE | `/api/surveys/:id/questions/:qId`     | Eliminar pregunta          |
| POST   | `/api/surveys/:id/responses`          | Enviar respuesta (pública) |
| GET    | `/api/surveys/:id/results`            | Obtener resultados         |

Todas las respuestas siguen el contrato `{ "success": true, "data": { ... } }`.

---

## Estructura del Proyecto

```
survey-saas-platform/
├── backend/
│   ├── prisma/            # Schema, migraciones, seed
│   └── src/
│       ├── modules/       # surveys · questions · responses · results
│       └── shared/        # DI container, Prisma service, middlewares
├── frontend/
│   └── src/app/
│       ├── core/          # Modelos, SurveyService, error interceptor
│       ├── features/      # surveys · public-survey · results
│       └── shared/        # navbar, status-badge, confirm-modal
├── docs/
│   ├── ARQUITECTURA.md    # Diseño técnico detallado
│   └── GUIA-EJECUCION.md  # Setup y troubleshooting
```

---

## Comandos

### Backend

| Comando                  | Descripción                            |
|--------------------------|----------------------------------------|
| `npm run dev`            | Servidor con hot-reload                |
| `npm run build`          | Compilar TypeScript                    |
| `npm start`              | Ejecutar build de producción           |
| `npm test`               | Pruebas unitarias                      |
| `npm run seed`           | Cargar datos de ejemplo                |
| `npm run prisma:studio`  | Explorador visual de base de datos     |

### Frontend

| Comando          | Descripción                            |
|------------------|----------------------------------------|
| `npm start`      | Servidor de desarrollo (:4200)         |
| `npm run build`  | Compilar para producción               |
| `npm test`       | Pruebas unitarias                      |
