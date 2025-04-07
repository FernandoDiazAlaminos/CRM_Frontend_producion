import React, { useState } from 'react';

const ConversionTracker = ({ conversion, websiteId }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [tabSelected, setTabSelected] = useState('script'); // 'script' o 'api'
  
  // Generar el script de seguimiento
  const generateTrackingScript = () => {
    const trackingScript = `
<!-- DIMAP Conversion Tracking - ${conversion.name} -->
<script>
  function trackDimapConversion(e) {
    e.preventDefault();
    
    // Enviar la conversión al servidor
    fetch('https://dev.agencia.dimap.es/api/conversions/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unique_code: '${conversion.unique_code}',
        website_id: ${websiteId},
        value: ${conversion.value}
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Conversión registrada:', data);
      
      // Continuar con el envío del formulario si es necesario
      if (e.target.tagName === 'FORM') {
        e.target.submit();
      }
    })
    .catch(error => {
      console.error('Error al registrar conversión:', error);
      
      // Continuar con el envío del formulario si es necesario
      if (e.target.tagName === 'FORM') {
        e.target.submit();
      }
    });
  }
  
  // Función para adjuntar el evento al elemento deseado
  function attachConversionTracker() {
    // Ejemplo: seguimiento en formulario con id 'contact-form'
    const element = document.querySelector('#your-element-id');
    if (element) {
      element.addEventListener('submit', trackDimapConversion);
    }
  }
  
  // Adjuntar el seguimiento cuando el DOM esté listo
  if (document.readyState === 'complete') {
    attachConversionTracker();
  } else {
    document.addEventListener('DOMContentLoaded', attachConversionTracker);
  }
</script>
<!-- Fin DIMAP Conversion Tracking -->`;

    return trackingScript.trim();
  };

  // Copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  };

  // Código para capturar una conversión usando la API
  const apiCodeExample = `
// Usando fetch
fetch('https://dev.agencia.dimap.es/api/conversions/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    unique_code: '${conversion.unique_code}',
    website_id: ${websiteId},
    value: ${conversion.value}
  })
})
.then(response => response.json())
.then(data => console.log('Conversión registrada:', data))
.catch(error => console.error('Error:', error));
`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Código de seguimiento para {conversion.name}
        </h3>
        
        {/* Tabs para diferentes tipos de código */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button
              onClick={() => setTabSelected('script')}
              className={`py-3 px-4 inline-flex items-center text-sm font-medium ${
                tabSelected === 'script'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Script HTML
            </button>
            <button
              onClick={() => setTabSelected('api')}
              className={`py-3 px-4 inline-flex items-center text-sm font-medium ${
                tabSelected === 'api'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              API JavaScript
            </button>
          </nav>
        </div>
        
        {/* Contenido según la pestaña seleccionada */}
        <div className="mt-4">
          {tabSelected === 'script' ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Agrega este script a tu sitio web para rastrear conversiones automáticamente.
                Personalízalo con el ID de tu elemento (formulario, botón, etc.).
              </p>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {generateTrackingScript()}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generateTrackingScript())}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="size-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Usa este código JavaScript para enviar conversiones manualmente desde tu aplicación.
              </p>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {apiCodeExample}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiCodeExample)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="size-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mensaje de éxito al copiar */}
        {copySuccess && (
          <div className="mt-3 inline-flex items-center gap-x-2 text-sm font-medium text-green-600 dark:text-green-500">
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Copiado al portapapeles
          </div>
        )}
        
        {/* Instrucciones adicionales */}
        <div className="mt-5 p-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-sm">
          <h4 className="font-medium mb-1">Consejos para implementación:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Asegúrate de modificar <code>your-element-id</code> con el ID del elemento HTML donde quieres rastrear conversiones.</li>
            <li>Puedes personalizar el comportamiento modificando la función <code>trackDimapConversion</code>.</li>
            <li>Este código funciona tanto para formularios como para botones y otros elementos interactivos.</li>
            <li>Para eventos específicos (como clics o impresiones), ajusta el tipo de evento en <code>addEventListener</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConversionTracker;