import { ArrowUpRight } from 'lucide-react';
import Card from './Card';

export default function MetricCard({ icon: Icon, label, value, sublabel, status, tone = 'slate', onClick }) {
  const toneMap = {
    slate: 'bg-slate-950 text-white',
    green: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    red: 'bg-red-600 text-white',
    blue: 'bg-sky-600 text-white'
  };

  return (
    <Card className="p-4" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${toneMap[tone]}`}>
          {Icon && <Icon size={19} />}
        </div>
        <ArrowUpRight className="text-slate-300" size={17} />
      </div>
      <div className="mt-4">
        <p className="text-[12px] font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-[26px] font-black tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-[12px] font-semibold text-slate-500">{sublabel}</p>
        {status && <p className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{status}</p>}
      </div>
    </Card>
  );
}
