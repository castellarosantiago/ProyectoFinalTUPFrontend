const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-primary font-bold">Inciar Sesión</h2>
          
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="text" placeholder="ejemplo@correo.com" className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input type="password" placeholder="******" className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary w-full">Ingresar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;