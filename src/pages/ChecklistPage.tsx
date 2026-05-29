import { useMemo, useState } from 'react';
import { phases } from '../data/initialData';
import type { AppData, Priority, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { TaskRow } from '../components/TaskRow';

export function ChecklistPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const tasks = useMemo(() => {
    const q = query.toLowerCase();
    return data.tasks.filter((task) => {
      const matchesQuery = [task.title, task.notes, task.phase].join(' ').toLowerCase().includes(q);
      return matchesQuery && (priority === 'all' || task.priority === priority) && (status === 'all' || task.status === status);
    });
  }, [data.tasks, priority, query, status]);

  return (
    <div>
      <PageHeader kicker="Printable checklist" title="Final Departure Checklist" body="Filter, update, and print the operational checklist by phase. Completion status is saved locally in this browser." />
      <div className="mb-5 grid gap-3 rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-white/80 print:hidden sm:grid-cols-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="normal">Normal</option><option value="optional">Optional</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All statuses</option><option value="todo">Todo</option><option value="in progress">In progress</option><option value="waiting">Waiting</option><option value="done">Done</option></select>
      </div>
      {phases.map((phase) => {
        const phaseTasks = tasks.filter((task) => task.phase === phase);
        return (
          <section key={phase} className="mb-7 break-inside-avoid">
            <h3 className="mb-3 text-xl font-bold">{phase}</h3>
            {phaseTasks.length ? <div className="space-y-3">{phaseTasks.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-slate-500">No matching tasks in this phase.</div>}
          </section>
        );
      })}
    </div>
  );
}
