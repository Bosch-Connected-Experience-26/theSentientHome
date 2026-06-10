import { GripVertical, Pin, RotateCcw, X } from 'lucide-react';
import Modal from './Modal';

export default function DashboardCustomizer({ open, widgets, onClose, onToggle, onPin, onMove, onReset }) {
  return (
    <Modal open={open} title="Customize Dashboard" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-[13px] font-semibold leading-relaxed text-slate-500">
          Choose what Leila sees first. Pin safety, energy, approvals, or family status depending on the day.
        </p>
        <div className="space-y-2">
          {widgets.map((widget, index) => (
            <div key={widget.id} className="flex items-center gap-2 rounded-[22px] border border-slate-100 bg-slate-50 p-3">
              <GripVertical size={16} className="text-slate-300" />
              <button
                onClick={() => onToggle(widget.id)}
                className={`h-6 w-11 rounded-full p-1 transition ${widget.visible ? 'bg-slate-950' : 'bg-slate-300'}`}
              >
                <span className={`block h-4 w-4 rounded-full bg-white transition ${widget.visible ? 'translate-x-5' : ''}`} />
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-[13px] font-black ${widget.visible ? 'text-slate-900' : 'text-slate-400'}`}>{widget.label}</p>
                <p className="text-[10px] font-bold text-slate-400">{widget.pinned ? 'Pinned to top' : 'Standard widget'}</p>
              </div>
              <button
                onClick={() => onPin(widget.id)}
                className={`soft-button grid h-9 w-9 place-items-center rounded-2xl ${widget.pinned ? 'bg-sky-50 text-sky-700' : 'bg-white text-slate-400'}`}
              >
                <Pin size={15} />
              </button>
              <div className="flex flex-col gap-1">
                <button onClick={() => onMove(index, -1)} className="soft-button grid h-5 w-7 place-items-center rounded-lg bg-white text-[10px] font-black text-slate-500">↑</button>
                <button onClick={() => onMove(index, 1)} className="soft-button grid h-5 w-7 place-items-center rounded-lg bg-white text-[10px] font-black text-slate-500">↓</button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button onClick={onReset} className="soft-button flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-[12px] font-black text-slate-700">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={onClose} className="soft-button flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-[12px] font-black text-white">
            <X size={15} /> Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
