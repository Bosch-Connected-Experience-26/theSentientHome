import { motion } from 'framer-motion';
import { AlertTriangle, LockKeyhole, PhoneCall, ShieldCheck, UserRound } from 'lucide-react';
import Card from '../components/Card';

export default function SafetyPage({ family, safetyEvents, onOpenSafetyAlert, onExplain }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Family & Safety</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">Kids Safety Mode is active.</h2>
          </div>
        </div>
        <p className="mt-4 text-[14px] font-semibold leading-relaxed text-white/68">
          Cooking appliances and door unlock actions are restricted for children. Safety alerts override Focus and Do Not Disturb modes.
        </p>
        <button onClick={onOpenSafetyAlert} className="soft-button mt-5 w-full rounded-2xl bg-white px-4 py-3 text-[13px] font-black text-slate-950">
          Trigger Mia stove safety demo
        </button>
      </Card>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Family status</h2>
        <div className="space-y-3">
          {family.map((person) => (
            <Card key={person.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-[14px] font-black text-white">
                  {person.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-black text-slate-950">{person.name}</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">{person.presenceStatus}</span>
                  </div>
                  <p className="mt-1 text-[12px] font-semibold text-slate-500">{person.currentRoom} · {person.activity}</p>
                </div>
                <UserRound size={18} className="text-slate-300" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Safety rules</h2>
        <div className="grid gap-3">
          <Rule icon={LockKeyhole} title="Children cannot activate stove or oven" detail="Requires adult presence and parent approval." />
          <Rule icon={AlertTriangle} title="Critical alerts bypass Focus Mode" detail="Safety never gets muted during meetings." />
          <Rule icon={PhoneCall} title="Parent escalation available" detail="Leila can call child directly from alert card." />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Recent safety events</h2>
        {safetyEvents.map((event) => (
          <Card key={event.id} className="border-red-100 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-red-500">{event.timestamp} · Blocked</p>
                <h3 className="mt-1 text-[16px] font-black text-slate-950">{event.person} attempted to activate the stove</h3>
                <p className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-500">{event.reason}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => onExplain(event.explanationId)} className="soft-button rounded-2xl bg-slate-950 px-3 py-3 text-[12px] font-black text-white">Why?</button>
                  <button onClick={onOpenSafetyAlert} className="soft-button rounded-2xl bg-red-50 px-3 py-3 text-[12px] font-black text-red-700">Open alert</button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </motion.div>
  );
}

function Rule({ icon: Icon, title, detail }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-[13px] font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-[12px] font-semibold text-slate-500">{detail}</p>
        </div>
      </div>
    </Card>
  );
}
