Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

PROBLEMA ACTUAL: Las plantillas muestran siempre la misma vista,
el editor no es funcional, y la página de producto no tiene flujo
de lentes con prescripción.

REESCRIBE COMPLETAMENTE estos archivos:

=== ARCHIVO 1: /src/app/(admin)/tienda/page.tsx ===
Página principal tienda online. Botones que NAVEGUEN correctamente:
- "Personalizar" → router.push('/admin/tienda/personalizar')
- "Ver tienda" → window.open('/tienda-preview', '_blank')  
- "Administrar temas" → router.push('/admin/tienda/temas')
- "Ver páginas" → router.push('/admin/tienda/paginas')
- "Editar preferencias" → router.push('/admin/tienda/preferencias')
- "Conectar dominio" → router.push('/admin/tienda/dominios')

Grid de 6 plantillas. Cada plantilla tiene:
- Imagen preview DIFERENTE (usar gradientes CSS únicos por plantilla)
- Nombre y descripción
- Badge "Gratis" o "S/65"
- Botón "Activar" (gratis) o "Comprar" (premium)
- Botón "Previsualizar" → abre modal con preview del componente

Estado local: plantillaActiva (string) guardado en Supabase
Al activar plantilla gratis: actualiza configuracion_tienda.plantilla

=== ARCHIVO 2: /src/app/(admin)/tienda/personalizar/page.tsx ===
REESCRIBIR COMPLETAMENTE. Editor visual 100% funcional:

Estado inicial cargado desde Supabase configuracion_tienda del tenant:
```typescript
const [config, setConfig] = useState({
  plantilla: 'esencial',
  colores: { primario: '#000', secundario: '#fff', acento: '#00a651', fondo: '#fff', texto: '#000' },
  tipografia: { titulo: 'Inter', cuerpo: 'Inter' },
  logoUrl: '',
  secciones: [
    { id: '1', tipo: 'header', activa: true, config: { mostrarBusqueda: true, mostrarCarrito: true } },
    { id: '2', tipo: 'banner', activa: true, config: { titulo: 'Bienvenido', subtitulo: '', imagenUrl: '', altura: 'M', alineacion: 'centro', textoBoton: 'Ver productos', opacidad: 20 } },
    { id: '3', tipo: 'productos', activa: true, config: { titulo: 'Productos destacados', cantidad: 8 } },
    { id: '4', tipo: 'footer', activa: true, config: { texto: 'Tu óptica de confianza' } }
  ]
})
```

PANEL IZQUIERDO (w-80, bg-white, border-r, overflow-y-auto):
- Header: "← Volver" + nombre plantilla + botón "Guardar" verde
- Selector páginas: tabs Inicio | Producto | Colección | Carrito
- Lista secciones: cada una con nombre, botón editar(lápiz), toggle on/off
- Al click en lápiz: expande AccordionItem con opciones de esa sección
- Cada tipo de sección tiene sus propias opciones:
  * banner: input título, input subtítulo, input texto botón, select altura(S/M/L/XL), select alineación, range opacidad
  * productos: input título sección, select cantidad(4/8/12), toggle mostrar precio, toggle mostrar botón
  * header: toggle mostrar búsqueda, toggle mostrar carrito, toggle fondo transparente
  * footer: textarea texto empresa, inputs redes sociales
- Botón "+ Agregar sección" → muestra lista de tipos disponibles para añadir
- Tab "Configuración":
  * 5 inputs type="color" para colores (primario, secundario, acento, fondo, texto)
  * Select fuente título: Inter|Playfair Display|Montserrat|Raleway|Oswald
  * Select fuente cuerpo: Inter|Lato|Open Sans|Merriweather
  * Input subir logo

PANEL DERECHO (flex-1, bg-gray-100):
- Topbar preview: botones Desktop(💻)/Tablet(📱)/Mobile(📱) que cambian el ancho
- Contenedor con ancho dinámico: desktop=100%, tablet=768px, mobile=375px
- Renderiza <StorePreview config={config} /> en tiempo real
- Cada cambio en panel izquierdo actualiza config → preview se actualiza

Al guardar: upsert a Supabase tabla configuracion_tienda donde tenant_id = getCurrentTenantId()

