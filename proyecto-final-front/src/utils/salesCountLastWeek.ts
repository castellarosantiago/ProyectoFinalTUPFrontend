import { getDatesForLastWeek } from "./datesLastWeek";

// Llama a GET /api/sales?startDate=...&endDate=... y retorna el conteo.

export const getSalesCountLastWeek = async (API_URL_SALES:string): Promise<number> => {
    const { startDate, endDate } = getDatesForLastWeek();
    const url = `${API_URL_SALES}?startDate=${startDate}&endDate=${endDate}`;
    try {
        const token = localStorage.getItem('token') || '';
        const headers: Record<string,string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
        }
        const data = await res.json();
        return Array.isArray(data.sales) ? data.sales.length : 0;
    } catch (error) {
        console.error("Error al obtener el conteo de ventas de la última semana:", error);
        return -1;
    }
};