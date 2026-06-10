import { motion } from 'framer-motion';
import { Cpu, Home, LockKeyhole, Power, Shield } from 'lucide-react';
import Card from '../components/Card';

export default function DevicesPage({ devices, rooms }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-200">
            <Cpu size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Devices & Rooms</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">A context map, not a button wall.</h2>
          </div>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Rooms</h2>
        <div className="space-y-3">
          {rooms.map((room) => (
            <Card key={room.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-slate-400" />
                    <h3 className="text-[15px] font-black text-slate-950">{room.name}</h3>
                  </div>
                  <p className="mt-1 text-[12px] font-semibold text-slate-500">{room.occupancy} · {room.airQuality} air · {room.noise} noise</p>
                </div>
                <div className="text-right">
                  <p className="text-[20px] font-black text-slate-950">{room.temperature}°</p>
                  <p className="text-[10px] font-bold text-slate-400">target {room.preferredTemperature}°</p>
                </div>
              </div>
              {room.alerts.length > 0 && (
                <div className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-[12px] font-bold text-amber-700">
                  {room.alerts[0]}
                </div>
              )}
              <p className="mt-3 text-[12px] font-semibold leading-relaxed text-slate-500">{room.recommendation}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {room.devices.map((device) => (
                  <span key={device} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{device}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-black tracking-tight text-slate-950">Connected devices</h2>
        <div className="space-y-3">
          {devices.map((device) => (
            <Card key={device.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${device.riskLevel === 'Critical' ? 'bg-red-50 text-red-600' : device.requiresApproval ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {device.riskLevel === 'Critical' ? <LockKeyhole size={18} /> : device.requiresApproval ? <Shield size={18} /> : <Power size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-[14px] font-black text-slate-950">{device.name}</h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{device.riskLevel}</span>
                  </div>
                  <p className="mt-1 text-[12px] font-semibold text-slate-500">{device.room} · {device.status}</p>
                  <p className="mt-2 text-[11px] font-semibold leading-relaxed text-slate-400">{device.connectedSource}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
