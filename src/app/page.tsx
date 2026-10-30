export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">SraswatiLibrary</h1>
      <p className="mt-2">Library Management System</p>
      <nav className="mt-6 space-x-4">
        <a href="/catalogue" className="underline">Catalogue</a>
        <a href="/login" className="underline">Login</a>
        <a href="/register" className="underline">Register</a>
      </nav>
    </main>
  );
}
