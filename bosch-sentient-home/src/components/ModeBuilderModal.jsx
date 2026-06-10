import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import Modal from './Modal';

export default function ModeBuilderModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('Homework Evening Mode');
  const [trigger, setTrigger] = useState('Weekdays 16:00–18:00 when kids are home');
  const [rules, setRules] = useState('Warm study lights, disable TV plug, delay noisy appliances, keep Kids Safety active');

  const submit = () => {
    const payload = {
      name,
      description: 'Custom household mode created by Leila for school evenings.',
      trigger,
      devicesAffected: ['Kids Room Lights', 'Living Room TV Plug', 'Washing Machine', 'Assistant Notifications'],
      rules: rules.split(',').map((rule) => rule.trim()).filter(Boolean),
      safetyOverrides: ['Kids Safety remains active'],
      energyBehavior: 'Balanced with distraction reduction',
      notificationLevel: 'Safety and homework only'
    };
    onCreate(payload);
    onClose();
  };

  return (
    <Modal open={open} title="Custom Mode Builder" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-[26px] bg-slate-950 p-4 text-white">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-sky-200">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-[14px] font-black">Build a household mode</p>
              <p className="text-[11px] font-semibold text-white/55">Mode rules can later be sent to POST /api/modes/custom.</p>
            </div>
          </div>
        </div>

        <Field label="Mode name" value={name} onChange={setName} />
        <Field label="Trigger" value={trigger} onChange={setTrigger} />
        <label className="block">
          <span className="text-[12px] font-black text-slate-700">Rules</span>
          <textarea
            value={rules}
            onChange={(event) => setRules(event.target.value)}
            rows={5}
            className="mt-2 w-full resize-none rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-slate-400"
          />
        </label>
        <button onClick={submit} className="soft-button w-full rounded-2xl bg-slate-950 px-4 py-3 text-[13px] font-black text-white">
          Create and activate mode
        </button>
      </div>
    </Modal>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-[12px] font-black text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none focus:border-slate-400"
      />
    </label>
  );
}
