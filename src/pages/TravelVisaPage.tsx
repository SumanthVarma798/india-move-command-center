import type { AppData, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { TaskRow } from '../components/TaskRow';
import { visaDecisionTiming } from '../utils/progress';

export function TravelVisaPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  const travelTasks = data.tasks.filter((task) => ['Before Biometrics', 'Departure Week', 'Travel Day', 'Heathrow Transit'].includes(task.phase));
  const visaTimer = visaDecisionTiming();
  return (
    <div>
      <PageHeader kicker="Travel and visa" title="SEA → LHR → HYD" body="British Airways departure moved to July 5, 2026 with a 1h45m Heathrow transit. UK visa biometrics were completed June 9; the decision is still pending." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-slate-500">Route</p><p className="mt-2 text-2xl font-bold">SEA → LHR → HYD</p></div>
        <div className="rounded-[2rem] bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-slate-500">Departure</p><p className="mt-2 text-2xl font-bold">July 5, 2026</p></div>
        <div className="rounded-[2rem] bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-slate-500">Biometrics</p><p className="mt-2 text-2xl font-bold">Done Jun 9</p></div>
        <div className="rounded-[2rem] bg-white/80 p-5 shadow-soft"><p className="text-sm font-bold text-slate-500">Visa checkpoint</p><p className="mt-2 text-2xl font-bold">{visaTimer.remainingBusinessDays > 0 ? `${visaTimer.remainingBusinessDays} workdays` : 'Follow up'}</p><p className="mt-2 text-sm text-slate-500">15th UK working day: {visaTimer.expectedDate}</p></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-xl font-bold">Critical Travel Docs</h3>
          <div className="space-y-3">{data.documents.filter((doc) => doc.printedRequired || doc.offlineRequired).slice(0, 7).map((doc) => <div key={doc.id} className="rounded-3xl bg-white/80 p-4 shadow-sm"><p className="font-bold">{doc.folder}</p><p className="text-sm text-slate-600">{doc.location} · Offline {doc.offlineRequired ? 'yes' : 'no'} · Printed {doc.printedRequired ? 'yes' : 'no'}</p></div>)}</div>
        </section>
        <section>
          <h3 className="mb-3 text-xl font-bold">Day-of-Transit Checklist</h3>
          <div className="space-y-3">{travelTasks.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}</div>
        </section>
      </div>
    </div>
  );
}
