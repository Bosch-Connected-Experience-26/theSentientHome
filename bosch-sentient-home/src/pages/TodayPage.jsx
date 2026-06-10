import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  CloudRain,
  Euro,
  LayoutGrid,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Users
} from 'lucide-react';
import ActionCard from '../components/ActionCard';
import Card from '../components/Card';
import ContextChip from '../components/ContextChip';
import MetricCard from '../components/MetricCard';

export default function TodayPage({ overview, family, actions, widgets, onCustomize, onApprove, onReject, onExplain, onNavigate }) {
  const pendingActions = actions.filter((action) => action.status === 'Pending Approval' || action.status === 'Suggested');
  const visibleWidgets = widgets.filter((widget) => widget.visible);
  const sortedWidgets = [...visibleWidgets].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold text-white/55">Good afternoon, {overview.residentName}</p>
            <h2 className="mt-1 text-[26px] font-black leading-tight tracking-tight">Your home is handling the busy part.</h2>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-sky-200 ai-glow">
            <Sparkles size={23} />
          </div>
        </div>
        <p className="mt-4 text-[14px] font-semibold leading-relaxed text-white/70">{overview.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {overview.contextChips.map((chip, index) => (
            <ContextChip key={chip} tone={index === 3 || index === 4 ? 'amber' : 'dark'}>{chip}</ContextChip>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Active mode</p>
            <p className="mt-1 text-[13px] font-black text-white">{overview.currentMode}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Next event</p>
            <p className="mt-1 text-[13px] font-black text-white">{overview.nextEvent.title} · {overview.nextEvent.startsIn}</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black tracking-tight text-slate-950">Dashboard</h2>
          <p className="text-[12px] font-bold text-slate-400">Pinned and personalized for Leila</p>
        </div>
        <button onClick={onCustomize} className="soft-button flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-[12px] font-black text-slate-700 shadow-sm">
          <LayoutGrid size={15} /> Customize
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedWidgets.map((widget) => (
          <WidgetCard key={widget.id} id={widget.id} overview={overview} family={family} onNavigate={onNavigate} />
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-black tracking-tight text-slate-950">AI actions</h2>
            <p className="text-[12px] font-bold text-slate-400">What the home suggests now</p>
          </div>
          <button onClick={() => onNavigate('actions')} className="soft-button flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-[11px] font-black text-white">
            View all <ChevronRight size={13} />
          </button>
        </div>
        {pendingActions.slice(0, 2).map((action) => (
          <ActionCard key={action.id} action={action} compact onApprove={onApprove} onReject={onReject} onExplain={onExplain} />
        ))}
      </section>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={21} />
          </div>
          <div>
            <h3 className="text-[16px] font-black text-slate-950">Demo safety moment ready</h3>
            <p className="text-[12px] font-semibold text-slate-500">Tap the red bell at the top to trigger Mia’s blocked stove attempt.</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function WidgetCard({ id, overview, family, onNavigate }) {
  const cards = {
    safety: <MetricCard icon={ShieldCheck} label="Kids Safety" value="Active" sublabel="Cooking locked for children" status="Protected" tone="green" onClick={() => onNavigate('safety')} />,
    comfort: <MetricCard icon={Thermometer} label="Comfort Score" value={`${overview.comfortScore}`} sublabel="Office aligned for focus" status="87 / 100" tone="blue" onClick={() => onNavigate('insights')} />,
    energy: <MetricCard icon={Euro} label="Energy Budget" value={`${overview.energyBudget.usedPercent}%`} sublabel={`€${overview.energyBudget.projectedSpend} projected`} status={overview.energyBudget.status} tone="amber" onClick={() => onNavigate('insights')} />,
    approvals: <MetricCard icon={ListChecks} label="Pending Approvals" value={overview.pendingApprovals} sublabel="Dishwasher and coffee" status="Needs review" tone="slate" onClick={() => onNavigate('actions')} />,
    appliances: <MetricCard icon={CalendarDays} label="Appliance Queue" value="3" sublabel="Optimized around energy" status="Coordinated" tone="blue" onClick={() => onNavigate('actions')} />,
    weather: <MetricCard icon={CloudRain} label="Weather Context" value="4°C" sublabel="Cold rain in Berlin" status="Winter heating" tone="blue" onClick={() => onNavigate('insights')} />,
    family: <MetricCard icon={Users} label="Family Status" value={`${family.length}/3`} sublabel="Leila, Adam, Mia home" status="Mia in kitchen" tone="green" onClick={() => onNavigate('safety')} />,
    savings: <MetricCard icon={ChartNoAxesCombined} label="Today’s Savings" value={`€${overview.energyBudget.todaySavings}`} sublabel="From smart timing" status="More possible" tone="green" onClick={() => onNavigate('insights')} />,
    security: <MetricCard icon={ShieldCheck} label="Home Security" value="Locked" sublabel="Door and windows monitored" status="1 window open" tone="red" onClick={() => onNavigate('safety')} />,
    suggestions: <MetricCard icon={Sparkles} label="AI Suggestions" value="5" sublabel="2 need approval" status="Live" tone="blue" onClick={() => onNavigate('actions')} />
  };

  return cards[id] || null;
}
