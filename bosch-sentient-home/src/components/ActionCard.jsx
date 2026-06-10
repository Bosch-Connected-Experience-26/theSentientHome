import { Check, ChevronRight, Clock, HelpCircle, X } from 'lucide-react';
import Card from './Card';
import { riskCopy } from '../utils/riskEngine';

export default function ActionCard({ action, onApprove, onReject, onExplain, compact = false }) {
  const risk = riskCopy[action.riskLevel] || riskCopy.Low;
  const statusClass = {
    'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-100',
    Suggested: 'bg-sky-50 text-sky-700 border-sky-100',
    'Auto-handled': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Rejected: 'bg-slate-100 text-slate-500 border-slate-200',
    Blocked: 'bg-red-50 text-red-700 border-red-100'
  };

  return (
    <Card className={`${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${statusClass[action.status] || statusClass.Suggested}`}>
              {action.status}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${risk.className}`}>
              {risk.label}
            </span>
          </div>
          <h3 className="mt-3 text-[16px] font-black leading-tight tracking-tight text-slate-950">{action.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
          {action.confidence}%
        </div>
      </div>
      <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-500">{action.description}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2">
          {action.devices.slice(0, 3).map((device) => (
            <span key={device} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
              {device}
            </span>
          ))}
        </div>
      )}

      {action.scheduledFor && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-[12px] font-bold text-slate-600">
          <Clock size={15} /> Scheduled: {action.scheduledFor}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {action.status === 'Pending Approval' || action.status === 'Suggested' ? (
          <>
            <button onClick={() => onApprove(action.id)} className="soft-button flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-3 text-[12px] font-black text-white">
              <Check size={15} /> Approve
            </button>
            <button onClick={() => onReject(action.id)} className="soft-button grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <X size={16} />
            </button>
          </>
        ) : (
          <button onClick={() => onExplain(action.explanationId)} className="soft-button flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-3 text-[12px] font-black text-slate-700">
            View details <ChevronRight size={15} />
          </button>
        )}
        <button onClick={() => onExplain(action.explanationId)} className="soft-button flex items-center justify-center gap-2 rounded-2xl bg-sky-50 px-3 py-3 text-[12px] font-black text-sky-700">
          <HelpCircle size={15} /> Why?
        </button>
      </div>
    </Card>
  );
}
