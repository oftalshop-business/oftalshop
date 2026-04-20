Eres el desarrollador principal de OftalShop, un SaaS e-commerce 
especializado en ópticas, clínicas y laboratorios ópticos. 
Es un clon funcional de Shopify pero para negocios ópticos.

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase.

Supabase URL: https://mniprsnihowukpeepthn.supabase.co

El schema de base de datos ya está creado con estas tablas:
tenants, usuarios, productos, medias, variantes, materiales_luna, 
tratamientos, medidas_producto, colecciones, clientes_tienda, 
pedidos, items_pedido, descuentos, configuracion_tienda.

TAREA FASE 1: Construye la estructura completa del proyecto:

1. /src/lib/supabase/client.ts
2. /src/lib/supabase/server.ts
3. /src/middleware.ts
4. /src/app/layout.tsx
5. /src/app/(admin)/layout.tsx con sidebar igual a Shopify
6. /src/app/(admin)/dashboard/page.tsx
7. /src/components/admin/Sidebar.tsx
8. /src/components/admin/Topbar.tsx

Diseño IDENTICO a Shopify: sidebar negro #1a1a1a, iconos, 
secciones: Inicio, Pedidos, Productos, Clientes, Contenido, 
Informes, Marketing, Descuentos, Tienda online, Configuracion.

FASE 2 - Crear las siguientes paginas y archivos completos:

1. /src/app/(admin)/pedidos/page.tsx - pagina pedidos estilo Shopify
2. /src/app/(admin)/productos/page.tsx - lista de productos
3. /src/app/(admin)/productos/nuevo/page.tsx - agregar producto
4. /src/app/(admin)/clientes/page.tsx - lista clientes
5. /src/app/(admin)/contenido/page.tsx - pagina contenido
6. /src/app/(admin)/informes/page.tsx - pagina informes
7. /src/app/(admin)/marketing/page.tsx - pagina marketing
8. /src/app/(admin)/descuentos/page.tsx - pagina descuentos
9. /src/app/(admin)/tienda/page.tsx - pagina tienda online
10. /src/app/(admin)/configuracion/page.tsx - pagina configuracion
11. /src/app/login/page.tsx - pagina login con email y password, diseno Shopify
12. /src/app/page.tsx - landing page profesional para OftalShop SaaS
    dirigida a clinicas oftalmologicas y opticas.
    Debe incluir: hero section, caracteristicas, planes ($19/$49/$99),
    testimonios, CTA final. Diseno moderno, colores azul y blanco,
    profesional medico.

Cada pagina del admin debe tener el mismo layout que el dashboard:
sidebar izquierdo oscuro + topbar + contenido principal gris claro.
Todas deben ser paginas reales con estructura visual completa,
no paginas vacias.

Genera todos los archivos completos listos para usar.