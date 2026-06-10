import { motion } from 'framer-motion';
import { BellOff, BookOpen, Briefcase, Lock, Moon, Plane, Plus, Shield, Sparkles, Users } from 'lucide-react';
import Card from '../components/Card';

const iconMap = {
  Briefcase,
  BellOff,
  Shield,
  BookOpen,
  Users,
  Moon,
  Lock,
  Plane,
  Sparkles
};

export default function ModesPage({ modes, onActivateMode, onOpenBuilder }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-200">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Modes & Routines</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">The home adapts to the household rhythm.</h2>
          </div>
        </div>
        <button onClick={onOpenBuilder} className="soft-button mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-[13px] font-black text-slate-950">
          <Plus size={16} /> Build custom mode
        </button>
      </Card>

      <div className="space-y-3">
        {modes.map((mode) => {
          const Icon = iconMap[mode.icon] || Sparkles;
          return (
            <Card key={mode.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${mode.active ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[15px] font-black text-slate-950">{mode.name}</h3>
                      <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-500">{mode.description}</p>
                    </div>
                    {mode.active && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Active</span>}
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Trigger</p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-600">{mode.trigger}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mode.rules.slice(0, 3).map((rule) => (
                      <span key={rule} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{rule}</span>
                    ))}
                  </div>
                  {!mode.active && (
                    <button onClick={() => onActivateMode(mode.id)} className="soft-button mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-[12px] font-black text-white">
                      Activate mode
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
