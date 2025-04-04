import { useState } from "react";
import EmpleadosTable from "./EmpleadosTable";
import CuentasTable from "./CuentasTable";
import { FaUser, FaCreditCard } from "react-icons/fa6";
import './app.css';  // Asegúrate de importar tu archivo de CSS

export default function App() {
  const [view, setView] = useState(null);
  const [showCrearEmpleado, setShowCrearEmpleado] = useState(false);
  const [showCrearCuenta, setShowCrearCuenta] = useState(false);

  const handleCrearEmpleado = () => {
    setShowCrearEmpleado(true);
    setShowCrearCuenta(false);
    setView(null);
  };

  const handleCrearCuenta = () => {
    setShowCrearCuenta(true);
    setShowCrearEmpleado(false);
    setView(null);
  };

  const handleView = (view) => {
    setView(view);
    setShowCrearEmpleado(false);
    setShowCrearCuenta(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Barra de navegación con los botones */}
      <div className="navbar">
        <div className="button-container">
          <button
            onClick={() => handleView("empleados")}
            className="button button-empleados"
          >
            <FaUser /> Empleados
          </button>
          <button
            onClick={() => handleView("cuentas")}
            className="button button-cuentas"
          >
            <FaCreditCard /> Cuentas
          </button>
        </div>
      </div>

      {/* Mostrar las tablas según la vista seleccionada */}
      {view === "empleados" && <EmpleadosTable />}
      {view === "cuentas" && <CuentasTable />}
    </div>
  );
}
