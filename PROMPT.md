Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

TAREA: Rediseñar completamente las plantillas y arreglar pestañas de tienda online.

=== ARCHIVO 1: /src/app/(admin)/tienda/page.tsx ===
Arreglar navegación - estas rutas deben funcionar:
- "Personalizar" → navega a /admin/tienda/personalizar
- "Administrar temas" → navega a /admin/tienda/temas
- "Ver páginas" → navega a /admin/tienda/paginas
- "Editar preferencias" → navega a /admin/tienda/preferencias
- "Ver tienda" → abre nueva pestaña con /preview/optica-esencial
- "Vista previa" → abre modal con iframe preview
- "Conectar dominio" → navega a /admin/tienda/dominios

Grid de 6 plantillas con diseños COMPLETAMENTE distintos entre sí.

=== ARCHIVO 2: /src/app/(admin)/tienda/temas/page.tsx ===
Página administrar temas:
- Lista de temas instalados con opción activar/eliminar
- Biblioteca de temas disponibles
- Las 6 plantillas con preview visual

=== ARCHIVO 3: /src/app/(admin)/tienda/paginas/page.tsx ===
Ver páginas:
- Tabla de páginas creadas: Inicio, Nosotros, Contacto, etc.
- Botón agregar página
- Por fila: editar, eliminar, ver preview

=== ARCHIVO 4: /src/components/templates/OpticaEsencial.tsx ===
Plantilla GRATIS - Ecommerce tradicional minimalista:
- Fondo blanco, tipografía negra, acentos en verde #00a651
- Header: logo izquierda, navegación centro, carrito y búsqueda derecha
- Hero banner: imagen full width con texto overlay y botón CTA
- Barra de categorías: Monturas, Lentes de sol, Lentes de contacto, Accesorios
- Grid productos: 4 columnas, imagen cuadrada, nombre, precio, botón agregar
- Sección ofertas: banner con countdown timer
- Sección marcas: logos en fila
- Newsletter: fondo gris claro, input email
- Footer: 4 columnas links + redes sociales
- UX tradicional, limpio, funcional

=== ARCHIVO 5: /src/components/templates/ClinicaConfianza.tsx ===
Plantilla GRATIS - Clínica oftalmológica profesional:
- Colores: azul médico #1e40af, blanco, gris claro
- Tipografía: serif para títulos (confianza/autoridad)
- Header: logo + navegación: Inicio, Servicios, Doctores, Blog, Tienda, Contacto
- Hero: imagen de clínica moderna con texto "Tu visión es nuestra misión" + botón Agendar cita
- Sección servicios: 6 cards con icono médico: Examen visual, Cirugía LASIK, Lentes de contacto, Tratamientos, Optometría, Urgencias
- Sección doctores: 3 cards con foto circular, nombre, especialidad, años experiencia
- Sección productos tienda: grid de productos ópticos con precio
- Sección blog: 3 artículos recientes con imagen y extracto
- Sección testimonios: estrellas, foto paciente, comentario
- Sección ubicación: mapa placeholder + datos contacto
- Footer médico con certificaciones

=== ARCHIVO 6: /src/components/templates/LensShop.tsx ===
Plantilla GRATIS - Ecommerce premium de lentes:
- Colores: negro #0a0a0a, dorado #c9a84c, blanco
- Tipografía: moderna y elegante
- Header sticky con transparencia que cambia al hacer scroll
- Hero: pantalla completa con video/imagen de fondo, texto centrado grande, dos botones CTA
- Sección "Nuevo esta temporada": scroll horizontal de productos
- Filtros avanzados visibles: marca, precio, tipo, material
- Grid productos: 3 columnas, imagen grande con hover zoom, quick add al carrito
- Sección lookbook: grid estilo editorial con imágenes grandes
- Sección bestsellers con badge de ventas
- Programa de puntos/fidelización
- Chat widget flotante
- Footer oscuro con newsletter destacado

=== ARCHIVO 7: /src/components/templates/VisionPro.tsx ===
Plantilla PREMIUM $19 - Inspirada en mejores ópticas del mundo:
- Diseño SOFISTICADO y PREMIUM
- Colores: blanco puro, negro intenso, acento azul eléctrico #0066ff
- Tipografía: display font grande y bold para impacto
- Header minimalista: solo logo centrado + menú hamburguesa
- Hero IMPACTANTE: imagen producto gigante, texto minimalista, animación entrada
- Sección "Colecciones": 3 cards grandes con hover parallax effect
- Grid productos premium: imagen cuadrada grande, nombre elegante, precio discreto
- Sección "Nuestra historia": texto + imagen lado a lado, estilo magazine
- Sección "Como funciona": 3 pasos con iconos lineales
- Testimonios: citas grandes en cursiva, sin estrellas (más premium)
- Footer minimalista con newsletter
- Micro-animaciones en hover de todos los elementos

=== ARCHIVO 8: /src/components/templates/LuxOptic.tsx ===
Plantilla PREMIUM $19 - Estilo Ray-Ban/Oakley lujo:
- Colores: negro absoluto #000, rojo #e63946, blanco
- Tipografía: bold, industrial, impactante
- Header: fondo negro, logo blanco, menú blanco
- Hero: video background (placeholder), texto blanco gigante "SEE THE WORLD DIFFERENTLY"
- Sección categorías: imágenes full bleed con texto overlay blanco
- Productos: fondo negro, imágenes con fondo transparente, precio en blanco
- Sección "Tecnología": specs técnicas de los lentes con iconos
- Sección atletas/embajadores: fotos grandes en blanco y negro
- Carrito lateral slide-in
- Efectos: parallax, fade-in scroll, hover scale
- Totalmente oscura, agresiva, premium

=== ARCHIVO 9: /src/components/templates/MedCenterPro.tsx ===
Plantilla PREMIUM $19 - Clínicas grandes corporativo:
- Colores: azul corporativo #003366, blanco, gris #f8f9fa
- Diseño: corporativo, institucional, máxima confianza
- Header: barra superior con teléfono y horarios + header principal con logo y navegación completa
- Mega menú: Especialidades, Doctores, Tecnología, Pacientes, Investigación, Tienda
- Hero: slider de 3 slides con diferentes servicios
- Sección estadísticas: 20,000+ pacientes, 15+ años, 98% satisfacción, 50+ doctores
- Sección especialidades: grid 6 especialidades con icono médico premium
- Sección tecnología: equipos de última generación con imagen y descripción
- Sección equipo médico: grid doctores con foto, nombre, especialidad, universidad
- Sección acreditaciones: logos certificaciones médicas
- Sección noticias/blog corporativo
- Footer institucional completo con mapa, horarios, emergencias 24h

=== ARCHIVO 10: /src/app/(admin)/tienda/personalizar/page.tsx ===
Editor visual actualizado:
- Panel izquierdo muestra preview de la plantilla activa
- Selector de plantilla en la parte superior
- Al seleccionar plantilla diferente, el preview cambia
- Las 3 plantillas premium muestran badge "Premium" con candado
- Al intentar usar premium sin pagar: modal de compra S/65

Requisitos:
- Cada plantilla debe verse COMPLETAMENTE diferente
- Las premium deben verse notablemente más sofisticadas
- Todas deben ser componentes React con props editables
- TypeScript sin errores
- Iconos lucide-react

Genera todos los archivos completos.