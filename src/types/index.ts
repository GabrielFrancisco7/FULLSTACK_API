export type Category = {
    id : number;
    name : string;
}

export type Activity = {
  id: string;
  category: number;
  name: string;
  calories: string;
  color: string;     // 🟦 Nuevo campo: color del auto
  espacio: number;   // 🟧 Nuevo campo: espacio asignado (1 a 20)
};
