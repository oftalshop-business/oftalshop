Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

MODULO: PRODUCTOS COMPLETO

Archivos a crear:

1. /src/app/(admin)/productos/page.tsx
- Layout Shopify: sidebar + topbar + contenido gris
- Tabs: Todos, Activos, Borrador, Archivados
- Tabla con checkbox, Imagen, Título, Estado badge, Inventario, Tipo, Proveedor, Precio
- Botón "Agregar producto" que navega a /admin/productos/nuevo
- Opción por fila: Editar, Eliminar con confirmación
- Búsqueda de productos
- Datos de ejemplo con 5 productos

2. /src/app/(admin)/productos/nuevo/page.tsx
- IDENTICO a Shopify agregar producto:
- Topbar: "Producto no guardado" + botones Descartar y Guardar
- Columna izquierda (70%):
  * Título (input)
  * Descripción (editor rich text con TipTap: negrita, cursiva, listas, links, imágenes)
  * Multimedia: zona drag and drop para subir imágenes y videos a Supabase Storage
  * Precio / Precio comparado / Costo por artículo / Margen (calculado automático)
  * Inventario: SKU, Código de barras, Track quantity checkbox, Stock
  * Envío: requiere envío checkbox, Peso
  * Variantes: agregar opciones como Talla, Color con valores
  * SECCION OPTICA ESPECIAL:
    - Materiales de luna: lista con botón "Agregar material"
    - Tratamientos: lista dinámica con botón "Agregar tratamiento"
    - Medidas: opción Manual (tabla de valores) o Foto (subir imagen)
- Columna derecha (30%):
  * Estado: Activo / Borrador / Archivado
  * Canales de venta: Tienda online checkbox
  * Organización: Tipo de producto, Proveedor, Colecciones, Tags
  * Plantilla de tema: selector
- Todo conectado a Supabase tablas: productos, variantes, medias, materiales_luna, tratamientos, medidas_producto

3. /src/app/(admin)/productos/[id]/page.tsx
- Igual que nuevo pero carga datos existentes para editar

Genera los 3 archivos completos listos para usar.