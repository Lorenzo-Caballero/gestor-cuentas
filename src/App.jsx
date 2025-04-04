import { useState } from "react";
import EmpleadosTable from "./EmpleadosTable";
import CuentasTable from "./CuentasTable";
import { FaUser, FaCreditCard, FaPlus } from "react-icons/fa6";
import CrearEmpleadoForm from "./CrearEmpleadoForm";
import CrearCuentaForm from "./CrearCuentaForm";

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
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleView("empleados")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaUser /> Empleados
        </button>
        <button
          onClick={() => handleView("cuentas")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaCreditCard /> Cuentas
        </button>
      </div>

      

      {view === "empleados" && <EmpleadosTable />}
      {view === "cuentas" && <CuentasTable />}
    </div>
  );
}
