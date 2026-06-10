export default function ConsentToggle({ item, onToggle }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm">
      <button
        onClick={() => onToggle(item.id)}
        className={`mt-0.5 h-7 w-12 shrink-0 rounded-full p-1 transition ${item.enabled ? 'bg-slate-950' : 'bg-slate-300'}`}
      >
        <span className={`block h-5 w-5 rounded-full bg-white transition ${item.enabled ? 'translate-x-5' : ''}`} />
      </button>
      <div>
        <h3 className="text-[13px] font-black text-slate-950">{item.title}</h3>
        <p className="mt-1 text-[12px] font-semibold leading-relaxed text-slate-500">{item.description}</p>
      </div>
    </div>
  );
}
