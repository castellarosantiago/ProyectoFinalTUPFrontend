export interface Category { // datos que vienen de la base de datos
  _id: string;
  name: string;
  description: string;
}

export interface CategoryPayload { // datos que el usuario ingresa al formulario, no tiene id porque mongo lo crea despues
  name: string;
  description: string;
}