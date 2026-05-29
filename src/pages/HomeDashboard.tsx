import type { AppData } from '../types';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { TaskRow } from '../components/TaskRow';
import { allOperationalItems, daysUntil, percentDone, sortedUrgentTasks } from '../utils/progress';
import type { TaskStatus } from '../types';

export function HomeDashboard({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const countdown = daysUntil('2026-06-21');
  const progress = percentDone(allOperationalItems([...data.tasks, ...data.afterLanding], data.phoneChecklist));
  const priorities = sortedUrgentTasks([...data.tasks, ...data.afterLanding]);

  return (
    <div>
      <section className="mb-8 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-glow backdrop-blur sm:p-10">
        <PageHeader
          kicker="Permanent move · June 21, 2026"
          title="India Move Command Center"
          body="A calm daily dashboard for status, checklists, reminders, and links. Sensitive files stay in Google Drive. Secrets stay in your password manager."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Days to Departure" value={countdown >= 0 ? countdown : 'Landed'} detail="SEA to LHR to HYD on British Airways." />
          <MetricCard label="Overall Progress" value={`${progress}%`} detail="Calculated from tasks and OTP checklist completion.">
            <div className="mt-4 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-slate-950" style={{ width: `${progress}%` }} /></div>
          </MetricCard>
          <MetricCard label="Next Action" value="Now" detail={data.meta.nextAction} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h3 className="mb-3 text-xl font-bold">Top 5 Priorities</h3>
          <div className="space-y-3">
            {priorities.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}
          </div>
        </section>
        <aside className="space-y-4">
          <MetricCard label="Waiting On Others" value={data.meta.waitingOn.length}>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">{data.meta.waitingOn.map((item) => <li key={item}>• {item}</li>)}</ul>
          </MetricCard>
          <MetricCard label="Risks" value={data.meta.risks.length}>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">{data.meta.risks.map((item) => <li key={item}>• {item}</li>)}</ul>
          </MetricCard>
          <MetricCard label="Critical Deadlines" value={data.meta.deadlines.length}>
            <div className="mt-4 space-y-3">
              {data.meta.deadlines.map((deadline) => (
                <div key={deadline.label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold">{deadline.label}</p>
                  <p className="text-sm text-slate-500">{deadline.date} · {deadline.notes}</p>
                </div>
              ))}
            </div>
          </MetricCard>
        </aside>
      </div>
    </div>
  );
}
