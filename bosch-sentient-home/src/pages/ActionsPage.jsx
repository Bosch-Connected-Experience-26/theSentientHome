import { motion } from 'framer-motion';
import { CheckCircle2, Filter, ListChecks } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActionCard from '../components/ActionCard';
import Card from '../components/Card';

const filters = ['All', 'Pending Approval', 'Auto-handled', 'Scheduled', 'Rejected'];

export default function ActionsPage({ actions, onApprove, onReject, onExplain }) {
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(() => (filter === 'All' ? actions : actions.filter((action) => action.status === filter)), [actions, filter]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-200">
            <ListChecks size={23} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">AI action queue</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">Suggestions, approvals, and auto-handled tasks.</h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="Pending" value={actions.filter((a) => a.status === 'Pending Approval').length} />
          <Stat label="Handled" value={actions.filter((a) => a.status === 'Auto-handled').length} />
          <Stat label="Scheduled" value={actions.filter((a) => a.status === 'Scheduled').length} />
        </div>
      </Card>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-[11px] font-black text-slate-500 shadow-sm">
          <Filter size={13} /> Filter
        </div>
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`soft-button shrink-0 rounded-full px-4 py-2 text-[11px] font-black ${filter === item ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 shadow-sm'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <h3 className="mt-3 text-[16px] font-black text-slate-950">Nothing here</h3>
          <p className="mt-1 text-[13px] font-semibold text-slate-500">No actions match this filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((action) => (
            <ActionCard key={action.id} action={action} onApprove={onApprove} onReject={onReject} onExplain={onExplain} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="text-[22px] font-black text-white">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/42">{label}</p>
    </div>
  );
}
