import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Para manejar '__dirname' en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// Para todas las rutas, devuelve 'index.html'
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
