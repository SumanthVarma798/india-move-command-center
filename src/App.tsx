import { type ReactElement, useEffect, useRef, useState } from 'react';
import { DataControls } from './components/DataControls';
import { PasswordPanel } from './components/PasswordPanel';
import { Shell } from './components/Shell';
import { initialData } from './data/initialData';
import { AfterLandingPage } from './pages/AfterLandingPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FinancePage } from './pages/FinancePage';
import { HomeDashboard } from './pages/HomeDashboard';
import { PhonePage } from './pages/PhonePage';
import { TravelVisaPage } from './pages/TravelVisaPage';
import { loadSharedDashboard, saveSharedDashboard } from './services/supabase';
import type { AppData, DecisionStatus, DocumentStatus, TaskStatus } from './types';
import { hydrateAppData } from './utils/dataMerge';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState<AppData | null>(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Password required');
  const [sharedPassword, setSharedPassword] = useState(() => window.sessionStorage.getItem('india-dashboard-password') ?? '');
  const lastRemoteJson = useRef('');

  useEffect(() => {
    if (sharedPassword) {
      void unlockDashboard(sharedPassword, false);
    }
  }, []);

  async function unlockDashboard(password: string, persistPassword = true) {
    setRemoteReady(false);
    setSyncStatus('Loading shared dashboard...');

    const { data: remoteData, error } = await loadSharedDashboard(password);
    if (error) {
      setData(null);
      setSharedPassword('');
      window.sessionStorage.removeItem('india-dashboard-password');
      setSyncStatus(error.message.includes('Invalid') ? 'Invalid password.' : `Unable to unlock: ${error.message}`);
      return;
    }

    if (persistPassword) {
      window.sessionStorage.setItem('india-dashboard-password', password);
      setSharedPassword(password);
    }

    if (remoteData) {
      const loadedData = hydrateAppData(remoteData as AppData);
      lastRemoteJson.current = JSON.stringify(loadedData);
      setData(loadedData);
      setSyncStatus('Loaded from Supabase');
    } else {
      const seedData = { ...initialData, meta: { ...initialData.meta, lastUpdated: new Date().toISOString() } };
      const { data: savedAt, error: saveError } = await saveSharedDashboard(password, seedData);
      if (saveError) {
        setData(null);
        setSyncStatus(`Unable to create dashboard: ${saveError.message}`);
        return;
      }
      setData(seedData);
      lastRemoteJson.current = JSON.stringify(seedData);
      setSyncStatus(`Created shared dashboard${savedAt ? ` at ${new Date(savedAt).toLocaleTimeString()}` : ''}`);
    }

    setRemoteReady(true);
  }

  useEffect(() => {
    if (!sharedPassword || !remoteReady || !data) return;

    const nextJson = JSON.stringify(data);
    if (nextJson === lastRemoteJson.current) return;

    setSyncStatus('Saving...');
    const timeout = window.setTimeout(async () => {
      const { data: savedAt, error } = await saveSharedDashboard(sharedPassword, data);
      if (error) {
        setSyncStatus(`Save failed: ${error.message}`);
        return;
      }
      lastRemoteJson.current = nextJson;
      setSyncStatus(`Saved${savedAt ? ` at ${new Date(savedAt).toLocaleTimeString()}` : ''}`);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [data, remoteReady, sharedPassword]);

  function lockDashboard() {
    setData(null);
    setRemoteReady(false);
    setSharedPassword('');
    lastRemoteJson.current = '';
    window.sessionStorage.removeItem('india-dashboard-password');
    setSyncStatus('Password required');
  }

  function importData(nextData: AppData) {
    setData(hydrateAppData({ ...initialData, ...nextData, meta: { ...initialData.meta, ...nextData.meta } }));
  }

  function updateTaskStatus(id: string, status: TaskStatus) {
    if (!data) return;
    setData((current) => ({
      ...current!,
      tasks: current!.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      afterLanding: current!.afterLanding.map((task) => (task.id === id ? { ...task, status } : task)),
    }));
  }

  function updatePhoneStatus(id: string, status: TaskStatus) {
    if (!data) return;
    setData((current) => ({
      ...current!,
      phoneChecklist: current!.phoneChecklist.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function updateDocumentStatus(id: string, status: DocumentStatus) {
    if (!data) return;
    setData((current) => ({
      ...current!,
      documents: current!.documents.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function updateFinance(id: string, patch: { decision?: DecisionStatus; status?: TaskStatus }) {
    if (!data) return;
    setData((current) => ({
      ...current!,
      finance: current!.finance.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  const pages: Record<string, ReactElement> | null = data
    ? {
        home: <HomeDashboard data={data} onTaskStatusChange={updateTaskStatus} />,
        checklist: <ChecklistPage data={data} onTaskStatusChange={updateTaskStatus} />,
        phone: <PhonePage data={data} onPhoneStatusChange={updatePhoneStatus} />,
        travel: <TravelVisaPage data={data} onTaskStatusChange={updateTaskStatus} />,
        documents: <DocumentsPage data={data} onDocumentStatusChange={updateDocumentStatus} />,
        finance: <FinancePage data={data} onFinanceChange={updateFinance} />,
        india: <AfterLandingPage data={data} onTaskStatusChange={updateTaskStatus} />,
      }
    : null;

  return (
    <Shell activePage={activePage} setActivePage={setActivePage}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center print:hidden">
        <p className="text-sm font-semibold text-slate-500">Shared Supabase tracker · password protected · no sensitive documents</p>
        {data ? <DataControls data={data} onImport={importData} onReset={() => setData(initialData)} /> : null}
      </div>
      <div className="mb-6">
        <PasswordPanel locked={!data} status={syncStatus} onUnlock={unlockDashboard} onLock={lockDashboard} />
      </div>
      {pages ? pages[activePage] ?? pages.home : <AuthRequired />}
    </Shell>
  );
}

function AuthRequired() {
  return (
    <section className="rounded-[2.5rem] border border-white/80 bg-white/75 p-8 shadow-glow backdrop-blur sm:p-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Shared dashboard</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Enter the shared password to load your move command center.</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Task status is stored in one shared Supabase record so trusted helpers can update the same tracker.
      </p>
    </section>
  );
}

export default App;
