# Arquitectura de Hooks en DIMAP CRM

Este documento describe la arquitectura y el flujo de datos implementado con los hooks personalizados que siguen el enfoque MCP (Multiproceso con Control de Procesos).

## Diagrama de Componentes

```
+----------------------------------+     +----------------------------------+
|          WebsiteContext          |     |           Redux Store            |
+----------------------------------+     +----------------------------------+
| • selectedWebsite                |     | • websites                       |
| • websites                       |<--->| • categories                     |
| • loadWebsites()                 |     | • subcategories                  |
| • selectWebsite()                |     | • posts                          |
| • clearSelectedWebsite()         |     | • seo                            |
| • canAccessWebsite()             |     | • conversions                    |
+----------------------------------+     +----------------------------------+
             ^                                          ^
             |                                          |
             |                                          |
+----------------------------------+     +----------------------------------+
|     useWebsitePermissions        |     |       useEntityWebsiteHook       |
+----------------------------------+     +----------------------------------+
| • isAdmin                        |     | • getFilteredItems()             |
| • canAccessWebsite()             |     | • getSortedItems()               |
| • canEditWebsite()               |     | • createItem()                   |
| • canDeleteWebsite()             |     | • updateItem()                   |
| • getAccessibleWebsites()        |     | • deleteItem()                   |
+----------------------------------+     +----------------------------------+
             ^                                          ^
             |                                          |
             +---------------------+----------------------+
                                  |
                                  ▼
+----------------------------------+     +----------------------------------+
|   Entity-Specific Hooks          |     |        Integration Hooks         |
+----------------------------------+     +----------------------------------+
| • useCategories                  |     | • useDashboard                   |
| • useSubcategories               |     |                                  |
| • usePosts                       |     |                                  |
| • useSEO                         |     |                                  |
| • useConversions                 |     |                                  |
+----------------------------------+     +----------------------------------+
             ^                                          ^
             |                                          |
             +---------------------+----------------------+
                                  |
                                  ▼
+----------------------------------+
|           Components             |
+----------------------------------+
| • Categories                     |
| • Subcategories                  |
| • Posts                          |
| • SEO                            |
| • Conversions                    |
| • Dashboard                      |
+----------------------------------+
```

## Flujo de Datos y Control de Procesos (MCP)

### 1. Fase de Análisis (Exploración)

Cuando un componente se monta, se ejecuta el siguiente flujo:

1. El componente importa y utiliza el hook específico de la entidad
2. El hook de la entidad se basa en `useEntityWebsiteHook` o implementa su lógica específica
3. Se accede al `WebsiteContext` para obtener la web seleccionada
4. Se verifica si hay permisos para la operación mediante `useWebsitePermissions`
5. Se cargan los datos iniciales filtrando por la web seleccionada

```javascript
// Ejemplo del flujo de análisis en un componente
function CategoryPage() {
  const { loading, getSortedCategories } = useCategories();
  
  // El hook ya ha ejecutado la fase de análisis
  // - Ha verificado permisos
  // - Ha cargado datos filtrados por web
  // - Ha aplicado normalización
}
```

### 2. Fase de Diagnóstico (Evaluación)

El hook maneja la lógica para evaluar el estado actual:

1. Determinar si hay una web seleccionada válida
2. Evaluar permisos para las operaciones
3. Verificar estado de carga, errores y filtros
4. Proporcionar funciones de ordenamiento y filtrado

```javascript
// Dentro del hook, se realiza diagnóstico constantemente
const getFilteredItems = useCallback(() => {
  // Diagnóstico: ¿Hay web seleccionada?
  if (!selectedWebsite) return [];
  
  // Diagnóstico: Aplicar filtros necesarios
  return items.filter(item => 
    item.website_id === selectedWebsite.id &&
    (searchQuery ? item.name.includes(searchQuery) : true)
  );
}, [selectedWebsite, items, searchQuery]);
```

### 3. Fase de Mejora (Implementación)

Cuando el usuario interactúa, el hook proporciona métodos para realizar cambios:

1. Creación, actualización o eliminación de entidades
2. Asociación automática con la web seleccionada
3. Manejo de errores, validación y confirmaciones
4. Actualización de estado en Redux y caché local

```javascript
// Método de implementación en el hook
const handleCreate = useCallback((data) => {
  // Validar web seleccionada
  if (!selectedWebsite) {
    return Promise.reject(new Error('Selecciona una web'));
  }
  
  // Asociar datos a la web actual
  const itemData = {
    ...data,
    website_id: selectedWebsite.id
  };
  
  // Implementar cambios en el estado global
  return dispatch(actions.create(itemData)).unwrap();
}, [dispatch, selectedWebsite, actions]);
```

### 4. Fase de Pruebas (Verificación)

Los hooks incluyen lógica para verificar resultados:

1. Normalización de datos para garantizar consistencia
2. Validación de permisos en cada operación
3. Manejo de errores y notificaciones al usuario
4. Actualización automática de UI cuando cambian datos

```javascript
// Verificación en operaciones
const handleUpdate = useCallback(async (id, data) => {
  try {
    // Realizar la operación
    const result = await dispatch(actions.update({id, data})).unwrap();
    
    // Verificar éxito
    return normalizeItem(result);
  } catch (error) {
    // Verificar fracaso
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
    return Promise.reject(error);
  }
}, [dispatch, actions, normalizeItem]);
```

## Beneficios del Enfoque MCP

1. **Exploración sistemática**: Cada hook analiza primero el contexto y los datos
2. **Diagnóstico continuo**: Evaluación de estados y permisos antes de cada operación
3. **Implementación estandarizada**: Patrón común para crear, leer, actualizar y eliminar
4. **Verificación integrada**: Validación, normalización y control de errores
5. **Separación de responsabilidades**: La lógica de negocio está separada de la UI

## Extensibilidad

Este enfoque facilita:

1. Agregar nuevas entidades siguiendo el mismo patrón
2. Modificar el comportamiento para todas las entidades desde un punto central
3. Aplicar cambios de permisos de manera consistente
4. Reutilizar código entre distintos componentes
5. Implementar pruebas unitarias más sencillas