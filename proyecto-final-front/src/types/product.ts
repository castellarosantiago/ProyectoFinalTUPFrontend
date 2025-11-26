export interface Product {
  _id: string;
  id_category: string;
  name: string;
  price: number;
  stock: number;
}

// creamos o editamos sin el _id
export interface ProductPayload {
  id_category: string;
  name: string;
  price: number;
  stock: number;
}