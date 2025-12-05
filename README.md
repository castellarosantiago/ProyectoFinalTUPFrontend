# Documentación Frontend 🎨 - Sistema Integral de Gestión de Negocio

Frontend de la aplicación SIGN, un sistema completo para la gestión integral de negocios que permite administrar inventario, ventas, productos y categorías de manera eficiente.

**Deploy en Render:** https://proyectofinaltupfrontend.onrender.com

## Tecnologías Principales

- **React** con TypeScript
- **React Router** para navegación
- **DaisyUI** para componentes de interfaz
- **Tailwind CSS** para estilos
- **Context API** para gestión de estado global

## Estructura del Proyecto

```
src/
├── App.tsx                 # Configuración principal y rutas
├── components/             # Componentes reutilizables
│   ├── AdminRoute.tsx        # Protección de rutas por rol Admin
│   ├── ProtectedRoute.tsx    # HOC para protección de rutas
│   └── sale/              # Componentes del módulo de ventas
│       ├── InventoryPanel.tsx    # Panel de inventario con búsqueda
│       └── OrderTicket.tsx       # Ticket de orden en tiempo real
├── context/               # Contextos de React
│   └── AuthContext.tsx    # Gestión de autenticación y sesión
├── pages/                 # Páginas principales de la aplicación
│   ├── Dashboard.tsx           # Panel principal con estadísticas
│   ├── LoginPage.tsx          # Inicio de sesión
│   ├── RegisterPage.tsx       # Registro de usuarios
│   ├── Home.tsx               # Layout con navegación lateral
│   ├── ProfilePage.tsx        # Gestión de perfil de usuario
│   ├── ProductManager.tsx     # Gestión de inventario
│   ├── CategoriesManager.tsx  # Gestión de categorías
│   ├── SaleRegister.tsx       # Creación de ventas
│   ├── UsersManager.tsx       # Manejo de usuarios
│   └── SalesHistory.tsx       # Historial de ventas
├── services/              # Servicios para comunicación con API
│   ├── auth.service.ts         # Autenticación y registro
│   ├── product.service.ts      # CRUD de productos
│   ├── category.service.ts     # CRUD de categorías
│   ├── user.service.ts         # Gestión de usuarios
│   └── sale.service.ts         # Gestión de ventas
├── types/                 # Definiciones de tipos TypeScript
│   ├── user.ts           # Tipos de usuario y autenticación
│   ├── product.ts        # Tipos de productos (Product, ProductPayload)
│   ├── category.ts       # Tipos de categorías (Category, CategoryPayload)
│   └── sale.ts           # Tipos de ventas (Sale, SaleItem, SalePayload)
└── utils/                 # Funciones y utilidades compartidas
    ├── datesLastWeek.ts         # Cálculo de rangos de fechas
    ├── analytics.ts             # Métricas para gráficos
    └── salesCountLastWeek.ts    # Conteo de ventas por período
```

## Funcionalidades Principales

### Gestión de Ventas
- Registro de ventas con interfaz intuitiva de punto de venta
- Panel de inventario con búsqueda de productos en tiempo real
- Ticket de orden que calcula automáticamente subtotales y total
- Historial de ventas con filtrado por fechas
- Actualización automática de stock tras cada venta
- Paginación del historial
- Generación de reportes en PDF desde el Dashboard

### Administración
- Gestión completa de productos (CRUD)
- Gestión de categorías con descripción
- Gestión de usuarios de parte del Admin
- Dashboard con información general y métricas
- Reportes de ventas de la última semana

### Gestión de Perfil
- Edición de datos personales (nombre y email)
- Cambio de contraseña de forma segura
- Reautenticación automática después de actualizar datos

### Autenticación y Seguridad
- Sistema de login con autenticación JWT
- Rutas protegidas por autenticación mediante ProtectedRoute
- Control de roles (empleado/admin)
- Persistencia de sesión con localStorage
- Manejo de sesión: Login y logout con actualización de estado global

## Servicios API

La aplicación utiliza una arquitectura basada en servicios para la comunicación con el backend:

