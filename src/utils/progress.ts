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
  'visa-decision-watch': 'immigration',
  'visa-contingency': 'immigration',
  'phone-payoff': 'phone',
  'phone-unlock': 'phone',
  'confirm-tello-abroad': 'phone',
  'collect-att-port-info': 'phone',
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
  'confirm-july5-itinerary': 'travel',
  'check-heathrow-transit-after-flight-change': 'travel',
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

function parseLocalDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function addBusinessDays(startDate: string, businessDays: number) {
  const date = parseLocalDate(startDate);
  let added = 0;

  while (added < businessDays) {
    date.setDate(date.getDate() + 1);
    if (isWeekday(date)) added += 1;
  }

  return toIsoDate(date);
}

export function businessDaysElapsedSince(startDate: string, end = new Date()) {
  const current = parseLocalDate(startDate);
  const final = new Date(end);
  final.setHours(0, 0, 0, 0);
  let elapsed = 0;

  while (current < final) {
    current.setDate(current.getDate() + 1);
    if (current <= final && isWeekday(current)) elapsed += 1;
  }

  return elapsed;
}

export function visaDecisionTiming(biometricsDate = '2026-06-09', targetBusinessDays = 15) {
  const expectedDate = addBusinessDays(biometricsDate, targetBusinessDays);
  const elapsedBusinessDays = Math.min(businessDaysElapsedSince(biometricsDate), targetBusinessDays);
  const remainingBusinessDays = Math.max(targetBusinessDays - elapsedBusinessDays, 0);

  return {
    biometricsDate,
    expectedDate,
    elapsedBusinessDays,
    remainingBusinessDays,
    calendarDaysUntilExpected: daysUntil(expectedDate),
  };
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
