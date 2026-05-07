export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-foreground">JasonBot</h1>
        <p className="mt-2 text-sm text-muted-foreground">NLP Anxiety Resolution Coach</p>
      </div>
      {children}
    </main>
  );
}
