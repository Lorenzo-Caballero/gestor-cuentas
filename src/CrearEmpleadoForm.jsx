import { useState, useEffect } from "react";
import axios from "axios";
import "./formulario.css";

export default function CrearEmpleadoForm({ onSuccess }) {
  const [nombre, setNombre] = useState("");
  const [cuentas, setCuentas] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");
  const [crearNuevaCuenta, setCrearNuevaCuenta] = useState(false);
  const [servicio, setServicio] = useState("");
  const [cbu, setCbu] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (crearNuevaCuenta) {
        const res = await axios.post("https://gestor-accounts-production.up.railway.app/api/empleados", {
          nombre,
          servicio,
          cbu
        });
        onSuccess && onSuccess(res.data);
      } else {
        const res = await axios.post("https://gestor-accounts-production.up.railway.app/api/empleados", {
          nombre
        });

        if (cuentaSeleccionada) {
            await axios.post("https://gestor-accounts-production.up.railway.app/api/agregar-cuenta", {
                id_empleado: res.data.empleado.id_empleado,
                servicio,
                cbu
              });
              
        }

        onSuccess && onSuccess(res.data);
      }
    } catch (error) {
      console.error("Error al crear empleado:", error.response?.data || error.message);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>Crear Empleado</h2>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label>
        <input
          type="checkbox"
          checked={crearNuevaCuenta}
          onChange={() => {
            setCrearNuevaCuenta(!crearNuevaCuenta);
            setCuentaSeleccionada("");
          }}
        />
        Crear y asociar nueva cuenta
      </label>

      {crearNuevaCuenta ? (
        <>
          <label>Servicio:</label>
          <input value={servicio} onChange={(e) => setServicio(e.target.value)} required />

          <label>CBU:</label>
          <input value={cbu} onChange={(e) => setCbu(e.target.value)} required />
        </>
      ) : (
        <>
          <label>Asociar cuenta existente (opcional):</label>
          <select
            value={cuentaSeleccionada}
            onChange={(e) => setCuentaSeleccionada(e.target.value)}
          >
            <option value="">-- Ninguna --</option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.servicio} - {cuenta.cbu} (Titular: {cuenta.titular})
              </option>
            ))}
          </select>
        </>
      )}

      <button type="submit">Crear Empleado</button>
    </form>
  );
}
