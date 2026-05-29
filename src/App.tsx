import { type ReactElement, useEffect, useState } from 'react';
import { DataControls } from './components/DataControls';
import { Shell } from './components/Shell';
import { initialData } from './data/initialData';
import { AfterLandingPage } from './pages/AfterLandingPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FinancePage } from './pages/FinancePage';
import { HomeDashboard } from './pages/HomeDashboard';
import { PhonePage } from './pages/PhonePage';
import { TravelVisaPage } from './pages/TravelVisaPage';
import type { AppData, DecisionStatus, DocumentStatus, TaskStatus } from './types';
import { loadData, resetData, saveData } from './utils/storage';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  function importData(nextData: AppData) {
    setData({ ...initialData, ...nextData, meta: { ...initialData.meta, ...nextData.meta } });
  }

  function updateTaskStatus(id: string, status: TaskStatus) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      afterLanding: current.afterLanding.map((task) => (task.id === id ? { ...task, status } : task)),
    }));
  }

  function updatePhoneStatus(id: string, status: TaskStatus) {
    setData((current) => ({
      ...current,
      phoneChecklist: current.phoneChecklist.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function updateDocumentStatus(id: string, status: DocumentStatus) {
    setData((current) => ({
      ...current,
      documents: current.documents.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function updateFinance(id: string, patch: { decision?: DecisionStatus; status?: TaskStatus }) {
    setData((current) => ({
      ...current,
      finance: current.finance.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  const pages: Record<string, ReactElement> = {
    home: <HomeDashboard data={data} onTaskStatusChange={updateTaskStatus} />,
    checklist: <ChecklistPage data={data} onTaskStatusChange={updateTaskStatus} />,
    phone: <PhonePage data={data} onPhoneStatusChange={updatePhoneStatus} />,
    travel: <TravelVisaPage data={data} onTaskStatusChange={updateTaskStatus} />,
    documents: <DocumentsPage data={data} onDocumentStatusChange={updateDocumentStatus} />,
    finance: <FinancePage data={data} onFinanceChange={updateFinance} />,
    india: <AfterLandingPage data={data} onTaskStatusChange={updateTaskStatus} />,
  };

  return (
    <Shell activePage={activePage} setActivePage={setActivePage}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center print:hidden">
        <p className="text-sm font-semibold text-slate-500">Local-only dashboard · no backend · no sensitive documents</p>
        <DataControls data={data} onImport={importData} onReset={() => setData(resetData())} />
      </div>
      {pages[activePage] ?? pages.home}
    </Shell>
  );
}

export default App;
