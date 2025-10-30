import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tarea, setTarea] = useState("");
  const [responsable, setResponsable] = useState("");
  const [fecha, setFecha] = useState("");
  const [datos, setDatos] = useState([]);
  const [indiceEditando, setIndiceEditando] = useState(null);

  {/* Cargar los datos de Laravel */}
  let cargarTareas = () => {
    fetch(`https://apiciaf.posnube.xyz/api/tareas`)
      .then(res => res.json())
      .then(resultado => {
        setDatos(resultado);
      });
  };

  {/* Agregar una nueva tarea*/}
  let agregarDatos = () => {
    if (!tarea || !responsable || !fecha) {
      alert("Llena todos los campos");
      return;
    }

    const url = `https://apiciaf.posnube.xyz/api/creart/${responsable}/${tarea}`;

    fetch(url)
      .then(res => res.json())
      .then(r => {
        if (r.estado === "ok") {
          cargarTareas();
          setTarea("");
          setResponsable("");
          if (indiceEditando !== null) {
            setIndiceEditando(null);
          }
        } else {
          alert(r.resp);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error de red al crear la tarea");
      });
  };

  {/* Eliminar una tarea por id */}
  let borrarDato = (id) => {
    fetch(`https://apiciaf.posnube.xyz/api/borrarT/${id}`)
      .then(res => res.json())
      .then(r => {
        if (r.estado === "ok") {
          cargarTareas();
        } else {
          alert(r.resp);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error al eliminar el dato");
      });
  };

  {/* Colocar los datos en los campos correspondientes */}
  let modificarDato = (id) => {
    const tareaSeleccionada = datos.find(t => t.id === id);
    if (!tareaSeleccionada) return;

    setTarea(tareaSeleccionada.NombreTarea || "");
    setResponsable(tareaSeleccionada.Resposable || "");
    setFecha("");
    setIndiceEditando(id);
  };

  {/* Modificar los datos */}
  const guardarCambios = () => {
    if (!tarea || !responsable || !fecha) {
      alert("Llena todos los campos");
      return;
    }

    const url = `https://apiciaf.posnube.xyz/api/editar/${indiceEditando}`;
    const data = { tarea, responsable, fecha };

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(r => {
      if (r.estado === "ok") {
        cargarTareas();
        setTarea("");
        setResponsable("");
        setIndiceEditando(null);
      } else {
        alert(r.resp);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error al modificar la tarea");
    });
  };

  {/* Cambiar estado de una tarea por id */}
  let cambiarEstado = (id, nuevoEstado) => {
    fetch(`https://apiciaf.posnube.xyz/api/estado/${id}/${nuevoEstado}`)
      .then(res => res.json())
      .then(r => {
        if (r.estado === "ok") {
          cargarTareas();
        } else {
          alert(r.resp);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error al cambiar el estado");
      });
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return (
    <>
      <div className="container mt-4">
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <label className="form-label">Nombre Tarea</label>
            <input
              type="text"
              className="form-control"
              value={tarea}
              onChange={(e) => setTarea(e.target.value)}
              placeholder="Tarea a Realizar"
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Responsable</label>
            <input
              type="text"
              className="form-control"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              placeholder="Quien Realiza"
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3 d-grid">
            <button
              onClick={indiceEditando === null ? agregarDatos : guardarCambios}
              className={`btn ${indiceEditando === null ? "btn-success" : "btn-warning"}`}
            >
              {indiceEditando === null ? "Agregar" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tarea</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((v, i) => (
                <tr key={v.id || i}>
                  <td>{v.id || 'Sin ID'}</td>
                  <td>{v.NombreTarea}</td>
                  <td>{v.Resposable}</td>
                  <td>
                    <span className={`badge ${
                      v.estado === 1 ? "bg-warning text-dark" :
                      v.estado === 2 ? "bg-success" :
                      v.estado === 3 ? "bg-danger" : "bg-info"
                    }`}>
                      {v.estado === 1 ? "Pendiente" :
                      v.estado === 2 ? "Realizado" :
                      v.estado === 3 ? "Cancelado" : "Desconocido"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-warning btn-sm flex-fill"
                          onClick={() => cambiarEstado(v.id, 1)}
                          disabled={v.estado === 1}
                        >
                          Pendiente
                        </button>
                        <button
                          className="btn btn-success btn-sm flex-fill"
                          onClick={() => cambiarEstado(v.id, 2)}
                          disabled={v.estado === 2}
                        >
                          Realizado
                        </button>
                        <button
                          className="btn btn-danger btn-sm flex-fill"
                          onClick={() => cambiarEstado(v.id, 3)}
                          disabled={v.estado === 3}
                        >
                          Cancelado
                        </button>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-warning btn-sm flex-fill"
                          onClick={() => modificarDato(v.id)}
                        >
                          Modificar
                        </button>
                        <button
                          className="btn btn-danger btn-sm flex-fill"
                          onClick={() => borrarDato(v.id)}
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;