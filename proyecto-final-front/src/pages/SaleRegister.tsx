import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Product } from "../types/product";
import type { SaleItem, SalePayload } from "../types/sale";
import { ProductService } from "../services/product.service";
import { SaleService } from "../services/sale.service";

//componentes hijos
import InventoryPanel from "../components/Sale/InventoryPanel";
import OrderTicket from "../components/Sale/OrderTicket";

export default function SalesRegister() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSaleItems, setCurrentSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // cargar inventario al montar el componente
  useEffect(() => {
    loadInventory();
  }, []);

  // logica para cargar inventario y buscar productos
  const loadInventory = async (searchParams: string = "") => {
    setLoading(true);
    try {
      if (searchParams.trim()) {
        const results = await ProductService.searchByName(searchParams);
        setProducts(Array.isArray(results) ? results : [results]);
      } else {
        const data = await ProductService.getAll();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // logica para manejar la orden de venta actual
  
  const addItemToOrder = (product: Product) => {
    if (product.stock <= 0) return;

    setCurrentSaleItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product._id === product._id);

      if (existingItem) {
        // aumentar cantidad
        if (existingItem.quantity + 1 > product.stock) {
          toast.warning(`Stock límite alcanzado para: ${product.name}`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // agregar nuevo item
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId: string) => { // eliminar item de la orden
    setCurrentSaleItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => { // actualizar cantidad de un item
    if (newQty < 1) return;
    
    setCurrentSaleItems((prevItems) => {
      const item = prevItems.find((i) => i.product._id === productId);
      // validar stock
      if (item && newQty > item.product.stock) {
         toast.error(`Stock insuficiente. Máximo disponible: ${item.product.stock}`);
         return prevItems; 
      }
      return prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const handleCancelOrder = () => {
    if (currentSaleItems.length > 0 && window.confirm("¿Vaciar orden actual?")) {
      setCurrentSaleItems([]);
    }
  };

  // guardar venta
  const handleRegisterSale = async () => {
    // calcula el total de la venta
    const totalAmount = currentSaleItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    
    if (currentSaleItems.length === 0) return;
    if (!window.confirm(`¿Confirmar venta por un total de $${totalAmount.toLocaleString()}?`)) return;

    setProcessing(true);
    try {
      // crea el payload para el backend
      const payload: SalePayload = {
        details: currentSaleItems.map((item) => ({
          product: item.product._id,
          amountSold: item.quantity,
        })),
      };

      // enviar al servicio de ventas
      await SaleService.create(payload);
      
      toast.success("Venta registrada correctamente");
      setCurrentSaleItems([]);
      loadInventory(); // recargar inventario para actualizar stocks
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error("Error: " + error.message);
      } else {
        toast.error("Ocurrió un error desconocido al procesar la venta");
      }
    } finally {
      setProcessing(false);
    }
  };


  return (
    <div className="max-w-6xl w-full">
      {/* titulo */}
      <div className="mb-6 border-b border-base-300 pb-4">
         <h1 className="text-3xl font-bold text-base-content">Punto de Venta</h1>
         <p className="text-sm text-base-content/70 mt-1">Registra salidas de inventario y nuevas ventas</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* catalogo del lado izquierdo */}
        <InventoryPanel 
          products={products}
          loading={loading}
          onSearch={(term) => loadInventory(term)}
          onAdd={addItemToOrder}
        />

        {/* venta y detalle del lado derecho */}
        <OrderTicket 
          items={currentSaleItems}
          processing={processing}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onCancel={handleCancelOrder}
          onConfirm={handleRegisterSale}
        />

      </div>
    </div>
  );
}