import { AlertTriangle, CheckCircle2, Gauge, GitBranch, ListChecks, ShieldAlert } from 'lucide-react';
import Modal from './Modal';
import SystemIntelligencePanel from './SystemIntelligencePanel';

export default function ExplainabilityModal({ explanation, open, onClose }) {
  if (!explanation) return null;

  const riskTone = explanation.riskLevel === 'Critical' ? 'bg-red-50 text-red-700' : explanation.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';

  return (
    <Modal open={open} title={explanation.title} onClose={onClose} size="full">
      <div className="space-y-5">
        <div className="rounded-[26px] bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-black ${riskTone}`}>{explanation.riskLevel} risk</span>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-black text-white">{explanation.decision}</span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-black text-sky-700">{explanation.confidence}% confidence</span>
          </div>
          <p className="mt-4 text-[14px] font-semibold leading-relaxed text-slate-700">{explanation.summary}</p>
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={18} className="text-slate-500" />
            <h3 className="text-[15px] font-black text-slate-950">Decision timeline</h3>
          </div>
          <div className="space-y-3">
            {explanation.timeline.map((item, index) => (
              <div key={`${item.time}-${index}`} className="flex gap-3">
                <div className="flex w-12 shrink-0 justify-end text-[11px] font-black text-slate-400">{item.time}</div>
                <div className="relative flex-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  <span className="absolute -left-[19px] top-4 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <p className="text-[12px] font-semibold leading-relaxed text-slate-600">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <InfoBlock icon={Gauge} title="Signals used" items={explanation.signals} />
          <InfoBlock icon={ShieldAlert} title="Rules applied" items={explanation.rules} />
          <InfoBlock icon={CheckCircle2} title="Preferences matched" items={explanation.preferences} />
          <InfoBlock icon={ListChecks} title="Alternatives considered" items={explanation.alternatives} />
        </section>

        <SystemIntelligencePanel />

        <div className="rounded-[26px] border border-red-100 bg-red-50 p-4 text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle size={17} />
            <p className="text-[13px] font-black">Safety principle</p>
          </div>
          <p className="mt-2 text-[12px] font-semibold leading-relaxed">
            Critical-risk actions are blocked by backend safety logic. The frontend only displays the decision and cannot bypass household safety rules.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function InfoBlock({ icon: Icon, title, items }) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-slate-500" />
        <h3 className="text-[13px] font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
