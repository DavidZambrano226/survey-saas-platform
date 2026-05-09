# Survey Platform — Backend

Express + TypeScript con arquitectura hexagonal por módulos.

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Datos de prueba incluidos

El seed carga automáticamente:
- `Encuesta de Satisfacción del Cliente` — PUBLISHED, 4 preguntas, 5 respuestas
- `Evaluación de Capacitación Interna` — PUBLISHED, 3 preguntas, 3 respuestas
- `Encuesta de Clima Organizacional` — DRAFT, sin respuestas

### Resetear la base de datos

```bash
npx prisma migrate reset   # borra todo y re-aplica migraciones
npm run seed               # vuelve a cargar los datos
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/surveys | Listar encuestas |
| POST | /api/surveys | Crear encuesta |
| GET | /api/surveys/:id | Obtener encuesta |
| PUT | /api/surveys/:id | Actualizar encuesta |
| DELETE | /api/surveys/:id | Eliminar encuesta |
| GET | /api/surveys/:id/questions | Listar preguntas |
| POST | /api/surveys/:id/questions | Crear pregunta |
| PUT | /api/surveys/:id/questions/:qid | Actualizar pregunta |
| DELETE | /api/surveys/:id/questions/:qid | Eliminar pregunta |
| POST | /api/surveys/:id/responses | Enviar respuesta (encuesta publicada) |
| GET | /api/surveys/:id/results | Ver resultados con estadísticas |

## Tipos de pregunta

- `TEXT` — respuesta libre
- `SINGLE_CHOICE` — una opción (requiere `options[]`)
- `MULTIPLE_CHOICE` — múltiples opciones (requiere `options[]`)
- `RATING` — calificación numérica

## Deploy en AWS Lambda

```bash
npm run build
# Empaquetar dist/ + node_modules con serverless-http
```

Cambiar `DATABASE_URL` en variables de entorno a PostgreSQL RDS.
