import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const OAuthModal = ({ 
  isOpen, 
  onClose, 
  clientId, 
  clientSecret, 
  onSuccess,
  service // 'analytics' o 'ads'
}) => {
  const [authUrl, setAuthUrl] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: generar URL, 2: introducir código, 3: resultado

  // Generar URL de autenticación
  const generateAuthUrl = () => {
    if (!clientId) {
      Swal.fire({
        title: "Error",
        text: "Debes introducir un Client ID válido",
        icon: "error",
      });
      return;
    }

    // Definir los scopes según el servicio (Analytics o Ads)
    const scopes = service === 'analytics' 
      ? 'https://www.googleapis.com/auth/analytics.readonly'
      : 'https://www.googleapis.com/auth/adwords';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(scopes)}&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${encodeURIComponent('https://dev.agencia.dimap.es/')}&client_id=${encodeURIComponent(clientId)}`;
    
    setAuthUrl(url);
    setStep(2);
  };

  // Obtener refresh token
  const getRefreshToken = async () => {
    if (!authCode || !clientId || !clientSecret) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: authCode,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: "https://dev.agencia.dimap.es/",
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error_description || "Error al obtener el token");
      }

      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
        setStep(3);
        onSuccess(data.refresh_token);
      } else {
        throw new Error("No se ha recibido el refresh token. Verifica que hayas incluido access_type=offline en la URL.");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Ha ocurrido un error al obtener el token",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si el modal se cierra, reiniciar el estado
  useEffect(() => {
    if (!isOpen) {
      setAuthUrl("");
      setAuthCode("");
      setRefreshToken("");
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Cabecera */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Obtener {service === 'analytics' ? 'Google Analytics' : 'Google Ads'} Refresh Token
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6">
          {/* Paso 1: Generar URL */}
          {step === 1 && (
            <div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Para obtener el Refresh Token necesitas autorizar el acceso a tu cuenta de Google. Haz clic en el botón para generar una URL de autorización.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={generateAuthUrl}
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Generar URL de autorización
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Introducir código */}
          {step === 2 && (
            <div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                1. Haz clic en el siguiente enlace para autorizar el acceso:
              </p>
              <div className="mb-6 mt-2">
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                >
                  {authUrl}
                </a>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                2. Inicia sesión con tu cuenta de Google y autoriza el acceso.
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                3. Después de autorizar, serás redirigido. Copia el código de la URL (parámetro "code") y pégalo aquí:
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Código de autorización
                </label>
                <textarea
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  rows="3"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  placeholder="Pega el código de autorización aquí"
                ></textarea>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-gray-200 font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={getRefreshToken}
                  disabled={isLoading}
                  className="py-2 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                      Obteniendo token...
                    </>
                  ) : (
                    "Obtener Refresh Token"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Mostrar resultado */}
          {step === 3 && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 dark:bg-green-800/20 dark:border-green-700">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">¡Refresh Token obtenido con éxito!</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>El token ha sido guardado automáticamente en el formulario.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Tu Refresh Token (ya guardado)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={refreshToken}
                    readOnly
                    className="py-3 px-4 pr-20 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(refreshToken);
                      Swal.fire({
                        title: "Copiado",
                        text: "Token copiado al portapapeles",
                        icon: "success",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000
                      });
                    }}
                    className="absolute right-0 top-0 bottom-0 px-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthModal;
