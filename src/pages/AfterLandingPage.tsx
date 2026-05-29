import type { AppData, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { TaskRow } from '../components/TaskRow';

export function AfterLandingPage({ data, onTaskStatusChange }: { data: AppData; onTaskStatusChange: (id: string, status: TaskStatus) => void }) {
  return (
    <div>
      <PageHeader kicker="First 90 days" title="After Landing India" body="The landing checklist for SIM, banking, UPI, address, healthcare, and tax planning once the relocation switches from travel mode to setup mode." />
      <div className="space-y-3">
        {data.afterLanding.map((task) => <TaskRow key={task.id} task={task} onStatusChange={onTaskStatusChange} />)}
      </div>
    </div>
  );
}
