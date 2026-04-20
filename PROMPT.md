Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase Auth.

Crea el sistema completo de autenticacion y landing page:

=== ARCHIVO 1: /src/app/page.tsx ===
Landing page profesional de OftalShop SaaS:

HERO SECTION:
- Fondo gradiente azul oscuro a negro
- Logo OftalShop arriba izquierda
- Navegacion: Caracteristicas, Precios, Testimonios, Iniciar sesion, Empezar gratis
- Titulo grande: "El Shopify para ópticas y clínicas oftalmológicas"
- Subtitulo: "Crea tu tienda online, gestiona pedidos, inventario y clientes. Todo en un solo lugar."
- Dos botones CTA: "Empezar gratis 14 días" (verde) y "Ver demo" (outline blanco)
- Imagen/mockup del dashboard a la derecha

SECCION CARACTERISTICAS:
- Titulo: "Todo lo que necesita tu óptica"
- 6 cards con icono, titulo y descripcion:
  * Tienda online profesional
  * Gestión de productos ópticos (materiales, tratamientos, medidas)
  * Pedidos y clientes
  * Múltiples pasarelas de pago
  * Editor visual de tienda
  * Informes y estadísticas

SECCION PARA QUIEN ES:
- Titulo: "Diseñado para negocios ópticos"
- 5 cards: Ópticas, Clínicas oftalmológicas, Laboratorios ópticos, E-commerce de lentes, Distribuidoras
- Cada card con icono y descripcion corta

SECCION PRECIOS:
- Titulo: "Planes simples y transparentes"
- 3 cards de planes:
  * Básico $19/mes: 50 productos, 1 pasarela pago, 3 plantillas gratis, soporte email
  * Intermedio $49/mes (badge POPULAR): 300 productos, 3 pasarelas, dominio propio, editor visual
  * Pro $99/mes: ilimitado todo, multi-usuario, white label, soporte WhatsApp
- Cada plan con botón "Empezar ahora"
- Toggle mensual/anual con 20% descuento anual

SECCION TESTIMONIOS:
- 3 testimonios con foto avatar, nombre, tipo de negocio, estrellas y comentario
- Ejemplos: óptica Lima, clínica oftalmológica, laboratorio óptico

SECCION CTA FINAL:
- Fondo azul
- "¿Listo para digitalizar tu negocio óptico?"
- Botón grande "Empezar gratis 14 días"

FOOTER:
- Logo + descripcion corta
- Links: Producto, Empresa, Soporte, Legal
- Redes sociales
- Copyright OftalShop 2025

Diseño: profesional, moderno, colores azul #1e40af y blanco,
tipografia limpia, animaciones suaves, totalmente responsive.

=== ARCHIVO 2: /src/app/login/page.tsx ===
Pagina de login:
- Fondo gris claro
- Card centrada blanca con sombra
- Logo OftalShop arriba
- Titulo: "Iniciar sesión"
- Input: Email
- Input: Contraseña (con toggle mostrar/ocultar)
- Botón: "Iniciar sesión" (azul, full width)
- Link: "¿Olvidaste tu contraseña?"
- Separador "o"
- Link: "¿No tienes cuenta? Empezar gratis"
- Conectado a Supabase Auth con signInWithPassword
- Si login exitoso: redirect a /dashboard
- Mostrar errores si credenciales incorrectas

=== ARCHIVO 3: /src/app/registro/page.tsx ===
Pagina de registro:
- Card centrada igual que login
- Campos: Nombre completo, Email, Contraseña, Confirmar contraseña
- Selector de plan: Básico / Intermedio / Pro
- Nombre de la tienda (genera el slug automático)
- Checkbox: acepto términos y condiciones
- Botón: "Crear cuenta gratis"
- Conectado a Supabase Auth con signUp
- Al registrar: crear registro en tabla tenants con los datos
- Redirect a /dashboard tras registro exitoso

=== ARCHIVO 4: /src/app/recuperar/page.tsx ===
Recuperar contraseña:
- Card centrada
- Input email
- Botón enviar enlace
- Conectado a Supabase Auth resetPasswordForEmail
- Mensaje de confirmación tras enviar

=== ARCHIVO 5: /src/middleware.ts ===
Middleware de autenticacion completo:
- Rutas protegidas: todo /dashboard y /(admin)/* requiere sesion activa
- Si no hay sesion: redirect a /login
- Si hay sesion y visita /login: redirect a /dashboard
- Rutas publicas: /, /login, /registro, /recuperar, /[tenant]/*

=== ARCHIVO 6: /src/lib/supabase/client.ts ===
=== ARCHIVO 7: /src/lib/supabase/server.ts ===
Clientes Supabase actualizados y correctos para Next.js 16.

Requisitos:
- TypeScript sin errores
- Supabase Auth completamente funcional
- Manejo de errores en todos los formularios
- Loading states en botones
- Responsive en mobile
- Iconos lucide-react

Genera todos los archivos completos.