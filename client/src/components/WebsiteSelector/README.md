# Sistema de Gestión de Websites - DIMAP CRM

## Descripción
Este módulo proporciona un sistema completo para la gestión de sitios web en la aplicación DIMAP CRM. Permite seleccionar, crear, editar y eliminar sitios web, así como gestionar los permisos asociados a cada web según el rol del usuario.

## Estructura

### Componentes
- **WebsiteSelector**: Selector de websites para elegir con cuál trabajar.
- **WebsiteAlert**: Muestra una alerta con la web seleccionada actualmente.
- **WebsiteRequired**: Alerta que se muestra cuando se requiere seleccionar una web.
- **WebsiteSelectionEffect**: Gestiona efectos secundarios cuando cambia la web seleccionada.
- **WebsiteEffects**: Versión mejorada para gestionar efectos de selección de web.

### Hooks
- **useWebsitePermissions**: Hook personalizado para gestionar los permisos relacionados con websites.

### Context
- **WebsiteContext**: Contexto que centraliza la lógica de gestión de websites.

### Utilidades
- **websiteUtils.js**: Funciones de utilidad para normalizar y validar datos de websites.

## Mejoras Implementadas

1. **Corrección de Bugs**:
   - Arreglado el bug con la variable `userId` no definida en `WebsiteSelector.jsx`.

2. **Centralización de Lógica**:
   - Creado `useWebsitePermissions` para manejar la validación de permisos.
   - Implementado `WebsiteContext` para centralizar la gestión de websites.

3. **Normalización de Datos**:
   - Añadidas funciones en `websiteUtils.js` para garantizar consistencia.
   - Implementada normalización de IDs y propiedades en todo el sistema.

4. **Mejora de Seguridad**:
   - Reforzada la validación de permisos en todas las operaciones.
   - Implementado control de acceso basado en roles (RBAC).

5. **Optimización de Rendimiento**:
   - Implementada memoización con `useCallback` para funciones críticas.
   - Normalización de datos para reducir procesamiento redundante.

6. **Mejora de UX**:
   - Mejorados los mensajes de error con información más descriptiva.
   - Implementadas animaciones con Framer Motion para transiciones suaves.

7. **Mejor Integración Redux**:
   - Optimizado el manejo de estado global con Redux.
   - Mejorada la integración con localStorage para persistencia.

## Uso

### Selección de Website
```jsx
import { WebsiteSelector, WebsiteAlert } from '../components/WebsiteSelector';

function MiComponente() {
  return (
    <div>
      <WebsiteSelector />
      <WebsiteAlert />
      {/* Resto del componente */}
    </div>
  );
}
```

### Verificación de Website Requerido
```jsx
import { WebsiteRequired } from '../components/WebsiteSelector';

function MiPagina() {
  const { selectedWebsite } = useWebsiteContext();
  
  if (!selectedWebsite) {
    return <WebsiteRequired />;
  }
  
  return (
    <div>
      {/* Contenido que requiere una web seleccionada */}
    </div>
  );
}
```

### Uso del Contexto
```jsx
import { useWebsiteContext } from '../contexts/WebsiteContext';

function MiComponente() {
  const { 
    selectedWebsite, 
    loadWebsites, 
    selectWebsite, 
    createWebsite 
  } = useWebsiteContext();
  
  // Usar las funciones y datos del contexto
}
```

## Consideraciones de Seguridad
- Todas las operaciones verifican permisos antes de ejecutarse.
- Solo administradores pueden acceder a webs sin propietario.
- Se valida el rol del usuario al cargar la página y al cambiar de ruta.

## Futuras Mejoras
- Implementar tests unitarios y de integración.
- Añadir soporte para webhooks de integración.
- Implementar un sistema de logs más completo.