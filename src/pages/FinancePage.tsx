import type { AppData, DecisionStatus, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export function FinancePage({ data, onFinanceChange }: { data: AppData; onFinanceChange: (id: string, patch: { decision?: DecisionStatus; status?: TaskStatus }) => void }) {
  return (
    <div>
      <PageHeader kicker="Money continuity" title="Finance & Cards" body="Track the keep, cancel, downgrade, or undecided calls for US accounts without storing account numbers or private documents." />
      <div className="grid gap-4 md:grid-cols-2">
        {data.finance.map((item) => (
          <article key={item.id} className="rounded-[2rem] bg-white/85 p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="text-lg font-bold">{item.name}</h3><p className="mt-1 text-sm capitalize text-slate-500">{item.type}</p></div>
              <div className="flex gap-2"><StatusBadge value={item.decision} /><StatusBadge value={item.status} /></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.notes}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <select value={item.decision} onChange={(event) => onFinanceChange(item.id, { decision: event.target.value as DecisionStatus })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                <option value="keep">keep</option><option value="cancel">cancel</option><option value="downgrade later">downgrade later</option><option value="undecided">undecided</option>
              </select>
              <select value={item.status} onChange={(event) => onFinanceChange(item.id, { status: event.target.value as TaskStatus })} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                <option value="todo">todo</option><option value="in progress">in progress</option><option value="waiting">waiting</option><option value="done">done</option>
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
