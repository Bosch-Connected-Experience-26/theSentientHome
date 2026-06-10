import { BrainCircuit, CheckCircle2, CloudRain, Database, Home, Network } from 'lucide-react';
import { systemIntelligence } from '../data/mockData';

const iconMap = {
  'home-connect': Home,
  'bosch-smart-home': Network,
  'aws-agentcore': BrainCircuit,
  'mongodb-atlas': Database,
  'llm-risk': CheckCircle2,
  'external-context': CloudRain
};

export default function SystemIntelligencePanel() {
  return (
    <div className="rounded-[26px] border border-slate-100 bg-slate-950 p-4 text-white">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-sky-200">
          <BrainCircuit size={18} />
        </div>
        <div>
          <h3 className="text-[15px] font-black">System Intelligence</h3>
          <p className="text-[11px] font-semibold text-white/55">Decision stack visible for trust and judging</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {systemIntelligence.map((item) => {
          const Icon = iconMap[item.id] || CheckCircle2;
          return (
            <div key={item.id} className="flex gap-3 rounded-2xl bg-white/[0.06] p-3">
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-sky-200">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-[12px] font-black">{item.title}</p>
                <p className="mt-0.5 text-[11px] font-bold text-emerald-200">{item.status}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/58">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
