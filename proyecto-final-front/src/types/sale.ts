import type { Product } from './product';

export interface SaleItem {
  product: Product; // objeto completo del producto
  quantity: number;
}

export interface SaleDetailPayload {
  product: string; // ID del producto 
  amountSold: number;
}

export interface SalePayload {
  details: SaleDetailPayload[]; // el controlador espera un array llamado 'details'
}

export interface SaleDetailFromDB {
  //venta ya procesada y guardada
  product: string; // id del producto
  name: string; // nombre
  amountSold: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  date: string; // fecha en formato texto ISO "2023-10-25T14:00:00Z
  user: string | { _id: string; name: string; email: string; role: string }; // puede ser ID o objeto populado
  detail: SaleDetailFromDB[]; // lista de productos vendido
  total: number;
}


export interface SaleFilterParams {
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string;   // Formato YYYY-MM-DD 
  page:number;
  limit:number;
}

// Tipos para el estado del formulario de filtros
export interface FilterState {
  startDate: string;
  endDate: string;
  page: number;      
  limit: number;     
}

// Respuesta esperada del backend con paginación
export interface PaginatedSalesResponse {
  sales: Sale[];
  totalCount: number; 
  totalPages: number;  
  currentPage: number;
}