import { useEffect, useState } from "react";
import "./formulario.css";

export default function CrearCuentaForm({ onSuccess, onClose }) {
  const [empleados, setEmpleados] = useState([]);
  const [cbu, setCbu] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [servicio, setServicio] = useState("");
  const [titular, setTitular] = useState("");

  useEffect(() => {
    fetch("https://gestor-accounts-production.up.railway.app/api/obtener-empleados")
      .then((res) => res.json())
      .then((data) => setEmpleados(data.empleados || []));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://gestor-accounts-production.up.railway.app/api/cuentas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        servicio,
        titular,
        cbu,
        id_empleado: idEmpleado
      })
    })
      .then((res) => res.json())
      .then(() => {
        alert("Cuenta creada con éxito");
        setCbu("");
        setIdEmpleado("");
        setServicio("");
        setTitular("");
        onSuccess();
        onClose(); // cerrar modal
      })
      .catch(() => alert("Error al crear cuenta"));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <form className="formulario" onSubmit={handleSubmit}>
          <h2>Crear Cuenta</h2>

          <input
            type="text"
            placeholder="Servicio"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Titular"
            value={titular}
            onChange={(e) => setTitular(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="CBU"
            value={cbu}
            onChange={(e) => setCbu(e.target.value)}
            required
          />

          <select
            value={idEmpleado}
            onChange={(e) => setIdEmpleado(e.target.value)}
            required
          >
            <option value="">Asignar a empleado...</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>

          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}
