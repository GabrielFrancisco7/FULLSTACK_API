import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Activity } from "../types";
//import { categories } from "../data/categories";
// import { useMemo, Dispatch } from "react"; 
import { ActivityActions } from "../reducers/activity-reducers";
import { Dispatch } from "react";


type ActivityListProps = {
  activities: Activity[];
  dispatch: Dispatch<ActivityActions>;
  onPrint: (id: string) => void; // se añadió esta prop
};

export default function ActivityList({ activities, dispatch, onPrint }: ActivityListProps) {
  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.id} className="bg-gray-200 p-4 rounded-lg">
          <p>
            <strong>
              {activity.category === 1 ? "Automóvil" : "Camioneta"}
            </strong>
          </p>
          <p>Hora de entrada: {activity.calories}</p>
          <p>Hora de salida: {activity.name}</p>
          <p>Placas: {activity.placas}</p>
          <p>Color: {activity.color}</p>
          <p>Espacio: {activity.espacio}</p>

          {/* Botón de editar */}
          <button
            onClick={() => {
              dispatch({
                type: "set-activity",
                payload: { id: activity.id }
              });
            }}
            className="text-blue-500 hover:text-blue-700 mt-2"
          >
            <PencilSquareIcon className="w-6 h-6 inline" />
            Editar
          </button>

          {/* Botón de imprimir ticket (solo si tiene hora de salida y entrada) */}
          {activity.calories.trim() !== "" && activity.name.trim() !== "" && (
            <button
              onClick={() => onPrint(activity.id)}
              className="text-green-600 hover:text-green-800 mt-2 ml-4"
            >
              🧾 Imprimir Ticket
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
