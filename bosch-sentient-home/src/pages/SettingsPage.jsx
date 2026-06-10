import { motion } from 'framer-motion';
import { Brain, Euro, PauseCircle, ShieldCheck, SlidersHorizontal, Thermometer } from 'lucide-react';
import Card from '../components/Card';
import ConsentToggle from '../components/ConsentToggle';

export default function SettingsPage({ consent, preferences, onToggleConsent, onPreferenceChange, onClose }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-200">
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Settings</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">Consent, preferences, and autonomy boundaries.</h2>
          </div>
        </div>
        <button className="soft-button mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-[13px] font-black text-white">
          <PauseCircle size={16} /> Pause all automation
        </button>
      </Card>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Comfort preferences</h2>
        <Card className="p-5">
          <Slider
            icon={Thermometer}
            label="Office focus temperature"
            value={preferences.comfort.officeFocusTemp}
            min={18}
            max={25}
            suffix="°C"
            onChange={(value) => onPreferenceChange('comfort', 'officeFocusTemp', value)}
          />
          <Slider
            icon={Thermometer}
            label="Auto-heating range"
            value={preferences.comfort.autoHeatingRange}
            min={0}
            max={4}
            suffix="°C"
            onChange={(value) => onPreferenceChange('comfort', 'autoHeatingRange', value)}
          />
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Energy preferences</h2>
        <Card className="p-5">
          <Slider
            icon={Euro}
            label="Monthly energy budget"
            value={preferences.energy.monthlyBudget}
            min={80}
            max={300}
            suffix="€"
            onChange={(value) => onPreferenceChange('energy', 'monthlyBudget', value)}
          />
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Safety boundaries</h2>
        <div className="space-y-3">
          <SafetyPreference icon={ShieldCheck} title="Children cannot activate stove/oven" enabled={preferences.safety.blockChildCooking} />
          <SafetyPreference icon={ShieldCheck} title="Door unlock always requires approval" enabled={preferences.safety.doorUnlockRequiresApproval} />
          <SafetyPreference icon={Brain} title="Critical risk actions are auto-blocked" enabled={preferences.automation.criticalRiskAutoBlock} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Consent center</h2>
        <div className="space-y-3">
          {consent.map((item) => (
            <ConsentToggle key={item.id} item={item} onToggle={onToggleConsent} />
          ))}
        </div>
      </section>

      <button onClick={onClose} className="soft-button w-full rounded-2xl bg-slate-950 px-4 py-3 text-[13px] font-black text-white">
        Save and return
      </button>
    </motion.div>
  );
}

function Slider({ icon: Icon, label, value, min, max, suffix, onChange }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-slate-400" />
          <p className="text-[13px] font-black text-slate-800">{label}</p>
        </div>
        <p className="text-[13px] font-black text-slate-950">{suffix === '€' ? `${value}${suffix}` : `${value}${suffix}`}</p>
      </div>
      <input
        className="range-slider mt-3 w-full"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function SafetyPreference({ icon: Icon, title, enabled }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon size={18} /></div>
        <div className="flex-1">
          <h3 className="text-[13px] font-black text-slate-950">{title}</h3>
          <p className="text-[11px] font-semibold text-slate-400">{enabled ? 'Enabled' : 'Disabled'}</p>
        </div>
        <span className={`h-3 w-3 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      </div>
    </Card>
  );
}
