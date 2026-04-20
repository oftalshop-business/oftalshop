Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

Crea el modulo TIENDA ONLINE completo:

=== ARCHIVO 1: /src/app/(admin)/tienda/page.tsx ===
Página principal de Tienda Online con estas secciones:

SECCION TEMA ACTUAL:
- Nombre del tema editable (input inline)
- Botones: Vista previa, Personalizar, Ver tienda
- Botón: Conectar dominio existente
- Botón: Administrar temas
- Botón: Ver páginas
- Botón: Editar preferencias

SECCION PLANTILLAS (6 plantillas):
Mostrar como grid de cards con imagen preview, nombre, precio y botón seleccionar/comprar

PLANTILLAS GRATIS (badge "Gratis"):
1. "Óptica Esencial" - diseño limpio y minimalista enfocado en conversión
2. "Clínica Confianza" - diseño médico profesional con colores azul y blanco
3. "LensShop" - ecommerce puro, catálogo prominente, alta conversión

PLANTILLAS PREMIUM (badge "$19 USD / S/65"):
4. "VisionPro" - inspirada en mejores ópticas del mundo, UX premium
5. "LuxOptic" - estilo Ray-Ban/Oakley, lujo y exclusividad
6. "MedCenter Pro" - para clínicas grandes, corporativo, confianza máxima

Cada plantilla premium: botón "Comprar S/65" que abre modal de pago
Cada plantilla gratis: botón "Usar plantilla" que la activa

=== ARCHIVO 2: /src/app/(admin)/tienda/personalizar/page.tsx ===
Editor visual IDENTICO a Shopify:

PANEL IZQUIERDO (300px, fondo blanco):
- Header: nombre del tema + botón guardar
- Tabs: Secciones / Configuración
- TAB SECCIONES lista de secciones arrastrables:
  * Header/Navegación
  * Banner principal (imagen hero)
  * Colección destacada
  * Productos destacados
  * Texto con imagen
  * Video
  * Testimonios
  * Newsletter
  * Footer
  * Botón "+ Agregar sección"
- Al hacer click en cada sección se expande panel de edición:
  * Banner: subir imagen, texto título, subtítulo, botón CTA, opacidad overlay
  * Productos: seleccionar colección, número de productos a mostrar
  * Texto: editor de texto, alineación, colores
  * Video: URL del video

TAB CONFIGURACION:
  * Colores: primario, secundario, acento, fondo, texto (color pickers)
  * Tipografía: selector fuente título, selector fuente cuerpo
  * Logo: subir imagen
  * Favicon: subir imagen

PANEL DERECHO (resto del ancho):
- Topbar del preview: botones Desktop / Mobile / Tablet
- Preview iframe que muestra la tienda en vivo
- La preview debe cambiar según las ediciones del panel izquierdo

=== ARCHIVO 3: /src/app/(admin)/tienda/preferencias/page.tsx ===
- Título de la tienda
- Meta descripción
- Redes sociales (links)
- Google Analytics ID
- Facebook Pixel ID
- Contraseña de la tienda (para poner en mantenimiento)
- Botón guardar conectado a Supabase tabla configuracion_tienda

=== ARCHIVO 4: /src/app/(admin)/tienda/dominios/page.tsx ===
- Input para ingresar dominio existente
- Instrucciones paso a paso para apuntar DNS
- Estado de verificación del dominio
- Botón verificar dominio

=== ARCHIVO 5: /src/app/[tenant]/page.tsx ===
Tienda pública del cliente:
- Lee configuracion_tienda de Supabase según tenant
- Renderiza las secciones guardadas en el editor visual
- Muestra productos de la tabla productos filtrados por tenant_id
- Header con logo y navegación
- Hero banner
- Grid de productos con imagen, nombre, precio, botón agregar al carrito
- Footer

=== ARCHIVO 6: /src/app/[tenant]/productos/[slug]/page.tsx ===
Página de producto individual:
- Galería de imágenes
- Nombre, precio, descripción
- Selector de variantes
- SECCION OPTICA: selector de Material, Tratamiento 1, Tratamiento 2
- SECCION MEDIDAS: mostrar tabla de medidas o imagen de referencia
- Botón agregar al carrito
- Productos relacionados

Requisitos generales:
- Layout admin identico a Shopify
- Editor visual con estado en React (useState)
- Preview que reacciona en tiempo real a cambios
- Iconos lucide-react
- TypeScript sin errores
- Conectado a Supabase

Genera los 6 archivos completos.