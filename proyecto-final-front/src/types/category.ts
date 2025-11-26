export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
}