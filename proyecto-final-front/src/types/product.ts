export interface Product { // datos que vienen de la base de datos
  _id: string;
  id_category: string;
  name: string;
  price: number;
  stock: number;
}

// datos que el usuario ingresa al formulario, no tiene id porque mongo lo crea despues
export interface ProductPayload { 
  id_category: string;
  name: string;
  price: number;
  stock: number;
}