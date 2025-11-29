import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Product, ProductPayload } from "../types/product";
import { ProductService } from "../services/product.service";

// estado inicial del forumulario
const initialForm: ProductPayload = {
  id_category: "",
  name: "",
  price: 0,
  stock: 0,
};

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  // estado para las categorias en el select
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // estados dl modal y formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductPayload>(initialForm);

  // Carga inicial de datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // cargamos productos y categorias 
      const [prods, cats] = await Promise.all([
        ProductService.getAll(),
        ProductService.getCategoriesForDropdown()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // para no mostrar el id de la categoria sino su nombre
  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : "Sin Categoría";
  };

  // buscar productos
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await ProductService.searchByName(searchTerm);
      setProducts(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // abrir modal para nuevo o editar
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        id_category: product.id_category,
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    } else {
      setCurrentProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  // guardar crear o editar
  const handleSave = async () => {
    try {
      // Validación simple
      if (!formData.id_category) {
        toast.warning("Por favor selecciona una categoría");
        return;
      }

      if (currentProduct) {
        await ProductService.update(currentProduct._id, formData);
        toast.success("Producto actualizado correctamente");
      } else {
        await ProductService.create(formData);
        toast.success("Producto creado correctamente");
      }
      setIsModalOpen(false);
      loadData(); // recargamos los datos
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar");
    }
  };

  // eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await ProductService.delete(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el producto");
    }
  };

  return (
    <div className="max-w-6xl w-full">
      {/* encabezado y buscador */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-base-300 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Inventario</h1>
          <p className="text-sm text-base-content/70 mt-1">Gestiona tus productos y existencias</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto items-center">
          <form onSubmit={handleSearch} className="join w-full shadow-sm">
            <input
              className="input input-bordered join-item w-full md:w-64 focus:input-primary"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-neutral join-item">
              🔍
            </button>
          </form>
          <button className="btn btn-primary gap-2 shadow-lg shadow-primary/30" onClick={() => handleOpenModal()}>
            + Nuevo
          </button>
        </div>
      </div>

      {/* tabla */}
      <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm">
        <table className="table w-full">
          <thead className="bg-base-200 text-base-content uppercase text-sm font-semibold">
            <tr>
              <th className="py-4 pl-6">Producto</th>
              <th className="py-4">Categoría</th>
              <th className="py-4 text-right">Precio</th>
              <th className="py-4 text-center">Stock</th>
              <th className="py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center p-10 text-base-content/50">Cargando inventario...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-10 text-base-content/50">No hay productos registrados.</td></tr>
            ) : (
              products.map((prod) => (
                <tr key={prod._id} className="hover:bg-base-200/50 transition-colors">
                  <td className="font-bold pl-6 text-lg">{prod.name}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm font-medium">
                      {getCategoryName(prod.id_category)}
                    </span>
                  </td>
                  <td className="text-right font-mono text-base">${prod.price}</td>
                  <td className="text-center">
                    <span className={`badge ${prod.stock > 10 ? 'badge-success text-white' : prod.stock > 0 ? 'badge-warning' : 'badge-error text-white'} font-bold`}>
                      {prod.stock} u.
                    </span>
                  </td>
                  <td className="flex justify-center gap-2 py-3">
                    <button
                      className="btn btn-sm btn-square btn-ghost text-info tooltip"
                      data-tip="Editar"
                      onClick={() => handleOpenModal(prod)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-square btn-ghost text-error tooltip"
                      data-tip="Eliminar"
                      onClick={() => handleDelete(prod._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* modal de forumalrio */}
      {isModalOpen && (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="modal-box w-11/12 max-w-2xl bg-base-100 shadow-2xl p-8 rounded-2xl">
            <h3 className="font-bold text-2xl text-center mb-6 border-b border-base-200 pb-4">
              {currentProduct ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* nombre */}
              <div className="form-control col-span-2">
                <label className="label font-semibold">Nombre del Producto</label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Laptop Gamer..."
                />
              </div>

              {/* seleccionar categoria */}
              <div className="form-control col-span-2">
                <label className="label font-semibold">Categoría</label>
                <select
                  className="select select-bordered w-full focus:select-primary"
                  value={formData.id_category}
                  onChange={(e) => setFormData({ ...formData, id_category: e.target.value })}
                >
                  <option value="" disabled>Selecciona una categoría...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* precio */}
              <div className="form-control">
                <label className="label font-semibold">Precio ($)</label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              {/* stock */}
              <div className="form-control">
                <label className="label font-semibold">Stock (Unidades)</label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered w-full focus:input-primary"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="modal-action mt-8 flex justify-end gap-3">
              <button className="btn btn-ghost hover:bg-base-200" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary px-8 shadow-lg shadow-primary/30" 
                onClick={handleSave}
                disabled={!formData.name || !formData.id_category}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}