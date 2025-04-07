import { useState } from "react";
import { requestPasswordReset } from "../services/passwordResetService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Restablecer Contraseña</h2>
        <p className="text-gray-600 text-center mb-4">
          Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleForgotPassword}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Enviar enlace
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
