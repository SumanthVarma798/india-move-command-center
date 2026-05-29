import type { MoveTask, TaskStatus } from '../types';
import { StatusBadge } from './StatusBadge';

const statuses: TaskStatus[] = ['todo', 'in progress', 'waiting', 'done'];

export function TaskRow({ task, onStatusChange }: { task: MoveTask; onStatusChange: (id: string, status: TaskStatus) => void }) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{task.title}</h3>
            <StatusBadge value={task.priority} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{task.phase}{task.dueDate ? ` · Due ${task.dueDate}` : ''}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.notes}</p>
        </div>
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
          className="h-10 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </article>
  );
}
