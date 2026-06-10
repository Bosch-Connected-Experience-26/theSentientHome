import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose, size = 'default' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-end justify-center glass-modal-backdrop px-3 pb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={`max-h-[88%] w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ${size === 'full' ? 'h-[88%]' : ''}`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-[18px] font-black tracking-tight text-slate-950">{title}</h2>
              <button onClick={onClose} className="soft-button grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(88vh-72px)] overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
