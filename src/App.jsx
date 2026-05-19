import { useEffect, useState } from 'react'

function App() {
  const [activos, setActivos] = useState([])

  // Función para pedir datos al servidor (Puerto 3000)
  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/dashboard')
      const data = await res.json()
      setActivos(data)
    } catch (error) {
      console.error("Error cargando datos:", error)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Gestión de Activos IT</h2>
      
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Mantenimiento ($)</th>
                <th>Estado</th>
                <th>Acción Sugerida</th>
              </tr>
            </thead>
            <tbody>
              {activos.map(a => (
                <tr key={a.id}>
                  <td>{a.nombre}</td>
                  <td>${a.gastoMantenimiento}</td>
                  <td>{a.porcentajeUsoMantenimiento}% del valor</td>
                  <td>
                    <span className={`badge ${a.decision === 'RENOVAR' ? 'bg-danger' : 'bg-success'}`}>
                      {a.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App