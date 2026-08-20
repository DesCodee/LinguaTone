import { useState, useEffect } from 'react';

const PRO_STORAGE_KEY = 'linguatone_pro_status';
const DAILY_LIMIT_KEY = 'linguatone_ai_daily_usage';

export function useProStatus() {
  const [isPro, setIsPro] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(PRO_STORAGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [aiUsageCount, setAiUsageCount] = useState<number>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(DAILY_LIMIT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed.count;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRO_STORAGE_KEY, String(isPro));
    } catch {
      // ignore
    }
  }, [isPro]);

  const activatePro = () => {
    setIsPro(true);
    try {
      localStorage.setItem(PRO_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const cancelPro = () => {
    setIsPro(false);
    try {
      localStorage.setItem(PRO_STORAGE_KEY, 'false');
    } catch {
      // ignore
    }
  };

  const recordAiUsage = (): boolean => {
    if (isPro) return true; // Unlimited for Pro

    const today = new Date().toISOString().split('T')[0];
    const newCount = aiUsageCount + 1;
    setAiUsageCount(newCount);

    try {
      localStorage.setItem(
        DAILY_LIMIT_KEY,
        JSON.stringify({ date: today, count: newCount })
      );
    } catch {
      // ignore
    }

    return newCount <= 5; // 5 free per day
  };

  const canUseAi = isPro || aiUsageCount < 5;
  const remainingFreeAi = Math.max(0, 5 - aiUsageCount);

  return {
    isPro,
    canUseAi,
    remainingFreeAi,
    activatePro,
    cancelPro,
    recordAiUsage,
  };
}
