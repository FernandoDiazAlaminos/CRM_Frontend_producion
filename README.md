# DIMAP CRM - Sistema de Gestión

Este proyecto es un CRM (Customer Relationship Management) para gestionar websites y sus contenidos asociados, incluyendo categorías, subcategorías, posts, SEO y conversiones.

## Estructura del Proyecto

- **client/src**: Código fuente del frontend con React
  - **assets**: Recursos estáticos
  - **components**: Componentes reutilizables
  - **contexts**: Contextos de React (WebsiteContext, etc.)
  - **docs**: Documentación técnica
  - **hooks**: Hooks personalizados por entidad
  - **layouts**: Componentes de estructura
  - **pages**: Componentes de páginas
  - **redux**: Estado global con Redux Toolkit
  - **services**: Servicios de API
  - **utils**: Utilidades y helpers

- **server**: Código fuente del backend con Node.js

## Enfoque MCP (Multiproceso con Control de Procesos)

El proyecto sigue un enfoque de desarrollo MCP que asegura una implementación estructurada:

1. **Fase de Análisis (Exploración)**: Entender el sistema existente
2. **Fase de Diagnóstico (Evaluación)**: Identificar mejoras
3. **Fase de Mejora (Implementación)**: Desarrollar soluciones
4. **Fase de Pruebas (Verificación)**: Asegurar calidad

Para más detalles, consultar la [Guía de Implementación MCP](./client/src/docs/implementacion-mcp.md).

## Arquitectura de Hooks

El sistema utiliza hooks personalizados que siguen un patrón consistente:

- **useEntityWebsiteHook**: Hook base genérico para operaciones CRUD con entidades dependientes de websites
- Hooks específicos por entidad: `useCategories`, `useSubcategories`, `usePosts`, `useSEO`, `useConversions`
- Hook de Dashboard (`useDashboard`) que integra datos de múltiples fuentes

Para más información, consultar la [documentación de hooks](./client/src/hooks/README.md).

## Patrones de Diseño

- **Componentes Modularizados**: Separación en archivos pequeños con responsabilidad única
- **Contextos**: Gestión de estado compartido con WebsiteContext
- **Redux Toolkit**: Para estado global
- **Normalización**: Utilidades para garantizar consistencia en datos

## Tecnologías

- **Frontend**: React, Redux Toolkit, Tailwind CSS, Preline.co, Framer Motion
- **Backend**: Node.js, Express, Sequelize (ORM)
- **Autenticación**: JWT
- **Documentación API**: Swagger

## Instalación y Ejecución

### Frontend
```bash
cd client
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## Directrices de Desarrollo

- Componentes con Preline.co y Framer Motion para animaciones
- Arquitectura de componentes modularizados
- APIs con fetch nativo (no Axios)
- Separación de responsabilidades (presentación/lógica)
- Uso de Redux para estado global
- Patrones consistentes para carga, validación y manejo de errores