# Guía de Implementación - Enfoque MCP para Páginas Dependientes de Website

Esta guía describe paso a paso cómo implementar el nuevo patrón de desarrollo basado en hooks personalizados siguiendo el enfoque MCP (Multiproceso con Control de Procesos) para todas las páginas dependientes del sistema.

## Orden de Implementación Recomendado

1. Categorías (ya implementado como modelo de referencia)
2. Subcategorías
3. Subsubcategorías
4. Posts
5. SEO
6. Conversiones
7. Dashboard

## Proceso de Implementación para Cada Página

### Fase 1: Análisis (Exploración)

1. **Analizar la estructura actual de la página**
   ```bash
   # Revisar la estructura actual
   cat src/pages/[EntidadPlural]/[EntidadPlural].jsx
   
   # Revisar los componentes utilizados
   ls -la src/pages/[EntidadPlural]/components/
   
   # Revisar el slice de Redux
   cat src/redux/slices/[entidadPlural]Slice.js
   ```

2. **Analizar el servicio de API existente**
   ```bash
   # Revisar el servicio de API
   cat src/services/[entidad]Service.js
   ```

3. **Identificar dependencias con el websiteSlice**
   - Buscar referencias a `selectedWebsite` o `state.websites`
   - Identificar filtros por `website_id`

### Fase 2: Diagnóstico (Evaluación)

1. **Verificar la implementación de useEntityWebsiteHook**
   - Asegurarse de que `useEntityWebsiteHook` está correctamente implementado
   - Comprobar si se necesitan personalizaciones específicas

2. **Evaluar las necesidades específicas de la entidad**
   - ¿Tiene filtros específicos?
   - ¿Requiere normalización especial?
   - ¿Tiene relaciones con otras entidades?

3. **Listar modificaciones necesarias**
   - Crear una lista con todas las modificaciones requeridas
   - Priorizar los cambios

### Fase 3: Mejora (Implementación)

1. **Crear el hook específico de la entidad**
   ```javascript
   // src/hooks/[entidad]/use[EntidadPlural].js
   import { useEffect, useCallback, useState } from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import { useWebsiteContext } from '../../contexts/WebsiteContext';
   import Swal from 'sweetalert2';
   // Importar acciones del slice correspondiente
   import {
     load[EntidadPlural],
     create[Entidad],
     update[Entidad],
     delete[Entidad]
   } from '../../redux/slices/[entidadPlural]Slice';
   
   export default function use[EntidadPlural]() {
     // Implementar hook similar a useCategories
     // ...
   }
   ```

2. **Crear utilidades de normalización (si es necesario)**
   ```javascript
   // src/utils/[entidad]Utils.js
   export const normalize[Entidad] = (item, websiteId = null) => {
     if (!item) return null;
     
     return {
       ...item,
       // Normalización específica
     };
   };
   
   // Otras utilidades específicas
   ```

3. **Refactorizar la página para usar el nuevo hook**
   ```javascript
   // src/pages/[EntidadPlural]/[EntidadPlural].jsx
   import { use[EntidadPlural] } from '../../hooks';
   
   export default function [EntidadPlural]() {
     const {
       loading,
       selectedWebsite,
       searchQuery,
       setSearchQuery,
       sortConfig,
       requestSort,
       // Otras propiedades o métodos
     } = use[EntidadPlural]();
     
     // Implementar la página usando los datos y métodos del hook
   }
   ```

4. **Actualizar los componentes relacionados**
   - Asegurarse de que todos los componentes usan las propiedades y métodos del hook
   - Eliminar lógica duplicada

### Fase 4: Pruebas (Verificación)

1. **Verificar funcionamiento básico**
   - Comprobar que la página se carga correctamente
   - Verificar que los datos se filtran por la web seleccionada

2. **Verificar operaciones CRUD**
   - Crear un nuevo elemento y verificar que se asocia a la web seleccionada
   - Editar un elemento existente
   - Eliminar un elemento existente

3. **Probar escenarios de cambio de selección**
   - Cambiar entre diferentes webs y verificar filtrado
   - Probar deseleccionar la web

4. **Verificar gestión de errores**
   - Probar operaciones con datos inválidos
   - Comprobar mensajes de error

## Ejemplo Completo: Implementación para Subcategorías

### 1. Crear hook de subcategorías

El hook `useSubcategories.js` ya está implementado en `src/hooks/subcategories/`.

### 2. Refactorizar página de Subcategorías

