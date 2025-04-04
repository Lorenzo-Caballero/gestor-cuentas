import { useEffect, useState } from "react";
import "./cuentastable.css";

export default function CuentasTable() {
  const [cuentas, setCuentas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    servicio: "",
    titular: "",
    cbu: "",
    id_empleado: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [nuevaCuenta, setNuevaCuenta] = useState({
    servicio: "",
    titular: "",
    cbu: "",
    id_empleado: ""
  });

  useEffect(() => {
    obtenerCuentasYEmpleados();
  }, []);

  const obtenerCuentasYEmpleados = async () => {
    try {
      const resCuentas = await fetch("https://gestor-accounts-production.up.railway.app/api/cuentas-con-nombre");
      const dataCuentas = await resCuentas.json();
      setCuentas(dataCuentas);

      const resEmpleados = await fetch("https://gestor-accounts-production.up.railway.app/api/obtener-empleados");
      const dataEmpleados = await resEmpleados.json();
      setEmpleados(dataEmpleados.empleados || []);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleEditClick = (cuenta) => {
    setEditandoId(cuenta.id_cuenta);
    setFormData({
      servicio: cuenta.servicio,
      titular: cuenta.titular,
      cbu: cuenta.cbu,
      id_empleado: cuenta.id_empleado || ""
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await fetch(`https://gestor-accounts-production.up.railway.app/api/cuentas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      obtenerCuentasYEmpleados();
      setEditandoId(null);
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
    }
  };

  const handleNuevaCuentaChange = (e) => {
    setNuevaCuenta({ ...nuevaCuenta, [e.target.name]: e.target.value });
  };

  const handleCrearCuenta = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://gestor-accounts-production.up.railway.app/api/cuentas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevaCuenta,
          id_empleado: nuevaCuenta.id_empleado
        })
      });
      setShowModal(false);
      setNuevaCuenta({ servicio: "", titular: "", cbu: "", id_empleado: "" });
      obtenerCuentasYEmpleados();
    } catch (error) {
      console.error("Error al crear cuenta:", error);
    }
  };

  return (
    <div className="table-container">
      <h2 className="titulo">Lista de Cuentas</h2>

      <button className="crear-btn" onClick={() => setShowModal(true)}>
        Crear cuenta
      </button>

      <div className="tabla-wrapper">
        <table className="cuentas-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Titular</th>
              <th>CBU</th>
              <th>Empleado (nombre)</th>
              <th>Asignar a</th>
              <th>Acciones</th>
            </tr>
          </thead>
          {cuentas.map((cuenta) => {
            const mostrandoSelect = editandoId === `asignar-${cuenta.id_cuenta}`;

            return (
              <tr key={cuenta.id_cuenta}>
                <td>{cuenta.servicio}</td>
                <td>{cuenta.titular}</td>
                <td>{cuenta.cbu}</td>
                <td>{cuenta.nombre_empleado}</td>
                <td>
                  {mostrandoSelect ? (
                    <select
                      value={cuenta.id_empleado || ""}
                      onChange={async (e) => {
                        const nuevoId = e.target.value;
                        try {
                          await fetch(`https://gestor-accounts-production.up.railway.app/api/cuentas/${cuenta.id_cuenta}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...cuenta, id_empleado: nuevoId }),
                          });
                          obtenerCuentasYEmpleados();
                          setEditandoId(null);
                        } catch (error) {
                          console.error("Error al asignar empleado:", error);
                        }
                      }}
                      onBlur={() => setEditandoId(null)}
                    >
                      <option value="">Seleccionar empleado</option>
                      {empleados.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => setEditandoId(`asignar-${cuenta.id_cuenta}`)}
                    >
                      Asignar a
                    </span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditClick(cuenta)}>Editar</button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Crear Cuenta</h2>
              <button className="cerrar-btn" onClick={() => setShowModal(false)}>
                X
              </button>
            </div>
            <form className="formulario" onSubmit={handleCrearCuenta}>
              <input
                type="text"
                name="servicio"
                placeholder="Servicio"
                value={nuevaCuenta.servicio}
                onChange={handleNuevaCuentaChange}
                required
              />
              <input
                type="text"
                name="titular"
                placeholder="Titular"
                value={nuevaCuenta.titular}
                onChange={handleNuevaCuentaChange}
                required
              />
              <input
                type="text"
                name="cbu"
                placeholder="CBU"
                value={nuevaCuenta.cbu}
                onChange={handleNuevaCuentaChange}
                required
              />
              <select
                name="id_empleado"
                value={nuevaCuenta.id_empleado}
                onChange={handleNuevaCuentaChange}
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
      )}
    </div>
  );
}