=== ARCHIVO 3: /src/components/store/StorePreview.tsx ===
Componente que renderiza la tienda según config:
- Recibe props: config completo
- Mapea config.secciones y renderiza cada una
- Aplica config.colores via style={{ '--color-primario': config.colores.primario }}
- Aplica config.tipografia cargando Google Font dinámicamente
- Renderiza secciones activas en orden
- Cada sección es un sub-componente: HeaderSection, BannerSection, ProductosSection, FooterSection
- ProductosSection muestra productos reales del tenant (fetch a Supabase)

=== ARCHIVO 4: /src/components/templates/TemplatePreview.tsx ===
Modal de preview de plantilla:
- Recibe: plantillaNombre (string)
- Renderiza el componente correspondiente según nombre:
  * 'esencial' → OpticaEsencial con datos mock
  * 'clinica' → ClinicaConfianza con datos mock
  * 'lensshop' → LensShop con datos mock
  * 'visionpro' → VisionPro con datos mock
  * 'luxoptic' → LuxOptic con datos mock
  * 'medcenter' → MedCenterPro con datos mock
- Muestra en modal fullscreen con botón cerrar

=== ARCHIVO 5: /src/app/[tenant]/productos/[slug]/page.tsx ===
Página de producto con FLUJO COMPLETO de prescripción:

SECCIÓN PRINCIPAL:
- Galería imágenes izquierda (thumbnails + imagen grande)
- Info derecha: nombre, precio, descripción corta

FLUJO PRESCRIPCIÓN (si producto.requiere_prescripcion = true):
Botón grande "Seleccionar lentes" que abre wizard de pasos:

PASO 1 - Tipo de uso:
  Cards seleccionables:
  * "Solo armazón" (sin lentes)
  * "Lentes sin medida" (lentes planos)  
  * "Lentes con medida" (con prescripción)
  * "Lentes de sol" (polarizados)

PASO 2 - Tipo de visión (si eligió con medida):
  Cards: Visión Simple | Bifocal | Progresivo | Solo lectura

PASO 3 - Material del lente:
  Cards con cada material del tenant (desde tabla materiales_luna):
  Ejemplo: CR-39 | Policarbonato | Trivex | Alto índice 1.67
  Cada card muestra: nombre, descripción, precio adicional

PASO 4 - Tratamiento:
  Cards con tratamientos del tenant (desde tabla tratamientos):
  Ejemplo: Sin tratamiento | Antirreflejo | Fotocromático | Blue Cut
  Con precio adicional por tratamiento

PASO 5 - Prescripción:
  Toggle: "Ingresar manualmente" / "Subir foto de receta"
  
  Si manual - tabla de ingreso:
  | | Esférico | Cilindro | Eje | ADD | DIP |
  |OD| input | input | input | input | input |
  |OI| input | input | input | input | input |
  
  Si foto - dropzone para subir imagen (Supabase Storage)

PASO 6 - Resumen:
  - Armazón seleccionado + precio
  - Material seleccionado + precio adicional
  - Tratamiento seleccionado + precio adicional
  - TOTAL calculado
  - Botón "Agregar al carrito"

Barra de progreso en la parte superior mostrando en qué paso está.
Botones Anterior/Siguiente entre pasos.
Todo el estado manejado con useState.

SECCIÓN INFERIOR:
- Descripción completa del producto (rich text)
- Tabla de medidas si existe (desde medidas_producto)
- Productos relacionados

=== ARCHIVO 6: /src/app/[tenant]/carrito/page.tsx ===
Página carrito completa:
- Lista de items con imagen, nombre, configuración de lentes seleccionada, precio, cantidad, eliminar
- Resumen: subtotal, envío, total
- Botón "Proceder al pago"
- Estado del carrito en localStorage + Supabase (tabla carrito con tenant_id)

=== ARCHIVO 7: /src/app/[tenant]/checkout/page.tsx ===
Checkout en 3 pasos:
PASO 1 - Datos de contacto: nombre, email, teléfono
PASO 2 - Dirección de envío: dirección, ciudad, distrito, referencias
PASO 3 - Pago: 
  Cards de métodos: Tarjeta (Stripe), Yape/Plin (QR), Transferencia, Contra entrega
  Resumen del pedido
  Botón confirmar pedido → crea registro en tabla pedidos

Requisitos CRÍTICOS:
- Todo el estado del editor debe ser React useState
- Preview debe actualizarse SIN recargar página
- Plantillas deben ser componentes distintos que se renderizan según selección
- Flujo de prescripción completo paso a paso
- TypeScript sin errores
- Datos reales desde Supabase filtrados por tenant_id
- Iconos lucide-react

Genera TODOS los archivos completos y funcionales.