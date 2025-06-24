import { v4 as uuidv4 } from "uuid";
import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react";
import { ActivityActions, ActivityState } from "../reducers/activity-reducers";
import { categories } from "../data/categories";
import { Activity } from "../types";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; // Importación del ícono

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidv4(),
  category: 1,
  name: "",
  calories: "",
  placas: "",
  color: "",    // Nuevo campo
  espacio: 0,   // Nuevo campo (0 = ninguno seleccionado aún)
};


export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>({ ...initialState });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placas, setPlacas] = useState(""); // Estado para placas

 useEffect(() => {
  if (state.activeId) {
    const selectedActivity = state.activities.find(
      (stateActivity) => stateActivity.id === state.activeId
    );
    if (selectedActivity) {
      setActivity({ ...selectedActivity }); // fuerza re-render completo
      setPlacas(selectedActivity.placas || "");
    }
  } else {
    setActivity({ ...initialState, id: uuidv4() }); // por si se limpia el formulario
    setPlacas("");
  }
}, [state.activeId]);


  const isValidActivity = () => {
  // Si estás editando, solo necesitas que haya hora de salida
  if (state.activeId) {
    return activity.name.trim() !== "";
  }

  // Si es nuevo registro, se validan todos los campos como antes
  return (
    activity.calories.trim() !== "" &&
    activity.category &&
    placas.trim() !== "" &&
    activity.color.trim() !== "" &&
    activity.espacio !== 0
  );
};


  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    const isNumberField = id === "category";

    if (id === "placas") {
      setPlacas(value); // Cambiar placas cuando se actualiza el campo de placas
    } else {
      setActivity((prev) => ({
        ...prev,
        [id]: isNumberField ? +value : value,
      }));
    }

    // Desbloquear el botón si el usuario cambia algo
    setIsSubmitting(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // bloquear el botón inmediatamente

    // Asegúrate de incluir las placas en el objeto de actividad
    const activityToSave = { ...activity, placas };

    if (state.activeId) {
      // Si hay un activeId, se actualiza la actividad en lugar de agregar una nueva
      dispatch({
        type: "save-activity",
        payload: { newActivity: activityToSave },
      });
    } else {
      // Si no hay activeId, se crea una nueva actividad
      dispatch({
        type: "save-activity",
        payload: { newActivity: { ...activityToSave, id: uuidv4() } },
      });
    }

    // Reiniciar el formulario (el botón sigue deshabilitado)
    setActivity({
      ...initialState,
      id: uuidv4(),
    });
    setPlacas(""); // Reiniciar el estado de placas
  };

  const buttonText =
    activity.category === 1
      ? "Realizar registro de Automovil"
      : "Realizar registro de Camioneta";

  const camposCompletos =
  activity.category &&
  activity.calories.trim() !== "" &&
  placas.trim() !== "" &&
  activity.color.trim() !== "";


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white shadow p-10 rounded-lg"
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category">Tipo de vehiculo:</label>
        <select
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Hora de entrada:
        </label>
        <input
  id="calories"
  type="time"
  className="border border-slate-300 p-2 rounded-lg"
  value={activity.calories}
  onChange={handleChange}
  disabled={!!state.activeId} // Desactiva si estamos editando
/>


      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Hora de salida:
        </label>
        <input
  id="name"
  type="time"
  className="border border-slate-300 p-2 rounded-lg"
  value={activity.name}
  onChange={handleChange}
  disabled={!state.activeId} // Activa solo si estamos editando
/>


      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="placas" className="font-bold">
          Placas:
        </label>
        <input
          id="placas"
          type="text"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Ej: PRA-42-46"
          value={placas} // Usar el estado 'placas' aquí
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
  <label htmlFor="color" className="font-bold">Color del vehículo:</label>
  <input
    id="color"
    type="text"
    className="border border-slate-300 p-2 rounded-lg"
    placeholder="Ej: Rojo"
    value={activity.color}
    onChange={handleChange}
  />
</div>

<div className="grid grid-cols-1 gap-3">
  <label className="font-bold">Seleccionar espacio:</label>
  <div className="grid grid-cols-5 gap-2">
    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
      const ocupado = state.activities.some(
  (act) =>
    act.espacio === num &&
    act.id !== activity.id &&
    act.name.trim() === ""
);

      return (
        <button
  type="button"
  key={num}
  onClick={() => {
    if (!ocupado && camposCompletos && !state.activeId) {
      setActivity((prev) => ({ ...prev, espacio: num }));
    }
  }}
  className={`p-2 rounded-lg font-bold text-white ${
    ocupado
      ? "bg-red-500 cursor-not-allowed"
      : activity.espacio === num
      ? "bg-blue-500"
      : camposCompletos && !state.activeId
      ? "bg-green-500 hover:bg-green-600"
      : "bg-gray-400 cursor-not-allowed"
  }`}
  disabled={ocupado || !camposCompletos || !!state.activeId}
        >
          {num}
        </button>
      );
    })}
  </div>
</div>


      <input
  type="submit"
  className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-50"
  value={buttonText}
  disabled={!isValidActivity() || isSubmitting}
/>


      {/* Botón de editar */}
      
    </form>
  );
}
