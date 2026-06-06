import type { AppData, TaskStatus } from '../types';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export function PhonePage({ data, onPhoneStatusChange }: { data: AppData; onPhoneStatusChange: (id: string, status: TaskStatus) => void }) {
  return (
    <div>
      <PageHeader kicker="OTP continuity" title="Phone Number / OTP Plan" body="Preserve access to US accounts while moving the device and number into a low-cost, India-friendly setup." />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white/80 p-5 shadow-soft">
          <h3 className="text-xl font-bold">Current Setup</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Device</dt><dd className="font-semibold">iPhone 15 Pro</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">AT&T payoff remaining</dt><dd className="font-semibold">$194.37</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Bill target</dt><dd className="font-semibold">~$35 → ~$5/mo</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Current number</dt><dd className="font-semibold">US number ending 2901</dd></div>
          </dl>
          <div className="mt-6 rounded-3xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Paying off now gives up the remaining 7 months of phone credits, but unlocks the device and enables a Tello move that should lower the monthly bill materially.
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-4">
            <h4 className="font-bold">Plan</h4>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>1. Pay off phone.</li>
              <li>2. Unlock AT&T device.</li>
              <li>3. Port to Tello.</li>
              <li>4. Enable WiFi calling.</li>
              <li>5. Test OTPs before departure.</li>
            </ol>
          </div>
        </section>
        <section className="space-y-3">
          {data.phoneChecklist.map((item) => (
            <article key={item.id} className="rounded-3xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{item.provider}</h3><StatusBadge value={item.status} /></div>
                  <p className="mt-1 font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.notes}</p>
                </div>
                <select value={item.status} onChange={(event) => onPhoneStatusChange(item.id, event.target.value as TaskStatus)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                  <option value="todo">todo</option><option value="in progress">in progress</option><option value="waiting">waiting</option><option value="done">done</option>
                </select>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
