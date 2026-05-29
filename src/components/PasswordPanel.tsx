import { useState } from 'react';

export function PasswordPanel({
  locked,
  status,
  onUnlock,
  onLock,
}: {
  locked: boolean;
  status: string;
  onUnlock: (password: string) => Promise<void>;
  onLock: () => void;
}) {
  const [password, setPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  async function submitPassword() {
    if (!password.trim()) return;
    setUnlocking(true);
    await onUnlock(password);
    setUnlocking(false);
  }

  if (!locked) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Shared dashboard unlocked</p>
            <p className="mt-1 text-emerald-800">{status}</p>
          </div>
          <button onClick={onLock} className="rounded-full bg-white px-4 py-2 font-bold text-emerald-800 ring-1 ring-emerald-200">
            Lock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-950 print:hidden">
      <p className="font-bold">Shared password</p>
      <p className="mt-1 text-blue-800">Enter the dashboard password to load and save the shared Supabase tracker.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void submitPassword();
          }}
          placeholder="Dashboard password"
          className="min-h-11 flex-1 rounded-2xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={submitPassword}
          disabled={unlocking || !password.trim()}
          className="rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {unlocking ? 'Unlocking...' : 'Unlock'}
        </button>
      </div>
      {status ? <p className="mt-2 text-blue-800">{status}</p> : null}
    </div>
  );
}
