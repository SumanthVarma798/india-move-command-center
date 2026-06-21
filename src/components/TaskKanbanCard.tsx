import { useState } from 'react';
import type { MoveTask, TaskStatus } from '../types';
import { getTaskWorkstream, workstreams } from '../utils/progress';
import { StatusBadge } from './StatusBadge';

const statuses: TaskStatus[] = ['todo', 'in progress', 'waiting', 'done'];

export function TaskKanbanCard({ task, onStatusChange }: { task: MoveTask; onStatusChange: (id: string, status: TaskStatus) => void }) {
  const [expanded, setExpanded] = useState(false);
  const stream = workstreams.find((item) => item.id === getTaskWorkstream(task));

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:border-slate-300">
      <button type="button" onClick={() => setExpanded((current) => !current)} className="block w-full text-left">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge value={task.priority} />
          {task.dueDate ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">Due {task.dueDate}</span> : null}
        </div>
        <h3 className="mt-3 text-sm font-bold leading-5 text-slate-950">{task.title}</h3>
        <p className="mt-1 text-xs font-semibold text-slate-500">{stream?.label ?? 'Workstream'} · {task.phase}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{task.notes}</p>
      </button>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setExpanded((current) => !current)} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
          {expanded ? 'Hide details' : 'Details'}
        </button>
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
          className="min-w-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {expanded ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Mark done when</h4>
          {task.completionCriteria?.length ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {task.completionCriteria.map((criterion) => (
                <li key={criterion} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No completion criteria yet.</p>
          )}
        </div>
      ) : null}
    </article>
  );
}
