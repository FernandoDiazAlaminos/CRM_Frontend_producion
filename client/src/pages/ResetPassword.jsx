import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validateResetToken, resetPassword } from "../services/passwordResetService";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const data = await validateResetToken(token);
      setIsValidToken(data.valid);
      if (!data.valid) setMessage(data.message);
    };
    checkToken();
  }, [token]);

  const handleResetPassword = async () => {
    try {
      const data = await resetPassword(token, password);
      setMessage(data.message);
      navigate("/login");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {isValidToken ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">Nueva Contraseña</h2>

            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Restablecer Contraseña
            </button>
          </>
        ) : (
          <p className="text-center text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
