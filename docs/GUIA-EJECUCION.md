# Guía de Ejecución — SaaS de Encuestas

Esta guía permite levantar el proyecto completo (backend + frontend) en un ambiente local de forma rápida.

---

## Requisitos Previos

| Herramienta | Versión Mínima | Verificar con          |
|-------------|----------------|------------------------|
| Node.js     | 18.x o superior | `node --version`      |
| npm         | 9.x o superior  | `npm --version`       |
| Git         | cualquiera      | `git --version`       |

No se requiere ninguna base de datos instalada — el proyecto usa **SQLite** (archivo local incluido en el repositorio).

---

## 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd survey-saas-platform
```

---

## 2. Backend

### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

### 2.2 Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` por defecto ya está configurado para desarrollo local:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

> No es necesario modificar nada para ejecutar en local.

### 2.3 Inicializar la base de datos

```bash
npx prisma migrate dev --name init
```

Este comando crea el archivo `prisma/dev.db` con todas las tablas. Solo se ejecuta **la primera vez** (o si se borra la base de datos).

### 2.4 (Opcional) Cargar datos de prueba

```bash
npm run seed
```

Carga encuestas de ejemplo con preguntas para facilitar la evaluación.

### 2.5 Iniciar el servidor

```bash
npm run dev
```

El backend queda disponible en: **http://localhost:3000**

Verificar que funciona:
```bash
curl http://localhost:3000/health
# Respuesta esperada: {"status":"ok"}
```

---

## 3. Frontend

Abrir una **nueva terminal** (mantener el backend corriendo).

### 3.1 Instalar dependencias

```bash
cd frontend
npm install
```

### 3.2 Iniciar la aplicación

```bash
npm start
```

El frontend queda disponible en: **http://localhost:4200**

---

## 4. Uso de la Aplicación

### Flujo Principal (camino feliz)

1. Abrir **http://localhost:4200** en el navegador
2. El panel de administración muestra las encuestas existentes
3. Crear una nueva encuesta con el botón **"Nueva encuesta"**
4. Agregar preguntas (selección única, múltiple, texto libre, calificación)
5. Publicar la encuesta cambiando el estado a **PUBLISHED**
6. Compartir el enlace público: **http://localhost:4200/survey/{id}**
7. Responder la encuesta desde la vista pública
8. Ver resultados en tiempo real: botón **"Ver resultados"** en el panel admin

### Rutas Disponibles

| URL                              | Descripción                          |
|----------------------------------|--------------------------------------|
| `http://localhost:4200/surveys`         | Panel admin — listado de encuestas   |
| `http://localhost:4200/surveys/new`     | Crear encuesta                       |
| `http://localhost:4200/surveys/:id/edit`| Editar encuesta y preguntas          |
| `http://localhost:4200/surveys/:id/results` | Dashboard de resultados          |
| `http://localhost:4200/survey/:id`      | Vista pública para responder         |

### API REST — Exploración Directa

La API puede consultarse directamente. Ejemplos con `curl`:

```bash
# Listar encuestas
curl http://localhost:3000/api/surveys

# Crear encuesta
curl -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{"title": "Encuesta de prueba", "description": "Descripción opcional"}'

# Ver resultados de una encuesta
curl http://localhost:3000/api/surveys/{id}/results
```

---

## 5. Comandos Útiles

### Backend

| Comando               | Descripción                                      |
|-----------------------|--------------------------------------------------|
| `npm run dev`         | Servidor en modo desarrollo con hot-reload       |
| `npm run build`       | Compilar TypeScript a JavaScript                 |
| `npm start`           | Ejecutar build de producción                     |
| `npm test`            | Ejecutar pruebas unitarias                       |
| `npm run prisma:studio` | Abrir explorador visual de base de datos       |
| `npm run seed`        | Cargar datos de ejemplo                          |

### Frontend

| Comando        | Descripción                                      |
|----------------|--------------------------------------------------|
| `npm start`    | Servidor de desarrollo en puerto 4200            |
| `npm run build`| Compilar para producción                         |
| `npm test`     | Ejecutar pruebas unitarias                       |

---

## 6. Solución de Problemas Frecuentes

### Puerto 3000 ocupado

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Puerto 4200 ocupado

```bash
# macOS/Linux
lsof -i :4200
kill -9 <PID>
```

### Error de base de datos al iniciar

Eliminar y recrear la base de datos:

```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npm run seed   # opcional
```

### Error "reflect-metadata" al iniciar backend

Verificar que `import 'reflect-metadata'` está en `src/main.ts` (ya incluido en el proyecto).

### CORS: el frontend no puede conectar con el backend

Verificar que el backend está corriendo en `localhost:3000`. El frontend apunta a ese URL por defecto en `frontend/src/environments/environment.ts`.

---

## 7. Estructura de Archivos del Proyecto

```
survey-saas-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelo de datos
│   │   ├── seed.ts            # Datos de prueba
│   │   └── dev.db             # Base de datos SQLite (generada)
│   ├── src/
│   │   ├── modules/           # Módulos de negocio
│   │   └── shared/            # Código compartido
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Servicios e interceptores
│   │   │   ├── features/      # Módulos de funcionalidad
│   │   │   └── shared/        # Componentes reutilizables
│   │   └── environments/      # Configuración por entorno
│   └── package.json
│
├── reto/                      # Enunciado de la prueba técnica
├── ARQUITECTURA.md            # Documentación de arquitectura
├── GUIA-EJECUCION.md          # Este archivo
└── SUSTENTACION.md            # Guía de sustentación técnica
```
