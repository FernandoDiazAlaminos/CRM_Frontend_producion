# Hooks Personalizados para DIMAP CRM

Este directorio contiene hooks personalizados que implementan la lógica de negocio para las diferentes entidades del sistema, siguiendo un enfoque de programación MCP (Multiproceso con Control de Procesos).

## Estructura de Hooks

Los hooks están organizados por entidad:

- **common/** - Hooks genéricos y utilidades reutilizables
- **categories/** - Gestión de categorías
- **subcategories/** - Gestión de subcategorías
- **posts/** - Gestión de artículos/posts
- **seo/** - Gestión de configuraciones SEO
- **conversions/** - Gestión de conversiones
- **dashboard/** - Integración de datos para el dashboard
- **website/** - Gestión de permisos de webs

## Hook Base: `useEntityWebsiteHook`

El hook `useEntityWebsiteHook` proporciona una base genérica para implementar operaciones CRUD en entidades que dependen de una web seleccionada:

```javascript
import useEntityWebsiteHook from '../common/useEntityWebsiteHook';

// Configuración personalizada
const config = {
  reduxSlice: 'entityName',
  actions: {
    load: loadEntities,
    create: createEntity,
    update: updateEntity,
    delete: deleteEntity
  },
  normalizeItem: (item) => ({ /* normalización */ }),
  initialSortConfig: { key: 'nombre', direction: 'asc' }
};

// Crear hook específico basado en el genérico
function useMyEntityHook() {
  const baseHook = useEntityWebsiteHook(config);
  
  // Extender con funcionalidad específica
  // ...

  return {
    ...baseHook,
    // Métodos adicionales
  };
}
```

## Integración con `WebsiteContext`

Todos los hooks utilizan el contexto de `WebsiteContext` para:

1. Filtrar datos por la web seleccionada
2. Validar permisos antes de realizar operaciones
3. Asegurar que los nuevos elementos se asocian a la web correcta
4. Recargar datos cuando cambia la selección de web

## Funcionalidades Comunes

Cada hook proporciona:

- **Operaciones CRUD**: Crear, leer, actualizar y eliminar entidades
- **Filtrado**: Búsqueda, ordenamiento y filtros específicos
- **Normalización**: Asegurar consistencia en los datos
- **Gestión de estado**: Loading, error, etc.
- **Validación**: Comprobar permisos y coherencia de datos

## Ejemplo de Uso

```jsx
import { useCategories } from '../hooks/categories';

function CategoriesPage() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    getSortedCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  // El hook se encarga de cargar datos al montar el componente
  // y cuando cambia la web seleccionada

  const handleSubmit = (data) => {
    // El hook asocia automáticamente la categoría a la web seleccionada
    createCategory(data);
  };

  return (
    // UI del componente
  );
}
```

## Ventajas de este Enfoque

1. **Separación de responsabilidades**: La lógica de negocio se separa de los componentes UI
2. **Reutilización**: La misma lógica puede usarse en múltiples componentes
3. **Consistencia**: Todas las entidades siguen el mismo patrón
4. **Mantenibilidad**: Es más fácil implementar cambios globales
5. **Pruebas**: La lógica de negocio es más fácil de probar en aislamiento

## Expansión

Para agregar una nueva entidad:

1. Crear un directorio en `hooks/` para la nueva entidad
2. Implementar un hook usando `useEntityWebsiteHook` como base
3. Extender con funcionalidad específica para la entidad
4. Utilizarlo en los componentes correspondientes