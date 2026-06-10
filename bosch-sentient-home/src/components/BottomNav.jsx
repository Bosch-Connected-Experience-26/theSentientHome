import { navigationItems } from '../constants/navigation';

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-slate-200/70 bg-white/82 px-3 pb-4 pt-2 backdrop-blur-2xl">
      <div className="grid grid-cols-5 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`soft-button flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition ${
                isActive ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
