import type { Session } from '@supabase/supabase-js';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import { DataControls } from './components/DataControls';
import { Shell } from './components/Shell';
import { SyncPanel } from './components/SyncPanel';
import { initialData } from './data/initialData';
import { AfterLandingPage } from './pages/AfterLandingPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FinancePage } from './pages/FinancePage';
import { HomeDashboard } from './pages/HomeDashboard';
import { PhonePage } from './pages/PhonePage';
import { TravelVisaPage } from './pages/TravelVisaPage';
import { loadRemoteDashboard, saveRemoteDashboard, supabase } from './services/supabase';
import type { AppData, DecisionStatus, DocumentStatus, TaskStatus } from './types';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState<AppData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Sign in required');
  const lastRemoteJson = useRef('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: authData }) => setSession(authData.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setData(null);
        setRemoteReady(false);
        setSyncStatus('Sign in required');
        lastRemoteJson.current = '';
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;

    let cancelled = false;
    setRemoteReady(false);
    setSyncStatus('Loading cloud copy...');

    loadRemoteDashboard(userId).then(async ({ data: row, error }) => {
      if (cancelled) return;
      if (error) {
        setSyncStatus(`Sync setup needed: ${error.message}`);
        return;
      }

      if (row?.data) {
        const remoteJson = JSON.stringify(row.data);
        lastRemoteJson.current = remoteJson;
        setData(row.data);
        setSyncStatus(`Loaded cloud copy${row.updated_at ? ` from ${new Date(row.updated_at).toLocaleString()}` : ''}`);
      } else {
        const seedData = { ...initialData, meta: { ...initialData.meta, lastUpdated: new Date().toISOString() } };
        const { error: saveError } = await saveRemoteDashboard(userId, seedData);
        if (cancelled) return;
        if (saveError) {
          setSyncStatus(`Sync setup needed: ${saveError.message}`);
          return;
        }
        setData(seedData);
        lastRemoteJson.current = JSON.stringify(seedData);
        setSyncStatus('Created cloud copy');
      }
      setRemoteReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId || !remoteReady || !data) return;

    const nextJson = JSON.stringify(data);
    if (nextJson === lastRemoteJson.current) return;

    setSyncStatus('Saving...');
    const timeout = window.setTimeout(async () => {
      const { data: row, error } = await saveRemoteDashboard(userId, data);
      if (error) {
        setSyncStatus(`Save failed: ${error.message}`);
        return;
      }
      lastRemoteJson.current = nextJson;
      setSyncStatus(`Saved${row?.updated_at ? ` at ${new Date(row.updated_at).toLocaleTimeString()}` : ''}`);
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [data, remoteReady, session?.user.id]);

  function importData(nextData: AppData) {
    setData({ ...initialData, ...nextData, meta: { ...initialData.meta, ...nextData.meta } });
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
        <p className="text-sm font-semibold text-slate-500">Supabase-backed dashboard · sign-in required · no sensitive documents</p>
        {data ? <DataControls data={data} onImport={importData} onReset={() => setData(initialData)} /> : null}
      </div>
      <div className="mb-6">
        <SyncPanel session={session} syncStatus={syncStatus} onSignOut={() => supabase.auth.signOut()} />
      </div>
      {pages ? pages[activePage] ?? pages.home : <AuthRequired />}
    </Shell>
  );
}

function AuthRequired() {
  return (
    <section className="rounded-[2.5rem] border border-white/80 bg-white/75 p-8 shadow-glow backdrop-blur sm:p-12">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Cloud dashboard</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Sign in to load your move command center.</h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Task status is stored in Supabase for your authenticated account. This browser will not keep a local dashboard copy.
      </p>
    </section>
  );
}

export default App;
