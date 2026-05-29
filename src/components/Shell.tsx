import type { ReactNode } from 'react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'phone', label: 'Phone' },
  { id: 'travel', label: 'Travel' },
  { id: 'documents', label: 'Docs' },
  { id: 'finance', label: 'Finance' },
  { id: 'india', label: 'India' },
];

export function Shell({ activePage, setActivePage, children }: { activePage: string; setActivePage: (id: string) => void; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(135deg,#f8fafc,#eef2ff_45%,#f7fee7)] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => setActivePage('home')} className="text-left">
            <p className="text-sm font-semibold tracking-wide text-slate-500">India Move</p>
            <h1 className="text-lg font-bold sm:text-xl">Command Center</h1>
          </button>
          <nav className="no-scrollbar flex max-w-[68vw] gap-2 overflow-x-auto rounded-full bg-slate-100/80 p-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ${
                  activePage === item.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
