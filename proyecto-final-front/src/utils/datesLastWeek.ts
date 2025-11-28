// Calcula las fechas de inicio y fin (hace 7 días hasta hoy) en formato YYYY-MM-DD
//para ser usadas como parámetros de query en la API de ventas.

export const getDatesForLastWeek = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return {
        startDate: formatDate(startDate),
        endDate: formatDate(today) 
    };
};
