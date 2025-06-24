import { useReducer, useState } from "react";
import Form from './Components/Form';
import ActivityList from "./Components/ActivityList";
import { activityReducer, initialState } from "./reducers/activity-reducers";
import { Activity } from "./types";

function App() {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  const [ticketsToPrint, setTicketsToPrint] = useState<Activity[]>([]);

  // Imprimir ticket individual y agregarlo a la lista
  const handlePrintTicket = (id: string) => {
    const activity = state.activities.find(act => act.id === id);
    if (activity && activity.name.trim() !== "") {
      const yaExiste = ticketsToPrint.some(t => t.id === activity.id);
      if (!yaExiste) {
        setTicketsToPrint(prev => [...prev, activity]);
      }
    }
  };

  // Eliminar ticket individual
  const handleDeleteTicket = (id: string) => {
    setTicketsToPrint(prev => prev.filter(t => t.id !== id));
  };

  // Volver a vista normal
  const handleBack = () => {
    setTicketsToPrint([]);
  };

  return (
    <>
      {ticketsToPrint.length > 0 ? (
        // ========== VISTA DE TICKETS ==========
        <div className="min-h-screen bg-white text-black p-10 space-y-6">
          <h1 className="text-2xl font-bold text-center">🎫 Tickets de Estacionamiento</h1>

          {ticketsToPrint.map((ticket) => (
            <div key={ticket.id} className="max-w-md mx-auto border p-5 rounded-lg shadow space-y-2 text-lg bg-gray-100">
              <p><strong>Tipo:</strong> {ticket.category === 1 ? 'Automóvil' : 'Camioneta'}</p>
              <p><strong>Hora de entrada:</strong> {ticket.calories}</p>
              <p><strong>Hora de salida:</strong> {ticket.name}</p>
              <p><strong>Placas:</strong> {ticket.placas}</p>
              <p><strong>Color:</strong> {ticket.color}</p>
              <p><strong>Espacio:</strong> {ticket.espacio}</p>
              <p><strong>Total a pagar:</strong> {calcularPrecio(ticket.calories, ticket.name)} MXN</p>

              <button
                onClick={() => handleDeleteTicket(ticket.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Imprimir todos
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Volver
            </button>
          </div>
        </div>
      ) : (
        // ========== VISTA NORMAL ==========
        <>
          {/* HEADER */}
          <header className="bg-black py-5">
            <div className="max-w-5xl mx-auto flex justify-between">
              <h1 className="text-center text-lg font-bold text-white uppercase">
                Estacionamiento EL JEFE
              </h1>
            </div>
          </header>

          {/* FORMULARIO */}
          <section className="bg-indigo-950 py-20 px-5">
            <div className="max-w-4xl mx-auto">
              <Form dispatch={dispatch} state={state} />
            </div>
          </section>

          {/* LISTA DE REGISTROS */}
          <section className="p-10 mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-5">
              Registro de Vehículos
            </h2>

            <div className="space-y-4">
              <ActivityList
                activities={state.activities}
                dispatch={dispatch}
                onPrint={handlePrintTicket}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function calcularPrecio(horaEntrada: string, horaSalida: string): string {
  try {
    const [hIn, mIn] = horaEntrada.split(":").map(Number);
    const [hOut, mOut] = horaSalida.split(":").map(Number);

    const entrada = hIn * 60 + mIn;
    const salida = hOut * 60 + mOut;
    const minutosTotales = Math.max(salida - entrada, 0);

    const horas = Math.ceil(minutosTotales / 60);
    const total = horas * 25;

    return `$${total}`;
  } catch {
    return "$0";
  }
}

export default App;
