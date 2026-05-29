import type { ChangeEvent } from 'react';
import type { AppData } from '../types';
import { exportBackup } from '../utils/storage';

export function DataControls({ data, onImport, onReset }: { data: AppData; onImport: (data: AppData) => void; onReset: () => void }) {
  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(JSON.parse(String(reader.result)) as AppData);
      } catch {
        alert('That backup could not be imported. Please choose a valid JSON export.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button onClick={() => exportBackup(data)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-soft">Export JSON</button>
      <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
        Import JSON
        <input type="file" accept="application/json" onChange={handleImport} className="sr-only" />
      </label>
      <button
        onClick={() => {
          if (confirm('Reset all dashboard data to the original seed data?')) onReset();
        }}
        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-600 ring-1 ring-rose-200"
      >
        Reset demo data
      </button>
    </div>
  );
}
