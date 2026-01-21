export default async function InstructorPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-light tracking-tight text-black">
        Instructor: {params.slug}
      </h1>
      <p className="mt-4 text-black/70">
        ✅ Si ves esto, la ruta dinámica funciona.
      </p>
    </main>
  );
}
