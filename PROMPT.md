Eres el desarrollador de OftalShop, clon de Shopify para ópticas.
Stack: Next.js 14, TypeScript, Tailwind CSS, Supabase.

TAREA: Módulo clientes completo con perfil y historia clínica.

=== ARCHIVO 1: /src/app/(admin)/clientes/page.tsx ===
Lista de clientes actualizada:
- Misma tabla de antes pero con botón "Ver más" por fila
- "Ver más" navega a /admin/clientes/[id]

=== ARCHIVO 2: /src/app/(admin)/clientes/[id]/page.tsx ===
Página perfil del cliente con diseño oscuro como las imágenes:
- Header superior: avatar con inicial, nombre completo, DNI, teléfono, total compras
- 3 tabs: Datos / Historia / Compras

TAB DATOS - campos editables:
- Nombres, Apellidos, DNI, Teléfono, Email, Ciudad, Dirección
- Botón Guardar cambios
- Conectado a Supabase tabla clientes_tienda

TAB HISTORIA - igual a las imágenes adjuntas:
Sección "Información general":
- Doctor/Optómetra (select), Texto libre (toggle), Fecha, Tipo de prescripción

Sección "Visión de Lejos" (tabla):
- Columnas: Esférico, Cilindro, Eje, A.V C/c, DIP, Altura, Adición
- Filas: Ojo Derecho, Ojo Izquierdo

Sección "Visión de Cerca" (tabla):
- Columnas: Esférico, Cilindro, Eje, A.V C/c, DIP, Altura
- Filas: Ojo Derecho, Ojo Izquierdo

Sección "Visión Intermedia" (tabla):
- Columnas: Esférico, Cilindro, Eje, A.V C/c, DIP, Altura
- Filas: Ojo Derecho, Ojo Izquierdo

Sección "Historia clínica":
- Campos textarea: Razón de la consulta, Sintomatología, 
  Diagnóstico, Tratamiento, Historia ocular, 
  Historial familiar ocular, Comentarios

Sección "Antecedentes":
- Badges seleccionables (toggle activo/inactivo):
  Catarata, Glaucoma, Traumatismo ocular, 
  Hipertensión, Diabetes mellitus, Otro

Botón grande azul: "Guardar historia clínica"
- Conectado a Supabase nueva tabla historias_clinicas con tenant_id y cliente_id

TAB COMPRAS:
- Tabla de pedidos del cliente: #pedido, fecha, productos, total, estado
- Conectado a Supabase tabla pedidos filtrado por cliente_id y tenant_id

Diseño: fondo oscuro #0f1117 igual a las imágenes, 
texto blanco, inputs con fondo #1e2130, 
secciones con fondo #161b2e y borde sutil.

=== ARCHIVO 3: Migration SQL ===
Genera el SQL para ejecutar en Supabase:
CREATE TABLE historias_clinicas con todos los campos necesarios
incluyendo tenant_id, cliente_id, y todos los campos de la historia.

Genera todos los archivos completos.