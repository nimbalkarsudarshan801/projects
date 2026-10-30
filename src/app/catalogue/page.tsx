import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Catalogue() {
  const books = await prisma.book.findMany({ include: { category: true }, take: 50 });
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Catalogue</h1>
      <ul className="space-y-2">
        {books.map((b) => (
          <li key={b.id} className="border p-3 rounded">
            <strong>{b.title}</strong> — {b.author} ({b.availableCopies}/{b.totalCopies})
          </li>
        ))}
        {books.length === 0 && <li>No books yet.</li>}
      </ul>
    </main>
  );
}
