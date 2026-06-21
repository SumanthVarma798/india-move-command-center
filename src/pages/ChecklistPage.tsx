import { useMemo, useRef, useState } from 'react';
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

const statusDesign: Record<TaskStatus, { lane: string; header: string; description: string }> = {
  todo: {
    lane: 'border-slate-200 bg-slate-100/80',
    header: 'bg-slate-900 text-white',
    description: 'Not started yet',
  },
  'in progress': {
    lane: 'border-blue-200 bg-blue-100/80',
    header: 'bg-blue-700 text-white',
    description: 'Actively moving',
  },
  waiting: {
    lane: 'border-amber-200 bg-amber-100/80',
    header: 'bg-amber-600 text-white',
    description: 'Blocked externally',
  },
  done: {
    lane: 'border-emerald-200 bg-emerald-100/80',
    header: 'bg-emerald-700 text-white',
    description: 'Completed',
  },
};

const priorityWeight: Record<Priority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  optional: 3,
};

export function ChecklistPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [workstream, setWorkstream] = useState<WorkstreamId | 'all'>('all');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const draggedTaskRef = useRef<string | null>(null);
  const tasks = useMemo(() => {
    const q = query.toLowerCase();
    return [...data.tasks, ...data.afterLanding].filter((task) => {
      const stream = getTaskWorkstream(task);
      const matchesQuery = [task.title, task.notes, task.phase, stream].join(' ').toLowerCase().includes(q);
      return matchesQuery && (priority === 'all' || task.priority === priority) && (status === 'all' || task.status === status) && (workstream === 'all' || stream === workstream);
    });
  }, [data.afterLanding, data.tasks, priority, query, status, workstream]);
  const summaryTasks = useMemo(() => {
    const q = query.toLowerCase();
    return [...data.tasks, ...data.afterLanding].filter((task) => {
      const stream = getTaskWorkstream(task);
      const matchesQuery = [task.title, task.notes, task.phase, stream].join(' ').toLowerCase().includes(q);
      return matchesQuery && (priority === 'all' || task.priority === priority) && (workstream === 'all' || stream === workstream);
    });
  }, [data.afterLanding, data.tasks, priority, query, workstream]);
  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    return dateA - dateB || priorityWeight[a.priority] - priorityWeight[b.priority] || a.title.localeCompare(b.title);
  }), [tasks]);

  return (
    <div>
      <PageHeader kicker="Kanban board" title="Final Departure Checklist" body="The board is organized by status swimlanes. Use All items for a flat operational list across every section." />
      <div className="mb-5 rounded-3xl bg-white/75 p-4 shadow-sm ring-1 ring-white/80 print:hidden">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200" />
          <select value={workstream} onChange={(e) => setWorkstream(e.target.value as WorkstreamId | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All workstreams</option>{workstreams.map((stream) => <option key={stream.id} value={stream.id}>{stream.label}</option>)}</select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All priorities</option><option value="critical">Critical</option><option value="high">High</option><option value="normal">Normal</option><option value="optional">Optional</option></select>
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | 'all')} className="rounded-2xl border border-slate-200 px-4 py-3"><option value="all">All statuses</option><option value="todo">Todo</option><option value="in progress">In progress</option><option value="waiting">Waiting</option><option value="done">Done</option></select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-slate-100 p-1">
            <button type="button" onClick={() => setView('kanban')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'kanban' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Kanban board</button>
            <button type="button" onClick={() => setView('list')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>All items</button>
          </div>
          <p className="text-sm font-semibold text-slate-500">{tasks.length} matching tasks</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {statuses.map((summaryStatus) => {
            const count = summaryTasks.filter((task) => task.status === summaryStatus).length;
            return (
              <button
                key={summaryStatus}
                type="button"
                onClick={() => {
                  setStatus(summaryStatus);
                  setView('kanban');
                }}
                className={`rounded-2xl px-3 py-3 text-left shadow-sm ${statusDesign[summaryStatus].header}`}
              >
                <p className="text-xs font-bold uppercase opacity-75">{statusLabels[summaryStatus]}</p>
                <p className="mt-1 text-2xl font-bold">{count}</p>
              </button>
            );
          })}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="print:hidden">
          <div className="overflow-x-auto pb-4">
            <div className="grid min-w-[72rem] grid-cols-4 gap-4">
            {statuses.map((columnStatus) => {
              const columnTasks = sortedTasks.filter((task) => task.status === columnStatus);
              const design = statusDesign[columnStatus];
              const isDropTarget = dragOverStatus === columnStatus;
              return (
                <section
                  key={columnStatus}
                  data-kanban-lane={columnStatus}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setDragOverStatus(columnStatus);
                  }}
                  onDragLeave={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setDragOverStatus(null);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const taskId = event.dataTransfer.getData('text/plain') || draggedTaskRef.current || draggedTaskId;
                    if (taskId) onTaskStatusChange(taskId, columnStatus);
                    draggedTaskRef.current = null;
                    setDraggedTaskId(null);
                    setDragOverStatus(null);
                  }}
                  className={`min-h-[32rem] rounded-[2rem] border p-3 shadow-sm transition ${design.lane} ${isDropTarget ? 'scale-[1.01] ring-4 ring-slate-900/15' : ''}`}
                >
                  <div className={`mb-3 rounded-3xl px-4 py-4 shadow-sm ${design.header}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold">{statusLabels[columnStatus]}</h3>
                        <p className="mt-1 text-xs font-semibold opacity-75">{design.description}</p>
                      </div>
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{columnTasks.length}</span>
                    </div>
                  </div>
                  {columnTasks.length ? (
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <div
                          key={task.id}
                          data-kanban-card={task.id}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = 'move';
                            event.dataTransfer.setData('text/plain', task.id);
                            draggedTaskRef.current = task.id;
                            setDraggedTaskId(task.id);
                          }}
                          onDragEnd={() => {
                            draggedTaskRef.current = null;
                            setDraggedTaskId(null);
                            setDragOverStatus(null);
                          }}
                          className={`cursor-grab active:cursor-grabbing ${draggedTaskId === task.id ? 'opacity-45' : ''}`}
                        >
                          <TaskKanbanCard task={task} onStatusChange={onTaskStatusChange} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500">{draggedTaskId ? 'Drop here to update status.' : 'No matching tasks.'}</div>
                  )}
                </section>
              );
            })}
            </div>
          </div>
        </div>
      ) : null}

      <div className={view === 'kanban' ? 'hidden print:block' : ''}>
        <section className="break-inside-avoid">
          <div className="mb-3">
            <h3 className="text-xl font-bold">All Items</h3>
            <p className="mt-1 text-sm text-slate-500">A single due-date ordered list across every workstream and phase.</p>
          </div>
          {sortedTasks.length ? (
            <div className="space-y-3">
              {sortedTasks.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-5 text-slate-500">No matching tasks.</div>
          )}
        </section>
      </div>
    </div>
  );
}
