export const requestPasswordReset = async (email) => {
    const response = await fetch("http://localhost:4000/api/resetPassword/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al solicitar restablecimiento");
    return data;
  };
  
  export const validateResetToken = async (token) => {
    const response = await fetch(`http://localhost:4000/api/resetPassword/validate-token/${token}`);
    const data = await response.json();
    return data;
  };
  
  export const resetPassword = async (token, password) => {
    const response = await fetch(`http://localhost:4000/api/resetPassword/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al restablecer la contraseña");
    return data;
  };
  