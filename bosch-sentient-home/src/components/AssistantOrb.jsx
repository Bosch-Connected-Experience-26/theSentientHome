import { Mic, Sparkles } from 'lucide-react';

export default function AssistantOrb({ onClick, listening }) {
  return (
    <button
      onClick={onClick}
      className={`soft-button absolute bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl ${listening ? 'breathe bg-red-600' : 'breathe bg-slate-950'}`}
      aria-label="Open voice assistant"
    >
      {listening ? <Mic size={24} /> : <Sparkles size={24} />}
    </button>
  );
}
