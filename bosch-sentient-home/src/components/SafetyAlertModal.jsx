import { AnimatePresence, motion } from 'framer-motion';
import { PhoneCall, ShieldAlert, SlidersHorizontal, X } from 'lucide-react';

export default function SafetyAlertModal({ open, event, onClose, onExplain }) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-start justify-center glass-modal-backdrop px-3 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="w-full overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >
            <div className="h-1.5 bg-red-600" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">Safety alert</p>
                    <h2 className="mt-1 text-[22px] font-black leading-tight tracking-tight text-slate-950">Stove activation blocked</h2>
                  </div>
                </div>
                <button onClick={onClose} className="soft-button grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-[14px] font-semibold leading-relaxed text-slate-700">
                {event.person} attempted to activate the stove. This was blocked because {event.reason}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Fact label="Person" value={`${event.person}, ${event.age}`} />
                <Fact label="Room" value={event.room} />
                <Fact label="Device" value="Bosch stove" />
                <Fact label="Risk" value={event.riskLevel} danger />
              </div>

              <div className="mt-4 rounded-[24px] bg-slate-50 p-4">
                <p className="text-[12px] font-black text-slate-950">Rule applied</p>
                <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-600">{event.ruleApplied}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.sensorsUsed.map((sensor) => (
                    <span key={sensor} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
                      {sensor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="soft-button flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-[12px] font-black text-white">
                  <PhoneCall size={15} /> Call child
                </button>
                <button onClick={onClose} className="soft-button rounded-2xl bg-red-50 px-3 py-3 text-[12px] font-black text-red-700">
                  Keep blocked
                </button>
                <button onClick={() => onExplain(event.explanationId)} className="soft-button rounded-2xl bg-sky-50 px-3 py-3 text-[12px] font-black text-sky-700">
                  View sensor context
                </button>
                <button className="soft-button flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-3 text-[12px] font-black text-slate-700">
                  <SlidersHorizontal size={15} /> Change rule
                </button>
              </div>

              <button
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-2xl bg-slate-100 px-3 py-3 text-[12px] font-black text-slate-400"
              >
                Allow once — adult presence required first
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Fact({ label, value, danger }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-1 text-[13px] font-black ${danger ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
