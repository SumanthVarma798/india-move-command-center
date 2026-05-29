import type { DecisionStatus, DocumentStatus, Priority, TaskStatus } from '../types';

type BadgeKind = TaskStatus | Priority | DecisionStatus | DocumentStatus;

const badgeStyles: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-700 ring-slate-200',
  'in progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  waiting: 'bg-amber-50 text-amber-700 ring-amber-200',
  done: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  critical: 'bg-rose-50 text-rose-700 ring-rose-200',
  high: 'bg-orange-50 text-orange-700 ring-orange-200',
  normal: 'bg-sky-50 text-sky-700 ring-sky-200',
  optional: 'bg-zinc-50 text-zinc-600 ring-zinc-200',
  keep: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancel: 'bg-rose-50 text-rose-700 ring-rose-200',
  'downgrade later': 'bg-violet-50 text-violet-700 ring-violet-200',
  undecided: 'bg-amber-50 text-amber-700 ring-amber-200',
  ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'needs update': 'bg-amber-50 text-amber-700 ring-amber-200',
  missing: 'bg-rose-50 text-rose-700 ring-rose-200',
  review: 'bg-blue-50 text-blue-700 ring-blue-200',
};

export function StatusBadge({ value }: { value: BadgeKind }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeStyles[value]}`}>{value}</span>;
}
