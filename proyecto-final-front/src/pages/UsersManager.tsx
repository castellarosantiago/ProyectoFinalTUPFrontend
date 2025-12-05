import { useEffect, useState } from "react";
import type { UserGet } from "../types/user";
import { UserService } from "../services/user.service";
import type { UserUpdatePayload } from "../types/user";

// Estado inicial del formulario (vacío o con valores por defecto)
const initialForm: UserUpdatePayload = { name: "", email: "", role: "empleado" };

export default function UsersManager() {
  const [users, setUsers] = useState<UserGet[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estado del modal y formulario de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserGet | null>(null);
  const [formData, setFormData] = useState<UserUpdatePayload>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // para el estado de borrado

  // Carga los usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getAll(); 
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // Abre el modal para editar
  const handleOpenModal = (user: UserGet) => {
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role.toLowerCase() as 'empleado' | 'admin' });
    setIsModalOpen(true);
  };

  // Guarda los cambios del usuario (POST/PUT)
  const handleSave = async () => {
    if (!currentUser || !formData.name || !formData.email || !formData.role) return;

    setLoading(true);
    setError(null);

    try {
      // Solo enviamos los campos que queremos actualizar
      const updatePayload: UserUpdatePayload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      await UserService.update(currentUser._id, updatePayload);
      
      alert("Usuario actualizado correctamente.");
      setIsModalOpen(false);
      loadUsers(); // Recargar la lista
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al actualizar el usuario.";
      setError(message);
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };
  
  // Elimina un usuario
  const handleDelete = async (user: UserGet) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario: ${user.name}?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await UserService.delete(user._id);
      alert("Usuario eliminado correctamente.");
      loadUsers(); // Recargar la lista
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar el usuario.";
      setError(message);
      alert("Error: " + message);
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading && !isDeleting) {
    return (
      <div className="flex justify-center items-center h-full p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto">
      {/* Título y Acciones */}
      <div className="mb-6 border-b border-base-300 pb-4 flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-base-content">Gestión de Usuarios</h1>
            <p className="text-sm text-base-content/70 mt-1">Administración de las cuentas de usuario.</p>
         </div>
         {/* No hay botón para crear, ya que el registro se hace por separado */}
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-xl border border-base-200">
        <table className="table">
          <thead>
            <tr className="bg-base-200 text-base-content/80 text-sm">
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <tr><td colSpan={4} className="text-center p-8 opacity-50">No se encontraron usuarios.</td></tr>
            ) : (
                users.map((user) => (
                <tr key={user._id}>
                  <td className="font-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'Admin' ? 'badge-primary' : 'badge-ghost'} font-semibold`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2">
                    <button 
                        className="btn btn-xs btn-info btn-outline" 
                        onClick={() => handleOpenModal(user)}
                        disabled={isDeleting}
                    >
                        Editar
                    </button>
                    <button 
                        className="btn btn-xs btn-error btn-outline" 
                        onClick={() => handleDelete(user)}
                        disabled={isDeleting}
                    >
                        {isDeleting && currentUser?._id === user._id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {isModalOpen && currentUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Editar Usuario: **{currentUser.name}**
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Nombre */}
              <div className="form-control">
                <label className="label">Nombre</label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">Email</label>
                <input 
                  type="email" 
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Rol */}
              <div className="form-control">
                <label className="label">Rol</label>
                <select
                    name="role"
                    className="select select-bordered w-full"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'empleado' | 'admin'})}
                >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button 
                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                onClick={handleSave}
                disabled={loading}
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