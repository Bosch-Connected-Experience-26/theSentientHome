import { motion } from 'framer-motion';

export default function Card({ children, className = '', deep = false, onClick }) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`${deep ? 'deep-card' : 'premium-card'} ${onClick ? 'text-left soft-button w-full' : ''} ${className}`}
    >
      {children}
    </Comp>
  );
}
