import { useEffect, useState } from "react";
import CrearEmpleadoForm from "./CrearEmpleadoForm";
import "./empleados.css";

export default function EmpleadosTable() {
  const [empleados, setEmpleados] = useState(null);
  const [editando, setEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cuentasEditando, setCuentasEditando] = useState({});

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const res = await fetch("https://gestor-accounts-production.up.railway.app/api/empleados-cuentas");
      const data = await res.json();

      const empleadosAgrupados = data.reduce((acc, emp) => {
        const existe = acc.find(e => e.nombre === emp.nombre);
        const cuenta = emp.servicio
          ? { id_cuenta: emp.id_cuenta, servicio: emp.servicio, cbu: emp.cbu, titular: emp.titular, id_empleado: emp.id_empleado }
          : null;

        if (existe) {
          if (cuenta) existe.cuentas.push(cuenta);
        } else {
          acc.push({ nombre: emp.nombre, cuentas: cuenta ? [cuenta] : [] });
        }

        return acc;
      }, []);

      setEmpleados(empleadosAgrupados);
    } catch (err) {
      console.error("Error al obtener empleados con cuentas:", err);
    }
  };

  const iniciarEdicion = (empleado) => {
    setEditando(empleado.nombre);
    setNombreEditado(empleado.nombre);
  };

  const guardarEdicion = async () => {
    try {
      await fetch(`https://gestor-accounts-production.up.railway.app/api/empleados`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreEditado }),
      });
      setEditando(null);
      obtenerEmpleados();
    } catch (err) {
      console.error("Error al actualizar empleado:", err);
    }
  };

  const editarCuenta = (id, field, value) => {
    setCuentasEditando(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const guardarCuenta = async (cuenta) => {
    try {
      const datos = cuentasEditando[cuenta.id_cuenta];
      await fetch(`https://gestor-accounts-production.up.railway.app/api/cuentas/${cuenta.id_cuenta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicio: datos.servicio,
          cbu: datos.cbu,
          titular: datos.titular,
          id_empleado: cuenta.id_empleado
        })
      });
      const updated = { ...cuentasEditando };
      delete updated[cuenta.id_cuenta];
      setCuentasEditando(updated);
      obtenerEmpleados();
    } catch (err) {
      console.error("Error al actualizar cuenta:", err);
    }
  };

  return (
    <div className="empleados-container">
      <h2 className="titulo">📋 Empleados</h2>
      <button className="crear-btn" onClick={() => setMostrarModal(true)}>➕ Crear Empleado</button>

      <div className="tabla-wrapper">
        {empleados ? (
          <table className="tabla-empleados">
            <thead>
              <tr>
                <th>👤 Nombre</th>
                <th>🏦 Cuentas Asociadas</th>
                <th>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length > 0 ? (
                empleados.map((emp, index) => (
                  <tr key={index}>
                    <td>
                      {editando === emp.nombre ? (
                        <input
                          value={nombreEditado}
                          onChange={(e) => setNombreEditado(e.target.value)}
                          className="input-edit"
                        />
                      ) : (
                        <span className="nombre-empleado">{emp.nombre}</span>
                      )}
                    </td>
                    <td>
                      {emp.cuentas.length > 0 ? (
                        <div className="lista-cuentas">
                          {emp.cuentas.map((cuenta, idx) => {
                            const isEditing = !!cuentasEditando[cuenta.id_cuenta];
                            return (
                              <div key={idx} className="cuenta-item">
                                {isEditing ? (
                                  <>
                                    <div className="dato-cuenta">
                                      📱 <input value={cuentasEditando[cuenta.id_cuenta]?.servicio || ""} onChange={(e) => editarCuenta(cuenta.id_cuenta, 'servicio', e.target.value)} />
                                    </div>
                                    <div className="dato-cuenta">
                                      🏦 <input value={cuentasEditando[cuenta.id_cuenta]?.cbu || ""} onChange={(e) => editarCuenta(cuenta.id_cuenta, 'cbu', e.target.value)} />
                                    </div>
                                    <div className="dato-cuenta">
                                      👤 <input value={cuentasEditando[cuenta.id_cuenta]?.titular || ""} onChange={(e) => editarCuenta(cuenta.id_cuenta, 'titular', e.target.value)} />
                                    </div>
                                    <button className="btn guardar" onClick={() => guardarCuenta(cuenta)}>💾</button>
                                  </>
                                ) : (
                                  <>
                                    <div className="dato-cuenta">
                                      📱 <span><strong>Servicio:</strong> {cuenta.servicio}</span>
                                    </div>
                                    <div className="dato-cuenta">
                                      🏦 <span><strong>CBU:</strong> {cuenta.cbu}</span>
                                    </div>
                                    <div className="dato-cuenta">
                                      👤 <span><strong>Titular:</strong> {cuenta.titular}</span>
                                    </div>
                                    <button className="btn editar" onClick={() => setCuentasEditando(prev => ({ ...prev, [cuenta.id_cuenta]: cuenta }))}>✏️</button>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : "—"}
                    </td>
                    <td>
                      {editando === emp.nombre ? (
                        <button className="btn guardar" onClick={() => guardarEdicion()}>💾</button>
                      ) : (
                        <button className="btn editar" onClick={() => iniciarEdicion(emp)}>✏️</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay empleados</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p className="cargando">Cargando empleados...</p>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="cerrar-modal" onClick={() => setMostrarModal(false)}>✖</button>
            <CrearEmpleadoForm onSuccess={() => {
              setMostrarModal(false);
              obtenerEmpleados();
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
