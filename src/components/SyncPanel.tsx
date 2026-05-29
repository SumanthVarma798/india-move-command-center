import type { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { supabase } from '../services/supabase';

export function SyncPanel({ session, syncStatus, onSignOut }: { session: Session | null; syncStatus: string; onSignOut: () => void }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function sendMagicLink() {
    if (!email.trim()) return;
    setSending(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href },
    });
    setSending(false);
    setMessage(error ? error.message : 'Check your email for the sign-in link.');
  }

  if (session) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Cloud sync on</p>
            <p className="mt-1 text-emerald-800">{session.user.email} · {syncStatus}</p>
          </div>
          <button onClick={onSignOut} className="rounded-full bg-white px-4 py-2 font-bold text-emerald-800 ring-1 ring-emerald-200">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-950 print:hidden">
      <p className="font-bold">Supabase sign-in required</p>
      <p className="mt-1 text-blue-800">Your dashboard state is loaded from Supabase. This site does not save task progress in browser storage.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-h-11 flex-1 rounded-2xl border border-blue-200 bg-white px-4 outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button onClick={sendMagicLink} disabled={sending || !email.trim()} className="rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {sending ? 'Sending...' : 'Email sign-in link'}
        </button>
      </div>
      {message ? <p className="mt-2 text-blue-800">{message}</p> : null}
    </div>
  );
}
