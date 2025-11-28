import { getDatesForLastWeek } from "./datesLastWeek";

// Llama a GET /api/sales?startDate=...&endDate=... y retorna el conteo.

export const getSalesCountLastWeek = async (API_URL_SALES:string): Promise<number> => {
    const { startDate, endDate } = getDatesForLastWeek();
    const url = `${API_URL_SALES}?startDate=${startDate}&endDate=${endDate}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }
        const data = await res.json();
        return Array.isArray(data.sales) ? data.sales.length : 0;
    } catch (error) {
        console.error("Error al obtener el conteo de ventas de la última semana:", error);
        return -1;
    }
};