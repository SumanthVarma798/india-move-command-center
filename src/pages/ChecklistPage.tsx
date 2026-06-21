import { useMemo, useState } from 'react';
import type { AppData, Priority, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { TaskKanbanCard } from '../components/TaskKanbanCard';
import { TaskRow } from '../components/TaskRow';
import { getTaskWorkstream, workstreams, type WorkstreamId } from '../utils/progress';

const statuses: TaskStatus[] = ['todo', 'in progress', 'waiting', 'done'];
const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in progress': 'In progress',
  waiting: 'Waiting',
  done: 'Done',
};

export function ChecklistPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [workstream, setWorkstream] = useState<WorkstreamId | 'all'>('all');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
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
      <PageHeader kicker="Kanban checklist" title="Final Departure Checklist" body="Filter the move by workstream, priority, status, or search. Kanban is the daily operating view; list mode remains print-friendly." />
      <div className="mb-5 rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-white/80 print:hidden">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
          <select value={workstream} onChange={(e) => setWorkstream(e.target.value as WorkstreamId | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All workstreams</option>{workstreams.map((stream) => <option key={stream.id} value={stream.id}>{stream.label}</option>)}</select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="normal">Normal</option><option value="optional">Optional</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All statuses</option><option value="todo">Todo</option><option value="in progress">In progress</option><option value="waiting">Waiting</option><option value="done">Done</option></select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-slate-100 p-1">
            <button type="button" onClick={() => setView('kanban')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'kanban' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Kanban</button>
            <button type="button" onClick={() => setView('list')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>List</button>
          </div>
          <p className="text-sm font-semibold text-slate-500">{tasks.length} matching tasks</p>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="print:hidden">
          <div className="grid gap-4 xl:grid-cols-4">
            {statuses.map((columnStatus) => {
              const columnTasks = tasks.filter((task) => task.status === columnStatus);
              return (
                <section key={columnStatus} className="min-h-44 rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-sm">
                  <div className="sticky top-24 z-10 mb-3 rounded-3xl bg-white/90 px-3 py-3 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-950">{statusLabels[columnStatus]}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{columnTasks.length}</span>
                    </div>
                  </div>
                  {columnTasks.length ? (
                    <div className="space-y-3">
                      {columnTasks.map((task) => <TaskKanbanCard key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500">No matching tasks.</div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className={view === 'kanban' ? 'hidden print:block' : ''}>
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
    </div>
  );
}
