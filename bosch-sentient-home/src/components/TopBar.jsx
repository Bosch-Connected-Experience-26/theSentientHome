import { Bell, Menu, Settings2, ShieldCheck } from 'lucide-react';

export default function TopBar({ onOpenSettings, onTriggerSafety, alertCount }) {
  return (
    <header className="sticky top-0 z-20 bg-white/55 backdrop-blur-2xl">
      <div className="bosch-line" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
            <ShieldCheck size={19} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Bosch</p>
            <h1 className="text-[17px] font-black tracking-tight text-slate-950">Sentient Home</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerSafety}
            className="soft-button relative grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"
            aria-label="Trigger safety demo alert"
            title="Trigger Mia stove safety demo"
          >
            <Bell size={18} />
            {alertCount > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="soft-button grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm"
            aria-label="Open settings"
          >
            <Settings2 size={18} />
          </button>
          <button className="soft-button grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm" aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
