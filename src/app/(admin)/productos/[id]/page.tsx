import { createClient } from '@/lib/supabase/server'
import ProductForm, { type ProductInitialData } from '@/components/admin/ProductForm'

export default async function EditProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('productos')
    .select(`
      *,
      medias ( url, tipo ),
      variantes ( nombre, valores ),
      materiales_luna ( nombre ),
      tratamientos ( nombre ),
      medidas_producto ( tipo_medida, valor, tipo, url )
    `)
    .eq('id', id)
    .single()

  return <ProductForm initialData={data as ProductInitialData | null} productId={id} />
}
