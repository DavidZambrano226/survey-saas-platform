# Arquitectura — SaaS de Encuestas

## Visión General

Plataforma fullstack para creación, publicación y análisis de encuestas. Arquitectura en dos capas independientes que se comunican vía REST API JSON.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│              Angular 21  · Bootstrap 5 · Chart.js           │
│                   Puerto 4200 (dev)                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP REST (JSON)
                         │ /api/*
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                              │
│         Node.js · Express · TypeScript · tsyringe           │
│                   Puerto 3000                               │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma ORM
┌────────────────────────▼────────────────────────────────────┐
│                      BASE DE DATOS                          │
│            SQLite (dev) / PostgreSQL (prod)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend

### Patrón Arquitectónico: Arquitectura Hexagonal (Ports & Adapters)

El backend aplica **Arquitectura Hexagonal** (también conocida como Clean Architecture) organizada en **módulos verticales**. Cada módulo encapsula su propio dominio y se divide en tres capas estrictas:

```
src/
├── main.ts                          # Bootstrap (puerto HTTP)
├── app.ts                           # Configuración Express + rutas
├── shared/
│   ├── domain/
│   │   ├── base.entity.ts           # Clase base abstracta para entidades
│   │   └── value-object.ts          # Clase base abstracta para VOs
│   ├── container/
│   │   └── container.ts             # Contenedor de inyección de dependencias (tsyringe)
│   └── infrastructure/
│       ├── prisma/prisma.service.ts # Singleton de Prisma Client
│       └── http/
│           ├── middlewares/
│           │   ├── error.middleware.ts    # Manejo centralizado de errores
│           │   └── validate.middleware.ts # Validación con express-validator
│           └── response.helper.ts        # Respuestas HTTP estandarizadas
│
└── modules/
    ├── surveys/
    │   ├── domain/
    │   │   ├── entities/survey.entity.ts
    │   │   ├── value-objects/survey-status.vo.ts
    │   │   └── repositories/survey.repository.ts   ← PUERTO (interfaz)
    │   ├── application/
    │   │   ├── dtos/
    │   │   └── use-cases/                          ← CASOS DE USO
    │   └── infrastructure/
    │       ├── controllers/survey.controller.ts    ← ADAPTADOR entrada
    │       └── persistence/prisma-survey.repository.ts ← ADAPTADOR salida
    │
    ├── questions/   (misma estructura)
    ├── responses/   (misma estructura)
    └── results/     (misma estructura)
```

### Las Tres Capas por Módulo

#### 1. Capa de Dominio (núcleo puro)

No depende de ningún framework ni librería externa. Contiene:

**Entidades** — extienden `BaseEntity` que aporta `id`, `createdAt`, `updatedAt` y serialización automática via `toJSON()`.

```
BaseEntity (abstracta)
    ├── Survey          — título, descripción, estado (Value Object)
    ├── Question        — texto, tipo (Value Object), orden, opciones
    └── SurveyResponse  — respondente, colección de AnswerData
```

**Value Objects** — extienden `ValueObject<T>`. Encapsulan validación en construcción; garantizan invariantes sin código de validación disperso.

| Value Object   | Tipo          | Valores válidos                              |
|----------------|---------------|----------------------------------------------|
| `SurveyStatus` | `string`      | `DRAFT`, `PUBLISHED`, `CLOSED`               |
| `QuestionType` | `string`      | `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `TEXT`, `RATING` |

**Interfaces de repositorio (Puertos)** — contratos que el dominio expone. No saben nada de Prisma ni SQLite.

```typescript
// El dominio define QUÉ necesita, no CÓMO se implementa
export interface SurveyRepository {
  findAll(): Promise<Survey[]>;
  findById(id: string): Promise<Survey | null>;
  save(survey: Survey): Promise<Survey>;
  update(id: string, data: Partial<...>): Promise<Survey>;
  delete(id: string): Promise<void>;
}
```

#### 2. Capa de Aplicación (orquestación)

Casos de uso con responsabilidad única (`@injectable` + `@inject` de tsyringe). Cada caso de uso:
- Recibe un DTO validado
- Interactúa con el repositorio vía su interfaz (no la implementación)
- Retorna una entidad de dominio

```
CreateSurveyUseCase   → llama SurveyRepository.save()
GetSurveyUseCase      → llama SurveyRepository.findAll() / findById()
UpdateSurveyUseCase   → llama SurveyRepository.update()
DeleteSurveyUseCase   → llama SurveyRepository.delete()
(ídem para Questions, Responses, Results)
```

#### 3. Capa de Infraestructura (adaptadores)

**Adaptadores de entrada** — controladores Express Router. Resuelven el caso de uso del contenedor, delegan, responden con `sendSuccess()` / `sendError()`.

**Adaptadores de salida** — repositorios Prisma. Implementan la interfaz de dominio. Incluyen mappers `toDomain()` (registro Prisma → entidad) y `toPlain()` (entidad → objeto persistible).

### Inversión de Dependencias — Contenedor DI

`tsyringe` actúa como contenedor IoC. El mapeo concreto `interfaz → implementación` vive en un único archivo:

```typescript
// container.ts — único lugar donde se conoce Prisma
container.registerSingleton('PrismaService', PrismaService);
container.register('SurveyRepository',   { useClass: PrismaSurveyRepository });
container.register('QuestionRepository', { useClass: PrismaQuestionRepository });
container.register('ResponseRepository', { useClass: PrismaResponseRepository });
container.register('ResultsRepository',  { useClass: PrismaResultsRepository });
```

Cambiar SQLite por PostgreSQL no requiere tocar dominio ni aplicación — solo cambiar la variable `DATABASE_URL`.

### API REST

Todas las respuestas siguen el contrato `ApiResponse<T>`:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error", "errors": [] }
```

| Método | Ruta                                  | Descripción                  |
|--------|---------------------------------------|------------------------------|
| GET    | `/api/surveys`                        | Listar encuestas             |
| POST   | `/api/surveys`                        | Crear encuesta               |
| GET    | `/api/surveys/:id`                    | Obtener encuesta             |
| PUT    | `/api/surveys/:id`                    | Actualizar encuesta          |
| DELETE | `/api/surveys/:id`                    | Eliminar encuesta            |
| GET    | `/api/surveys/:id/questions`          | Listar preguntas             |
| POST   | `/api/surveys/:id/questions`          | Agregar pregunta             |
| PUT    | `/api/surveys/:id/questions/:qId`     | Actualizar pregunta          |
| DELETE | `/api/surveys/:id/questions/:qId`     | Eliminar pregunta            |
| POST   | `/api/surveys/:id/responses`          | Enviar respuesta (pública)   |
| GET    | `/api/surveys/:id/results`            | Obtener resultados           |

### Modelo de Datos

```
Survey ──< Question ──< Answer >── SurveyResponse
  │            │
  │            └── type: SINGLE_CHOICE | MULTIPLE_CHOICE | TEXT | RATING
  └── status: DRAFT | PUBLISHED | CLOSED
```

Relaciones con `onDelete: Cascade`: eliminar una encuesta elimina sus preguntas, respuestas y respuestas en cascada.

### Stack Backend

| Tecnología         | Versión  | Rol                                      |
|--------------------|----------|------------------------------------------|
| Node.js            | ≥ 18     | Runtime                                  |
| TypeScript         | 5.3      | Tipado estático                          |
| Express            | 4.18     | Framework HTTP                           |
| Prisma ORM         | 5.10     | Acceso a base de datos                   |
| SQLite             | —        | Base de datos (desarrollo)               |
| tsyringe           | 4.8      | Contenedor de inyección de dependencias  |
| express-validator  | 7.0      | Validación de DTOs en controladores      |
| uuid               | 9.0      | Generación de IDs                        |

---

## Frontend

### Patrón Arquitectónico: Feature-Based con Standalone Components

Angular 21 sin NgModules. Organización por **features verticales** con capa `core` horizontal para servicios e interceptores.

```
src/app/
├── app.ts              # Componente raíz (standalone)
├── app.routes.ts       # Enrutamiento centralizado con lazy loading
├── app.config.ts       # Configuración de providers Angular
│
├── core/               # Capa transversal (singleton)
│   ├── models/
│   │   └── survey.model.ts        # Interfaces TypeScript (contrato con API)
│   ├── services/
│   │   └── survey.service.ts      # Único servicio HTTP (DRY)
│   └── interceptors/
│       └── error.interceptor.ts   # Manejo centralizado de errores HTTP
│
├── features/           # Módulos de funcionalidad (lazy-loaded)
│   ├── surveys/        # Gestión admin
│   │   ├── components/
│   │   │   └── question-manager/  # Gestor inline de preguntas
│   │   └── pages/
│   │       ├── survey-list/       # Listado + acciones
│   │       └── survey-form/       # Crear / editar encuesta
│   │
│   ├── public-survey/  # Vista pública
│   │   └── pages/
│   │       └── take-survey/       # Formulario dinámico por tipo de pregunta
│   │
│   └── results/        # Dashboard de resultados
│       ├── components/
│       │   └── chart/             # Componente Chart.js (OCP)
│       └── pages/
│           └── results-dashboard/ # Visualización de resultados
│
└── shared/             # Componentes reutilizables
    └── components/
        ├── navbar/
        ├── status-badge/
        └── confirm-modal/
```

### Decisiones Arquitectónicas Clave

#### Standalone Components + Lazy Loading

Sin `NgModule`. Cada componente de página es `standalone: true` y se carga bajo demanda con `loadComponent()`. El router solo carga el bundle del feature cuando el usuario navega a esa ruta.

```typescript
// app.routes.ts — lazy loading por ruta
{
  path: 'surveys/:id/results',
  loadComponent: () => import('./features/results/pages/results-dashboard/...')
    .then(m => m.ResultsDashboardComponent)
}
```

#### Señales (Signals) para Estado Local

Se usa la API de Signals de Angular (no NgRx) para estado de componente: más simple, menos boilerplate, integración nativa con el detector de cambios.

```typescript
surveys  = signal<Survey[]>([]);
loading  = signal(true);
deleteId = signal<string | null>(null);
```

#### Servicio Único — SurveyService (DRY)

Un solo servicio HTTP cubre toda la API. Método privado `unwrap<T>()` centraliza la extracción de `data` de `ApiResponse<T>`, eliminando código repetido en cada llamada.

```typescript
private unwrap<T>(obs: Observable<ApiResponse<T>>): Observable<T> {
  return obs.pipe(map(r => r.data));
}
```

#### Interceptor de Errores (DRY + SRP)

`errorInterceptor` captura todos los errores HTTP en un único punto, normaliza el mensaje y los propaga. Los componentes no necesitan manejar errores de red.

#### ChartComponent — Principio Abierto/Cerrado

El componente de gráficas recibe un `QuestionResult` y decide qué tipo de Chart.js renderizar. Agregar un nuevo tipo de pregunta requiere solo añadir una función `buildXxxConfig()` — sin modificar la lógica existente.

```
SINGLE_CHOICE  → Gráfica de torta (pie)
MULTIPLE_CHOICE → Gráfica de barras (bar)
RATING         → Gráfica de dona con promedio (doughnut)
TEXT           → Lista de respuestas (sin gráfica)
```

### Rutas

| Ruta                      | Componente             | Descripción                        |
|---------------------------|------------------------|------------------------------------|
| `/surveys`                | SurveyListComponent    | Panel admin — listado              |
| `/surveys/new`            | SurveyFormComponent    | Crear encuesta + preguntas         |
| `/surveys/:id/edit`       | SurveyFormComponent    | Editar encuesta existente          |
| `/surveys/:id/results`    | ResultsDashboardComponent | Dashboard de resultados         |
| `/survey/:id`             | TakeSurveyComponent    | Vista pública — responder          |

### Modelos TypeScript

Los modelos en `core/models/survey.model.ts` son el contrato entre frontend y backend. Tipan completamente la API sin duplicar lógica.

```typescript
type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'RATING';
```

### Stack Frontend

| Tecnología   | Versión  | Rol                                         |
|--------------|----------|---------------------------------------------|
| Angular      | 21       | Framework SPA                               |
| TypeScript   | 5.9      | Tipado estático                             |
| Bootstrap    | 5.3      | Sistema de diseño / componentes UI          |
| Chart.js     | 4.5      | Visualizaciones gráficas                    |
| RxJS         | 7.8      | Programación reactiva (HTTP)                |
| Angular Signals | 21    | Gestión de estado local reactivo            |

---

## Principios SOLID Aplicados

| Principio | Aplicación Concreta                                                                         |
|-----------|---------------------------------------------------------------------------------------------|
| **SRP**   | Cada caso de uso hace exactamente una operación. `SurveyService` frontend separa HTTP de lógica de vista. |
| **OCP**   | `ChartComponent`: nuevos tipos de gráfica = nuevas funciones, sin modificar código existente. `ValueObject<T>`: extender para nuevos VOs sin cambiar la base. |
| **LSP**   | `PrismaSurveyRepository` sustituye a `SurveyRepository` (interfaz) sin romper contratos. |
| **ISP**   | Repositorios con interfaces pequeñas y específicas por módulo (no un repositorio genérico para todo). |
| **DIP**   | Los casos de uso dependen de `SurveyRepository` (abstracción), no de `PrismaSurveyRepository` (concreción). El contenedor tsyringe resuelve en runtime. |

## Principio DRY Aplicado

| Punto de Centralización     | Qué evita repetir                                   |
|-----------------------------|-----------------------------------------------------|
| `BaseEntity`                | `id`, `createdAt`, `updatedAt`, `toJSON()` en todas las entidades |
| `ValueObject<T>`            | Lógica de validación y comparación de VOs           |
| `sendSuccess()` / `sendError()` | Formato de respuesta HTTP en todos los controladores |
| `container.ts`              | Registro de dependencias en un único archivo        |
| `SurveyService.unwrap()`    | Extracción de `data` en todas las llamadas HTTP     |
| `errorInterceptor`          | Manejo de errores HTTP en el frontend               |
