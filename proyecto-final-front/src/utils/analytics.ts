import type { Sale } from '../types/sale';

//calcula los totales y promedios para el dashboard
export const calculateKPIs = (sales: Sale[]) => {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalTransactions = sales.length;
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0; // si no hay ventas no dividimos por 0

  return { totalRevenue, totalTransactions, averageTicket };
};

// agrupa las ventas por fecha para el gráfico de lineas
export const groupSalesByDate = (sales: Sale[]) => {
  const groups: Record<string, number> = {};

  sales.forEach((sale) => {
    // convierte la fecha a formato "DD/MM" para agrupar
    const dateObj = new Date(sale.date);
    const dateKey = dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

    if (!groups[dateKey]) {
      groups[dateKey] = 0;
    }
    groups[dateKey] += sale.total;
  });

  // convierte el objeto a un array de {date, amount} para el grafico con chartjs
  return Object.keys(groups).map((key) => ({
    date: key,
    amount: groups[key],
  }));
};

// obtiene los 5 productos más vendidos para el grafico de barras
export const getTopProducts = (sales: Sale[]) => {
  const productCount: Record<string, number> = {};

  sales.forEach((sale) => {
    sale.detail.forEach((item) => {
      const productName = item.name;

      if (!productCount[productName]) {
        productCount[productName] = 0;
      }
      productCount[productName] += item.amountSold;
    });
  });

  // los ordena de mayor a menor y devuelve los primeros 5
  return Object.keys(productCount)
    .map((key) => ({
      name: key,
      quantity: productCount[key],
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
};

// ventas registras en la ultima semana
export const getSalesLastWeek = (sales: Sale[]) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // filtra las ventas cuya fecha sea mayor o igual a hace 7 días
  return sales.filter((sale) => new Date(sale.date) >= sevenDaysAgo).length;
};
