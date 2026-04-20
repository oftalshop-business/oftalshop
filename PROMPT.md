Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

Crea estos 2 modulos completos:

=== MODULO INFORMES ===
Archivo: /src/app/(admin)/informes/page.tsx
- Tabs superiores: Ventas, Clientes, Inventario, Marketing
- TAB VENTAS:
  * Gráfico de líneas: ventas por fecha (usar recharts)
  * Filtros: Por producto, Por cliente, Por canal, Por fecha
  * Cards métricas: Total ventas, Promedio por pedido, Pedidos totales
  * Tabla resumen con datos de ejemplo
- TAB CLIENTES:
  * Gráfico barras: Clientes nuevos vs Recurrentes
  * Card: Valor de vida del cliente (LTV)
  * Mapa/tabla: Ubicación de clientes por ciudad
- TAB INVENTARIO:
  * Resumen de inventario: total productos, stock bajo, sin stock
  * Gráfico: Inventario por producto
  * Tabla: Rotación de inventario con columnas producto, vendidos, stock actual
- TAB MARKETING:
  * Filtros: Uso de descuentos, Rendimiento campañas, Conversión por canal
  * Gráficos correspondientes a cada filtro
  * Tabla de rendimiento

=== MODULO CONFIGURACION ===
Archivo: /src/app/(admin)/configuracion/page.tsx
- Layout: lista de secciones al lado izquierdo + contenido derecho
- Secciones funcionales con formularios editables:
  * Información de la tienda: nombre, email, teléfono, dirección, moneda, zona horaria
  * Idiomas: idioma principal, idiomas secundarios
  * Pagos: conectar Stripe (input API key), conectar MercadoPago, conectar PayPal, métodos manuales
  * Envíos y entrega: zonas de envío, tarifas, envío gratis desde monto X
  * Usuarios y permisos: tabla de usuarios con rol, botón agregar usuario, roles: Admin/Staff/Bodega
  * Seguridad: cambiar contraseña, autenticación 2 factores
  * Notificaciones: toggles para email de nuevo pedido, pedido enviado, stock bajo, nuevo cliente
- Cada sección con botón Guardar cambios
- Conectado a Supabase tablas correspondientes

Requisitos:
- Instalar recharts: npm install recharts
- Layout idéntico a Shopify
- TypeScript sin errores
- Datos de ejemplo realistas
- Iconos lucide-react

Genera los 2 archivos completos.