### AuthService
- **login**: Autenticación de usuarios con email y password
- **register**: Registro de nuevos usuarios con asignación de rol

### ProductService
- **getAll**: Obtener todos los productos del inventario
- **searchByName**: Búsqueda de productos por nombre
- **create**: Crear nuevo producto con categoría asignada
- **update**: Actualizar información de producto existente
- **delete**: Eliminar producto del sistema
- **getCategoriesForDropdown**: Obtener categorías para selección

### CategoryService
- **getAll**: Listar todas las categorías disponibles
- **create**: Crear nueva categoría con descripción
- **update**: Modificar categoría existente
- **delete**: Eliminar categoría del sistema

### SaleService
- **getAll**: Obtener historial de ventas
- **getAllFilter**: Obtener historial de ventas con filtros opcionales (startDate, endDate) y paginación
- **create**: Registrar nueva venta con detalle de productos
- **getById**: Obtener detalle de una venta específica

Todos los servicios implementan:
- Autenticación mediante tokens JWT (Bearer Token)
- Manejo de errores con mensajes descriptivos
- Validación de respuestas del backend
- Headers apropiados para cada tipo de petición

## Interfaz de Usuario

El sistema utiliza DaisyUI junto con Tailwind CSS para proporcionar una interfaz moderna y responsive, con componentes optimizados para la experiencia del usuario. Y estilos de alertas con react-toastify.

## Características Técnicas

- **TypeScript**: Tipado fuerte con interfaces para todos los modelos de datos
- **Componentes Protegidos**: Sistema de ProtectedRoute basado en Context API
- **Estado Global**: AuthContext para gestión centralizada de autenticación
- **Utilidades de Fecha**: Funciones para cálculos de rangos temporales (última semana)
- **Filtros Avanzados**: Sistema de filtrado de ventas por rango de fechas
- **Validación de Datos**: Payloads específicos para creación y actualización
- **Comunicación API**: Fetch con manejo de tokens de autorización
- **Generación de PDF**: Capacidad para generar reportes en formato PDF

## Páginas de la Aplicación

### Autenticación
- **LoginPage**: Formulario de inicio de sesión con validación de credenciales
- **RegisterPage**: Registro de nuevos usuarios con selección de rol (empleado/admin)

### Área Principal
- **Home**: Layout principal con navegación lateral, header y footer
  - Menú lateral con acceso a todas las secciones
  - Información del usuario actual
  - Opción de cerrar sesión
  - Acceso a perfil de usuario

- **Dashboard**: Panel de control principal
  - Bienvenida personalizada por usuario
  - Gráficos con métricas de ventas y productos vendidos
  - Accesos rápidos a funciones principales
  - Generación de reportes en PDF

### Gestión de Productos
- **ProductManager**: Administración completa del inventario
  - Búsqueda de productos por nombre
  - Creación y edición de productos
  - Asignación de categorías
  - Indicadores visuales de stock (bajo, medio, alto)
  - Eliminación de productos

- **CategoriesManager**: Gestión de categorías
  - CRUD completo de categorías
  - Tabla con listado de todas las categorías
  - Modal para crear/editar

### Módulo de Ventas
- **SaleRegister**: Punto de venta (POS)
  - Panel de inventario con búsqueda en tiempo real
  - Carrito de compra interactivo
  - Cálculo automático de totales
  - Validación de stock disponible
  - Confirmación y registro de venta

- **SalesHistory**: Historial completo de ventas
  - Filtrado por rango de fechas (por defecto últimos 7 días)
  - Tabla con detalles de cada venta
  - Total general de ventas filtradas
  - Contador de ventas encontradas
  - Información del vendedor por cada transacción

### Gestión de Usuarios
- **UsersManager**: Administración de usuarios (Solo Admins)
  - Tabla de usuarios con su información detallada
  - Opciones de modificación y eliminación
  - Uso restringido solo para Admins

- **ProfilePage**: Gestión de perfil personal
  - Edición de nombre completo y email
  - Cambio de contraseña con confirmación
  - Validación de contraseñas coincidentes
  - Reautenticación automática tras actualización
  - Formulario protegido con autenticación JWT

## Instalación

``` bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
