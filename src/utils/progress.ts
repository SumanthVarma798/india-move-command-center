import type { MoveTask, PhoneChecklistItem, TaskStatus } from '../types';

export function percentDone(items: { status: TaskStatus }[]) {
  if (!items.length) return 0;
  return Math.round((items.filter((item) => item.status === 'done').length / items.length) * 100);
}

export function daysUntil(date: string) {
  const today = new Date();
  const target = new Date(`${date}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function sortedUrgentTasks(tasks: MoveTask[], limit = 5) {
  const priorityWeight = { critical: 0, high: 1, normal: 2, optional: 3 };
  return tasks
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return priorityWeight[a.priority] - priorityWeight[b.priority] || dateA - dateB;
    })
    .slice(0, limit);
}

export function allOperationalItems(tasks: MoveTask[], phone: PhoneChecklistItem[]) {
  return [...tasks, ...phone];
}
