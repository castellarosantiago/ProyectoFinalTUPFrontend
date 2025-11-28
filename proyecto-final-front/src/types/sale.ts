import type { Product } from './product';

export interface SaleItem {
  product: Product; // objeto completo del producto
  quantity: number;
}

export interface SaleDetailPayload {
  product: string; // ID del producto (Ej: "64f1a...")
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
  user: string; // id del vendedor/usuario
  detail: SaleDetailFromDB[]; // lista de productos vendido
  total: number;
}


export interface SaleFilterParams {
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string;   // Formato YYYY-MM-DD 
}

// Tipos para el estado del formulario de filtros
export interface FilterState {
  startDate: string;
  endDate: string;
}