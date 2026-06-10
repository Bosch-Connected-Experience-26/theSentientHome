import { motion } from 'framer-motion';
import { Bot, Mic, Send, Sparkles, Volume2 } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/Card';

export default function AssistantPage({ messages, onAskAssistant, onVoiceToggle, listening, onExplainMia }) {
  const [input, setInput] = useState('');
  const suggestions = ['Why did you block the stove?', 'Prepare the home for my meeting', 'How is my energy budget?', 'Can Mia turn on the stove?'];

  const send = () => {
    if (!input.trim()) return;
    onAskAssistant(input.trim());
    setInput('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[calc(100vh-210px)] flex-col space-y-5">
      <Card deep className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky-200 ai-glow">
            <Bot size={24} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white/55">Chat + Voice Assistant</p>
            <h2 className="text-[24px] font-black tracking-tight text-white">Ask the home what it is doing and why.</h2>
          </div>
        </div>
        <button onClick={onVoiceToggle} className={`soft-button mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-black ${listening ? 'bg-red-500 text-white' : 'bg-white text-slate-950'}`}>
          {listening ? <Volume2 size={16} /> : <Mic size={16} />}
          {listening ? 'Listening… simulated voice input' : 'Start voice command'}
        </button>
      </Card>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              if (suggestion.includes('block')) onExplainMia();
              onAskAssistant(suggestion);
            }}
            className="soft-button rounded-full bg-white px-3 py-2 text-[11px] font-black text-slate-600 shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm ${message.role === 'user' ? 'bg-slate-950 text-white' : 'bg-white text-slate-700'}`}>
              {message.role === 'assistant' && (
                <div className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-600">
                  <Sparkles size={12} /> Sentient Home
                </div>
              )}
              <p className="text-[13px] font-semibold leading-relaxed">{message.text}</p>
              {message.suggestedActions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestedActions.map((action) => (
                    <span key={action} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">{action}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 flex gap-2 rounded-[26px] bg-white/80 p-2 backdrop-blur-xl shadow-xl ring-1 ring-slate-100">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && send()}
          placeholder="Ask about safety, comfort, energy…"
          className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-[13px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button onClick={send} className="soft-button grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
          <Send size={17} />
        </button>
      </div>
    </motion.div>
  );
}
