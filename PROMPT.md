Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

MODULO 1 - PEDIDOS completo:
Archivo: /src/app/(admin)/pedidos/page.tsx

Requisitos exactos:
- Layout igual a Shopify: sidebar oscuro + topbar + contenido gris
- Métricas superiores: Pedidos totales, Artículos pedidos, Devoluciones, Pedidos preparados, Pedidos entregados
- Tabs: Todos, No preparados, Sin pagar, Abiertos, Archivados
- Tabla: checkbox, Pedido #, Fecha, Cliente, Canal, Total, Estado del pago (badge), Estado preparación (badge), Artículos
- Botones funcionales: Exportar (descarga CSV), Crear pedido (abre modal)
- Modal crear pedido: campos nombre cliente, email, producto, cantidad, precio, método de pago
- Por cada fila: opciones de editar y eliminar
- Estados con badges de colores: Pagado (verde), Pendiente (amarillo), No preparado (naranja), Preparado (azul)
- Datos de ejemplo con al menos 5 pedidos
- Todo conectado a Supabase tabla pedidos con tenant_id
- Usar lucide-react para iconos

Genera el archivo completo listo para usar.