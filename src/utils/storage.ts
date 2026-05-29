import { initialData } from '../data/initialData';
import type { AppData } from '../types';

const STORAGE_KEY = 'india-move-command-center:v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    return { ...initialData, ...JSON.parse(raw) } as AppData;
  } catch {
    return initialData;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, meta: { ...data.meta, lastUpdated: new Date().toISOString() } }));
}

export function resetData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

export function exportBackup(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `india-move-command-center-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
