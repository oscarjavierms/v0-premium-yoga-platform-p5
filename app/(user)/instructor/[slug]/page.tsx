export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <main style={{ padding: 40 }}>
      <h1>SLUG OK ✅</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </main>
  )
}
