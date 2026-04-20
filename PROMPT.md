Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

Crea estos 4 modulos completos:

=== MODULO CLIENTES ===
Archivo: /src/app/(admin)/clientes/page.tsx
- Tabla: checkbox, Nombre, Email, Pedidos, Total gastado, Ubicación, Fecha registro
- Botón "Agregar cliente" abre modal con campos: nombre, email, teléfono, dirección
- Por fila: Editar y Eliminar con confirmación
- Búsqueda de clientes
- 5 clientes de ejemplo
- Conectado a Supabase tabla clientes_tienda

=== MODULO CONTENIDO ===
Archivo: /src/app/(admin)/contenido/page.tsx
- Secciones: Páginas, Blog, Archivos, Menú de navegación
- Botones: Agregar página, Crear artículo, Subir archivo, Editar menú
- Tabla de páginas con: Título, Visibilidad, Fecha, acciones Editar/Eliminar
- Modal crear página: título, contenido rich text, visibilidad
- Modal crear artículo: título, contenido, imagen destacada

=== MODULO DESCUENTOS ===
Archivo: /src/app/(admin)/descuentos/page.tsx
- Tabla: Código, Tipo, Valor, Usos, Estado, Fechas
- Botón "Crear descuento" abre modal con:
  * Código (o generar automático)
  * Tipo: Porcentaje o Monto fijo
  * Valor
  * Fecha inicio y fin
  * Límite de usos
- Por fila: Editar y Eliminar
- Conectado a Supabase tabla descuentos

=== MODULO MARKETING ===
Archivo: /src/app/(admin)/marketing/page.tsx
- Cards superiores: Email Marketing, Redes Sociales, Anuncios
- Cada card con botón Configurar que abre modal de configuración
- Botón "Crear campaña" abre modal: nombre, tipo, fechas, presupuesto
- Tabla de campañas: Nombre, Tipo, Estado, Alcance, Conversión, acciones Editar/Eliminar

Requisitos para todos los módulos:
- Layout idéntico a Shopify: sidebar oscuro + topbar + fondo gris
- Modales funcionales con formularios completos
- Iconos de lucide-react
- TypeScript estricto sin errores
- Datos de ejemplo en cada módulo

Genera los 4 archivos completos.