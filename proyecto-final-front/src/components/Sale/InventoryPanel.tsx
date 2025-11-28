import React from "react";
import type { Product } from "../../types/product";

interface InventoryPanelProps {
  products: Product[];
  loading: boolean;
  onSearch: (term: string) => void;
  onAdd: (product: Product) => void;
}

export default function InventoryPanel({ products, loading, onSearch, onAdd }: InventoryPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState(""); // estado local para la busqueda

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="lg:w-3/5 flex flex-col gap-4 h-full">
      {/* barra de Herramientas */}
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        <div>
          <h2 className="text-lg font-bold text-base-content">Catálogo</h2>
          <p className="text-xs text-base-content/60">Selecciona productos</p>
        </div>
        <form onSubmit={handleSubmit} className="join shadow-sm">
          <input 
            className="input input-sm input-bordered join-item w-full md:w-64 focus:input-primary" 
            placeholder="Buscar producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-neutral join-item">Buscar</button>
        </form>
      </div>

      {/* tabla para visualizar los productos */}
      <div className="flex-1 overflow-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <table className="table table-sm table-pin-rows w-full">
          <thead className="bg-base-200 text-base-content uppercase text-xs font-bold">
            <tr>
              <th className="py-3 pl-4">Producto</th>
              <th className="py-3 text-right">Precio</th>
              <th className="py-3 text-center">Stock</th>
              <th className="py-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {loading ? ( 
              <tr><td colSpan={4} className="text-center p-8 text-base-content/50">Cargando inventario...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-8 opacity-50">No se encontraron productos.</td></tr>
            ) : (
              products.map((prod) => (
                <tr key={prod._id} className="hover:bg-base-200/50 group transition-colors">
                  <td className="pl-4">
                    <div className="font-bold text-sm">{prod.name}</div>
                    <div className="text-xs opacity-50 font-mono">{prod._id.slice(-6)}</div>
                  </td>
                  <td className="text-right font-mono font-medium">${prod.price}</td>
                  <td className="text-center">
                    <span className={`badge badge-sm ${prod.stock > 10 ? 'badge-ghost' : prod.stock > 0 ? 'badge-warning' : 'badge-error text-white'} font-mono`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      disabled={prod.stock <= 0}
                      onClick={() => onAdd(prod)}
                    >
                      {prod.stock > 0 ? "Agregar" : "Agotado"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}