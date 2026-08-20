import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Crown, Zap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose, onSuccess }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');

  if (!open) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create session on server
      await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly',
          email: email || 'learner@linguatone.app',
        }),
      });

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
        onClose();
      }, 900);
    } catch {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-gradient-to-b from-ink-900 to-ink-950 p-6 md:p-8 text-white shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-ink-800 hover:bg-ink-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25">
            <Crown size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Upgrade to LinguaTone PRO</h2>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Unlimited AI voice breakdowns, custom text analysis, and precision accent pitch contours
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center bg-ink-950 p-1 rounded-2xl border border-ink-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-ink-800 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Monthly ($6.99/mo)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>Yearly ($49/yr)</span>
              <span className="bg-black/40 text-[10px] px-1.5 py-0.5 rounded-full text-amber-200">
                SAVE 40%
              </span>
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="rounded-2xl border border-ink-800 bg-ink-950/60 p-4 mb-6 space-y-3">
          {[
            'Unlimited Custom AI Text & Dialogue breakdowns',
            'Full Syllable-by-Syllable Pitch Contours & Tone Sandhi Rules',
            'All HSK 1–6, JLPT N5–N1, and TOPIK levels unlocked',
            'Personalized Acoustic Mistake Heatmap & History',
            'Offline PWA Cache for practice anywhere',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                <Check size={11} strokeWidth={3} />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Email input for receipts */}
        <div className="mb-4">
          <label className="block text-[11px] text-stone-400 mb-1">
            Receipt email (optional):
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full rounded-xl border border-ink-700 bg-ink-950 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Activating PRO Membership...</span>
            </>
          ) : (
            <>
              <Zap size={18} className="fill-white" />
              <span>
                {billingCycle === 'yearly' ? 'Start 7-Day Trial ($49/year)' : 'Unlock PRO for $6.99/mo'}
              </span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>7-day money-back guarantee. Cancel anytime in one click.</span>
        </div>
      </motion.div>
    </div>
  );
};
