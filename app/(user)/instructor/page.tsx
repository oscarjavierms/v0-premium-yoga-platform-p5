export default function TestInstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Instructor OK ✅</h1>
      <p>Slug: {params.slug}</p>
    </div>
  )
}
