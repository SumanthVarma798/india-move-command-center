import { useMemo, useState } from 'react';
import type { AppData, Priority, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { TaskRow } from '../components/TaskRow';
import { getTaskWorkstream, workstreams, type WorkstreamId } from '../utils/progress';

export function ChecklistPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [workstream, setWorkstream] = useState<WorkstreamId | 'all'>('all');
  const tasks = useMemo(() => {
    const q = query.toLowerCase();
    return [...data.tasks, ...data.afterLanding].filter((task) => {
      const stream = getTaskWorkstream(task);
      const matchesQuery = [task.title, task.notes, task.phase, stream].join(' ').toLowerCase().includes(q);
      return matchesQuery && (priority === 'all' || task.priority === priority) && (status === 'all' || task.status === status) && (workstream === 'all' || stream === workstream);
    });
  }, [data.afterLanding, data.tasks, priority, query, status, workstream]);

  return (
    <div>
      <PageHeader kicker="Printable checklist" title="Final Departure Checklist" body="Filter, update, and print the operational checklist by workstream. Phase still appears inside each task." />
      <div className="mb-5 grid gap-3 rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-white/80 print:hidden sm:grid-cols-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
        <select value={workstream} onChange={(e) => setWorkstream(e.target.value as WorkstreamId | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All workstreams</option>{workstreams.map((stream) => <option key={stream.id} value={stream.id}>{stream.label}</option>)}</select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="normal">Normal</option><option value="optional">Optional</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All statuses</option><option value="todo">Todo</option><option value="in progress">In progress</option><option value="waiting">Waiting</option><option value="done">Done</option></select>
      </div>
      {workstreams.map((stream) => {
        const streamTasks = tasks.filter((task) => getTaskWorkstream(task) === stream.id);
        return (
          <section key={stream.id} className="mb-7 break-inside-avoid">
            <div className="mb-3">
              <h3 className="text-xl font-bold">{stream.label}</h3>
              <p className="mt-1 text-sm text-slate-500">{stream.description}</p>
            </div>
            {streamTasks.length ? <div className="space-y-3">{streamTasks.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-slate-500">No matching tasks in this workstream.</div>}
          </section>
        );
      })}
    </div>
  );
}
