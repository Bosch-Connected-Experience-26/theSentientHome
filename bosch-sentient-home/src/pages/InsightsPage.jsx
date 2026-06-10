import { motion } from 'framer-motion';
import { BatteryCharging, ChartNoAxesCombined, Euro, Leaf, ThermometerSun } from 'lucide-react';
import Card from '../components/Card';

export default function InsightsPage({ insights, rooms }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-emerald-200">
            <ChartNoAxesCombined size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Insights</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">Comfort and budget intelligence.</h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Comfort</p>
            <p className="mt-1 text-[28px] font-black text-white">{insights.comfortScore}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Budget used</p>
            <p className="mt-1 text-[28px] font-black text-white">{insights.energyBudget.usedPercent}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700"><ThermometerSun size={19} /></div>
          <div>
            <h3 className="text-[16px] font-black text-slate-950">Comfort Score breakdown</h3>
            <p className="text-[12px] font-semibold text-slate-500">Calculated from temperature, air, light, occupancy, and noise.</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {insights.comfortBreakdown.map((item) => (
            <ScoreRow key={item.label} label={item.label} value={item.score} max={item.max} />
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Euro size={19} /></div>
          <div>
            <h3 className="text-[16px] font-black text-slate-950">Energy budget guard</h3>
            <p className="text-[12px] font-semibold text-slate-500">Monthly limit €{insights.energyBudget.monthlyLimit}. Projected spend €{insights.energyBudget.projectedSpend}.</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-slate-950" style={{ width: `${insights.energyBudget.usedPercent}%` }} />
        </div>
        <p className="mt-3 text-[13px] font-semibold leading-relaxed text-slate-600">
          Delaying dishwasher and laundry cycles to low-price windows can save about €{insights.energyBudget.weeklyOpportunity.toFixed(2)} this week.
        </p>
      </Card>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Today’s savings</h2>
        <div className="grid gap-3">
          {insights.applianceSavings.map((saving) => (
            <Card key={saving.label} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Leaf size={18} /></div>
                  <div>
                    <h3 className="text-[13px] font-black text-slate-950">{saving.label}</h3>
                    <p className="text-[11px] font-semibold text-slate-400">AI optimization</p>
                  </div>
                </div>
                <p className="text-[16px] font-black text-emerald-700">€{saving.value.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Room comfort</h2>
        <div className="space-y-3">
          {rooms.map((room) => (
            <Card key={room.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-black text-slate-950">{room.name}</h3>
                  <p className="text-[12px] font-semibold text-slate-500">{room.occupancy} · {room.airQuality} air</p>
                </div>
                <div className="text-right">
                  <p className="text-[20px] font-black text-slate-950">{room.temperature}°</p>
                  <p className="text-[10px] font-bold text-slate-400">target {room.preferredTemperature}°</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700"><BatteryCharging size={19} /></div>
          <div>
            <h3 className="text-[16px] font-black text-slate-950">Appliance coordination</h3>
            <p className="text-[12px] font-semibold text-slate-500">Dishwasher at 21:30 · Washer spin after meeting · Dryer waits for approval.</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ScoreRow({ label, value, max }) {
  const percent = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] font-bold">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-400">{value}/{max}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-950" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
