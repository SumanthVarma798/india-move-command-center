import type { AppData, DocumentStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export function DocumentsPage({ data, onDocumentStatusChange }: { data: AppData; onDocumentStatusChange: (id: string, status: DocumentStatus) => void }) {
  return (
    <div>
      <PageHeader kicker="Drive stays source of truth" title="Documents" body="This page tracks readiness by folder only. Do not store scans, identifiers, account numbers, or private documents in the dashboard." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.documents.map((doc) => (
          <article key={doc.id} className="rounded-[2rem] bg-white/85 p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="font-bold">{doc.folder}</h3><p className="mt-1 text-sm text-slate-500">{doc.location}</p></div>
              <StatusBadge value={doc.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{doc.notes}</p>
            <div className="mt-4 flex gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">Offline: {doc.offlineRequired ? 'yes' : 'no'}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Printed: {doc.printedRequired ? 'yes' : 'no'}</span>
            </div>
            <select value={doc.status} onChange={(event) => onDocumentStatusChange(doc.id, event.target.value as DocumentStatus)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
              <option value="ready">ready</option><option value="needs update">needs update</option><option value="missing">missing</option><option value="review">review</option>
            </select>
          </article>
        ))}
      </div>
    </div>
  );
}
