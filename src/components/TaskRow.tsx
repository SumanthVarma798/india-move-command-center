import { useState } from 'react';
import type { MoveTask, TaskStatus } from '../types';
import { StatusBadge } from './StatusBadge';

const statuses: TaskStatus[] = ['todo', 'in progress', 'waiting', 'done'];

export function TaskRow({ task, onStatusChange }: { task: MoveTask; onStatusChange: (id: string, status: TaskStatus) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm transition hover:border-slate-300">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpanded((current) => !current);
          }
        }}
        className="flex cursor-pointer flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{task.title}</h3>
            <StatusBadge value={task.priority} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{task.phase}{task.dueDate ? ` · Due ${task.dueDate}` : ''}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.notes}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">{expanded ? 'Hide details' : 'Details'}</span>
          <select
            value={task.status}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {expanded ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-900">Mark done when:</h4>
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
