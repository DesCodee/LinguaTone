import { motion, AnimatePresence } from 'framer-motion'
import { Target, Clock, Zap, X } from 'lucide-react'

const options = [
  { minutes: 5, label: 'Casual', desc: '5 min/day', icon: Clock },
  { minutes: 10, label: 'Regular', desc: '10 min/day', icon: Target },
  { minutes: 15, label: 'Intense', desc: '15 min/day', icon: Zap },
]

interface Props {
  open: boolean
  onSelect: (minutes: number) => void
  onClose: () => void
}

export default function DailyGoalSetup({ open, onSelect, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-3xl border border-ink-700/50 bg-ink-800/90 backdrop-blur-xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Set Your Daily Goal</h2>
              <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-stone-400 mb-6">
              Consistency beats intensity. Pick a realistic daily target.
            </p>

            <div className="space-y-3">
              {options.map((opt) => (
                <button
                  key={opt.minutes}
                  onClick={() => onSelect(opt.minutes)}
                  className="w-full flex items-center gap-4 rounded-2xl border border-ink-700/50 bg-ink-900/50 p-4 transition-all hover:bg-ocean-500/10 hover:border-ocean-500/30 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-500/20 text-ocean-400 group-hover:bg-ocean-500/30">
                    <opt.icon size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{opt.label}</div>
                    <div className="text-xs text-stone-500">{opt.desc}</div>
                  </div>
                  <div className="ml-auto text-xs font-medium text-ocean-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Select →
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}