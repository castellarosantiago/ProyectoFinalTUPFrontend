import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Category, CategoryPayload } from "../types/category";
import { CategoryService } from "../services/category.service";

const initialForm: CategoryPayload = { name: "", description: "" };

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryPayload>(initialForm);

  // carga las cateogrias al iniciar
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // abre el modal para nueva o editar
  const handleOpenModal = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setCurrentCategory(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  // guarda lso cambios
  const handleSave = async () => {
    try {
      if (currentCategory) {
        await CategoryService.update(currentCategory._id, formData);
        toast.success("Categoría actualizada correctamente");
      } else {
        await CategoryService.create(formData);
        toast.success("Categoría creada correctamente");
      }
      setIsModalOpen(false);
      loadCategories(); // Recargar la lista
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la categoría");
    }
  };

  // elimina una categoria
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await CategoryService.delete(id);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success("Categoría eliminada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la categoría");
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-base-200">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center p-4">Cargando...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="text-center p-4">No hay categorías registradas</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover">
                  <td className="font-bold">{cat.name}</td>
                  <td className="opacity-75">{cat.description}</td>
                  <td className="flex justify-center gap-2">
                    <button 
                      className="btn btn-sm btn-ghost text-info"
                      onClick={() => handleOpenModal(cat)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {currentCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">Nombre</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="form-control">
                <label className="label">Descripción</label>
                <textarea 
                  className="textarea textarea-bordered"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}