export type TaskStatus = 'todo' | 'in progress' | 'waiting' | 'done';
export type Priority = 'critical' | 'high' | 'normal' | 'optional';
export type DecisionStatus = 'keep' | 'cancel' | 'downgrade later' | 'undecided';
export type DocumentStatus = 'ready' | 'needs update' | 'missing' | 'review';

export type Phase =
  | 'Before Biometrics'
  | 'Before June 15'
  | 'Departure Week'
  | 'Travel Day'
  | 'Heathrow Transit'
  | 'First Week in India'
  | 'First 90 Days in India';

export interface MoveTask {
  id: string;
  title: string;
  phase: Phase;
  status: TaskStatus;
  priority: Priority;
  notes: string;
  dueDate?: string;
}

export interface PhoneChecklistItem {
  id: string;
  provider: 'Chase' | 'Fidelity' | 'Google' | 'Capital One';
  title: string;
  status: TaskStatus;
  notes: string;
}

export interface DocumentItem {
  id: string;
  folder: string;
  status: DocumentStatus;
  location: string;
  offlineRequired: boolean;
  printedRequired: boolean;
  notes: string;
}

export interface FinanceItem {
  id: string;
  name: string;
  type: 'banking' | 'retirement' | 'credit card' | 'subscription';
  decision: DecisionStatus;
  status: TaskStatus;
  notes: string;
}

export interface AppData {
  tasks: MoveTask[];
  phoneChecklist: PhoneChecklistItem[];
  documents: DocumentItem[];
  finance: FinanceItem[];
  afterLanding: MoveTask[];
  meta: {
    lastUpdated: string;
    nextAction: string;
    risks: string[];
    waitingOn: string[];
    deadlines: { label: string; date: string; notes: string }[];
  };
}
