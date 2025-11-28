Los componentes se renderizan sin informacion del Back (hasta no tener el login y la autorizacion no podemo realizar peticiones)
Una vez que caste termine los componentes/paginas de login debemos incluirlas dentro de App y definir login como ruta principal.
Debemos proteger las rutas para que se vean solo si el usuario esta logeado y no mostrar ciertas funcionalidades si el usuario NO es admin.
Tambien debemos integrar la funcion de logout dentro del home.
Y por ultimo definir un tipo de estilo para mejorar visualmente la app.



B. Gestión del Login (Lo que falta)
La estructura con Home actuando como layout y usando React Router es ideal. El siguiente paso crucial es proteger las rutas.

Crea una ruta de Login: Agrega <Route path="/login" element={<Login />} /> en App.tsx.

Protege el Home: Usa un componente ProtectedRoute (o similar) que verifique si el usuario tiene una sesión activa (token/estado de autenticación). Si no está logeado, lo redirige a /login.

Estructura de Rutas con Protección (Conceptual):

<Routes>
    <Route path="/login" element={<Login />} />
    
    {/* Aplica la protección al layout principal y a todas sus subrutas */}
    <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />}>
            {/* Rutas protegidas: dashboard, categories, products, etc. */}
        </Route>
    </Route>
</Routes>