import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Botón para abrir/cerrar Sidebar en móviles */}
      <button onClick={toggleSidebar} className="lg:hidden p-2 bg-gray-200 rounded">
        ☰
      </button>
      <h1 className="text-lg font-bold">Panel de Administración</h1>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700">{user?.name}</span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
