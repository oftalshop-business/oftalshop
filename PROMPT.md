Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

TAREA: Editor visual de tienda completo + arquitectura multitenant.

=== ARCHIVO 1: /src/app/(admin)/tienda/personalizar/page.tsx ===
Editor visual IDENTICO a Shopify - completamente funcional:

ESTRUCTURA:
- Layout de 2 paneles: izquierdo 320px + derecho resto
- Topbar: botón volver, nombre tema editable, botones Desktop/Tablet/Mobile, botón Guardar (verde), botón Publicar

PANEL IZQUIERDO (fondo blanco, scroll independiente):
- Selector de página: Inicio / Producto / Colección / Carrito
- Lista de secciones con drag and drop (usar array con índices):
  Cada sección tiene: icono drag, nombre, botón editar (lápiz), botón eliminar (X)
  
  Secciones disponibles para agregar:
  * Anuncio superior (barra de texto)
  * Header/Navegación (logo, menú, carrito)
  * Banner hero (imagen, título, subtítulo, botón CTA)
  * Colecciones destacadas
  * Productos destacados (conectado a tabla productos del tenant)
  * Texto con imagen (izquierda/derecha)
  * Video (URL YouTube/Vimeo)
  * Testimonios
  * Galería de imágenes
  * Newsletter/Suscripción
  * Mapa/Ubicación
  * Footer

  Botón "+ Agregar sección" que abre panel lateral con lista de secciones disponibles

- Al hacer click en sección se expande panel de edición con sus opciones:
  * Banner hero: subir imagen (Supabase Storage), título, subtítulo, texto botón, link botón, altura (S/M/L/XL), alineación contenido, opacidad overlay, color overlay
  * Productos destacados: seleccionar colección (dropdown con colecciones del tenant), número de productos (4/8/12), mostrar precio (toggle), mostrar botón agregar (toggle)
  * Texto con imagen: textarea texto, subir imagen, posición imagen (izquierda/derecha), botón CTA
  * Testimonios: agregar/editar/eliminar testimonios con nombre, cargo, texto, rating
  * Header: subir logo, links de navegación editables, mostrar búsqueda (toggle), mostrar carrito (toggle)
  * Footer: texto empresa, links columna 1/2/3, redes sociales

TAB CONFIGURACIÓN DEL TEMA:
  * Colores: primario, secundario, acento, fondo, texto, encabezados (color pickers HTML)
  * Tipografía: selector fuente títulos, selector fuente cuerpo (Google Fonts: Inter, Playfair Display, Montserrat, Raleway, Lato, Oswald, Merriweather)
  * Espaciado: compacto/normal/amplio
  * Bordes: sin bordes/redondeados/muy redondeados
  * Logo: subir imagen
  * Favicon: subir imagen

PANEL DERECHO (preview en vivo):
- Muestra iframe o componente React que renderiza la tienda
- Cambia tamaño según Desktop(100%)/Tablet(768px)/Mobile(375px)
- Se actualiza en tiempo real con cada cambio del panel izquierdo
- Muestra datos reales del tenant: sus productos, su logo, sus colores

Al guardar: guarda en Supabase tabla configuracion_tienda con tenant_id

=== ARCHIVO 2: /src/components/store/StorePreview.tsx ===
Componente de preview de la tienda:
- Recibe como props: secciones[], colores{}, tipografia{}, productos[], tenant
- Renderiza cada sección según su tipo y configuración
- Usa los colores y fuentes configurados via CSS variables
- Muestra productos reales del tenant desde Supabase
- Responsive según el tamaño seleccionado

=== ARCHIVO 3: /src/lib/tenant.ts ===
Utilidades multitenant:
- getCurrentTenant(): obtiene tenant_id del usuario autenticado desde Supabase Auth
- getTenantConfig(): obtiene configuracion_tienda del tenant actual
- Todas las queries de Supabase deben filtrar por tenant_id
- Hook useTenant() para usar en componentes React

=== ARCHIVO 4: /src/middleware.ts ===
Middleware actualizado con multitenant:
- Lee el usuario autenticado
- Adjunta tenant_id a los headers de cada request
- Protege rutas /admin/* requiriendo autenticación
- Rutas públicas: /, /login, /registro, /recuperar

=== ARCHIVO 5: SQL Migration ===
SQL para ejecutar en Supabase:
- Agregar columna tenant_id a historias_clinicas si no existe
- Políticas RLS para todas las tablas filtrando por tenant_id
- Función get_tenant_id() que retorna el tenant del usuario autenticado

CREATE POLICY "tenant isolation" ON productos
FOR ALL USING (
  tenant_id = (
    SELECT tenant_id FROM usuarios 
    WHERE auth_user_id = auth.uid()
  )
);
Aplicar misma política a: variantes, medias, pedidos, clientes_tienda,
materiales_luna, tratamientos, medidas_producto, colecciones,
descuentos, configuracion_tienda, historias_clinicas

=== ARCHIVO 6: /src/app/[tenant]/page.tsx ===
Tienda pública multitenant actualizada:
- Lee el slug del tenant desde la URL
- Obtiene configuracion_tienda del tenant por slug
- Renderiza secciones guardadas en el editor
- Datos reales: productos, colecciones del tenant
- Si tenant no existe: página 404 personalizada
- Si tienda inactiva: página de mantenimiento con contraseña

Requisitos:
- Estado React para todas las ediciones del panel
- Preview en tiempo real sin guardar hasta click en Guardar
- TypeScript sin errores
- Iconos lucide-react
- Todo filtrado por tenant_id

Genera todos los archivos completos.