```javascript
// src/pages/Subcategories/Subcategories.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

// Hooks personalizados
import { useSubcategories, useCategories } from "../../hooks";

// Componentes
import SubcategoryForm from "../../components/Subcategories/SubcategoryForm";
import WebsiteAlert from "../../components/WebsiteSelector/WebsiteAlert";
import WebsiteRequired from "../../components/WebsiteSelector/WebsiteRequired";

// Componentes modularizados
import {
  SubcategoryHeader,
  SubcategorySearchBar,
  SubcategoryGrid,
  SubcategoryTable,
  LoadingState,
  CategoryFilter
} from "./components";

export default function Subcategories() {
  // Obtener el estado de ApiMode
  const { isDevelopmentMode } = useSelector((state) => state.apiMode);
  
  // Usar hooks personalizados
  const {
    loading,
    selectedWebsite,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    categoryFilter,
    filterByCategory,
    clearCategoryFilter,
    getSortedSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getAvailableCategories,
    getCategoryName
  } = useSubcategories();
  
  // Estado local
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [view, setView] = useState("grid"); // grid o table
  
  // Abrir formulario para crear subcategoría
  const handleOpenCreateForm = () => {
    setSelectedSubcategory(null);
    setIsEditing(false);
    setIsFormVisible(true);
  };
  
  // Abrir formulario para editar subcategoría
  const handleOpenEditForm = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsEditing(true);
    setIsFormVisible(true);
  };
  
  // Cancelar formulario
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setSelectedSubcategory(null);
  };
  
  // Submit del formulario de subcategoría
  const handleSubmitForm = (data) => {
    if (isEditing && selectedSubcategory) {
      updateSubcategory(selectedSubcategory.id_subcategoria, data)
        .then(() => {
          setIsFormVisible(false);
          setSelectedSubcategory(null);
        })
        .catch(error => console.error('Error al actualizar subcategoría:', error));
    } else {
      createSubcategory(data)
        .then(() => {
          setIsFormVisible(false);
        })
        .catch(error => console.error('Error al crear subcategoría:', error));
    }
  };
  
  // Manejar eliminación de subcategoría
  const handleDeleteSubcategory = (id) => {
    deleteSubcategory(id).catch(error => {
      console.error('Error al eliminar subcategoría:', error);
    });
  };
  
  // Botón para recargar datos manualmente
  const handleRefreshData = () => {
    fetchSubcategories();
  };
  
  // Renderizar contenido principal
  const renderContent = () => {
    // Si no hay sitio web seleccionado, mostrar mensaje
    if (!selectedWebsite) {
      return <WebsiteRequired />;
    }
    
    // Mostrar formulario si está visible
    if (isFormVisible) {
      return (
        <SubcategoryForm 
          initialData={isEditing ? selectedSubcategory : null}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isLoading={loading}
          selectedWebsite={selectedWebsite}
          categories={getAvailableCategories()}
        />
      );
    }
    
    // Mostrar estado de carga
    if (loading) {
      return <LoadingState />;
    }
    
    // Obtener subcategorías filtradas y ordenadas
    const items = getSortedSubcategories();
    
    // Mostrar la vista según la selección del usuario (grid o table)
    return view === 'grid' ? (
      <SubcategoryGrid 
        subcategories={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteSubcategory}
        getCategoryName={getCategoryName}
      />
    ) : (
      <SubcategoryTable 
        subcategories={items} 
        onEdit={handleOpenEditForm} 
        onDelete={handleDeleteSubcategory}
        sortConfig={sortConfig}
        requestSort={requestSort}
        getCategoryName={getCategoryName}
      />
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cabecera de la página */}
      <SubcategoryHeader 
        onRefresh={handleRefreshData} 
        onCreateNew={handleOpenCreateForm} 
        isFormVisible={isFormVisible}
        loading={loading}
        isDevelopmentMode={isDevelopmentMode}
      />
      
      {/* Alerta de web seleccionada */}
      <WebsiteAlert />
      
      {/* Filtros y búsqueda (solo si no se muestra el formulario y hay sitio web seleccionado) */}
      {!isFormVisible && selectedWebsite && (
        <>
          <CategoryFilter 
            categories={getAvailableCategories()}
            selectedCategory={categoryFilter}
            onSelectCategory={filterByCategory}
            onClearFilter={clearCategoryFilter}
          />
          
          <SubcategorySearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            view={view}
            setView={setView}
          />
        </>
      )}
      
      {/* Contenido principal: formulario, grid o tabla */}
      {renderContent()}
    </motion.div>
  );
}
```

## Recomendaciones Adicionales

1. **Implementar un hook a la vez**: Completar todo el ciclo para una entidad antes de pasar a la siguiente
2. **Mantener consistencia**: Seguir los mismos patrones y convenciones en todas las implementaciones
3. **Documentar decisiones**: Mantener documentado cualquier cambio específico o divergencia del patrón
4. **Pruebas iterativas**: Verificar cada implementación antes de pasar a la siguiente
5. **Refactorización continua**: Si se identifican mejoras al patrón base, aplicarlas a todas las implementaciones anteriores

## Recursos

1. Hooks ya implementados en `src/hooks/`
2. Documentación de arquitectura en `src/docs/hooks-architecture.md`
3. Ejemplo de referencia: Categorías en `src/pages/Categories/Categories.jsx`