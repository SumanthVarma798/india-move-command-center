export function PageHeader({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{body}</p>
    </div>
  );
}
