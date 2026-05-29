import type { ReactNode } from 'react';

export function MetricCard({ label, value, detail, children }: { label: string; value: string | number; detail?: string; children?: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-soft backdrop-blur">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</div>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
      {children}
    </section>
  );
}
