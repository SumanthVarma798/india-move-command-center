import type { MoveTask, PhoneChecklistItem, TaskStatus } from '../types';

export const workstreams = [
  { id: 'immigration', label: 'Immigration & Visa', description: 'Biometrics, UK transit visa, H1B, and travel eligibility.' },
  { id: 'phone', label: 'Phone & OTP', description: 'AT&T payoff, unlock, Tello port, WiFi calling, and OTP continuity.' },
  { id: 'money', label: 'Money & Accounts', description: 'Bank buffer, cards, 401k, tax planning, and India banking.' },
  { id: 'home', label: 'Home & Subscriptions', description: 'Xfinity, Netflix, Prime, packing, and service shutdowns.' },
  { id: 'documents', label: 'Documents', description: 'Google Drive readiness, printed packet, and offline copies.' },
  { id: 'travel', label: 'Travel Day', description: 'Airport, Heathrow transit, and flight execution.' },
  { id: 'india', label: 'India Setup', description: 'SIM, UPI, address, healthcare, and first-90-days setup.' },
] as const;

export type WorkstreamId = (typeof workstreams)[number]['id'];

const taskWorkstreamMap: Record<string, WorkstreamId> = {
  'bio-packet': 'immigration',
  'bio-confirm': 'immigration',
  'phone-payoff': 'phone',
  'phone-unlock': 'phone',
  'tello-port': 'phone',
  'otp-tests': 'phone',
  'indian-sim': 'phone',
  'land-sim': 'phone',
  'chase-buffer': 'money',
  'bank-start': 'money',
  'tax-planning': 'money',
  'land-bank': 'money',
  'land-pan': 'money',
  'land-upi': 'money',
  'land-tax': 'money',
  'cancel-xfinity': 'home',
  'xfinity-netflix': 'home',
  'cancel-prime': 'home',
  'packing-final': 'home',
  'drive-cleanup': 'documents',
  'print-docs': 'documents',
  'offline-docs': 'documents',
  'sea-airport': 'travel',
  'lhr-transit': 'travel',
  'land-address': 'india',
  'land-health': 'india',
};

export function getTaskWorkstream(task: MoveTask): WorkstreamId {
  return taskWorkstreamMap[task.id] ?? 'documents';
}

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

export function workstreamProgress(tasks: MoveTask[], phone: PhoneChecklistItem[]) {
  return workstreams.map((workstream) => {
    const streamTasks = tasks.filter((task) => getTaskWorkstream(task) === workstream.id);
    const items = workstream.id === 'phone' ? [...streamTasks, ...phone] : streamTasks;
    return {
      ...workstream,
      items,
      done: items.filter((item) => item.status === 'done').length,
      waiting: items.filter((item) => item.status === 'waiting').length,
      total: items.length,
      percent: percentDone(items),
    };
  });
}
