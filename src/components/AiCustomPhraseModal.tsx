import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, BookOpen, Volume2, ArrowRight, Loader2, Crown } from 'lucide-react';
import { speakText } from '../lib/speech';

interface CustomPhraseResult {
  text: string;
  pinyin?: string;
  romaji?: string;
  hangul?: string;
  translation: string;
  translationRu?: string;
  syllables?: Array<{
    text: string;
    roman: string;
    tone: number;
    pitchTip: string;
  }>;
  toneExplanation?: string;
  culturalNote?: string;
}

interface AiCustomPhraseModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPhrase: (phrase: {
    id: string;
    text: string;
    pinyin?: string;
    romaji?: string;
    translation: string;
    lang: string;
    tones?: number[];
  }) => void;
  currentLang: string;
  isPro: boolean;
  canUseAi: boolean;
  remainingFreeAi: number;
  onOpenPro: () => void;
  onRecordAiUsage: () => boolean;
}

const PRESET_TOPICS = {
  zh: [
    { title: 'Ordering Boba Tea', prompt: 'Ordering boba milk tea with half sugar and pearls in Chinese' },
    { title: 'Asking for the Bill', prompt: 'Asking for check and paying via mobile pay at a restaurant' },
    { title: 'Complimenting a Friend', prompt: 'Natural compliments for someone looking great or speaking well' },
    { title: 'Chinese Drama Quote', prompt: 'Dramatic romantic line from a modern Chinese romance drama' },
  ],
  ja: [
    { title: 'Conbini Checkout', prompt: 'Natural Japanese conversation at 7-Eleven asking for a warm bento and bag' },
    { title: 'Anime Battle Chant', prompt: 'Passionate shonen anime signature quote about never giving up' },
    { title: 'Izakaya Ordering', prompt: 'Ordering draft beer and yakitori recommendation from the master' },
    { title: 'Asking Directions in Tokyo', prompt: 'Polite way to ask where the nearest subway entrance is' },
  ],
  ko: [
    { title: 'K-Drama Confession', prompt: 'Heartfelt emotional confession quote from a popular K-drama' },
    { title: 'Ordering Korean BBQ', prompt: 'Ordering 2 servings of samgyeopsal and ssamjang at a BBQ spot' },
    { title: 'K-Pop Fan Greeting', prompt: 'Expressing love and excitement to an idol group at a fan meet' },
    { title: 'Cafe Order in Hongdae', prompt: 'Ordering iced Americano to go with less ice' },
  ],
};

export const AiCustomPhraseModal: React.FC<AiCustomPhraseModalProps> = ({
  open,
  onClose,
  onSelectPhrase,
  currentLang,
  isPro,
  canUseAi,
  remainingFreeAi,
  onOpenPro,
  onRecordAiUsage,
}) => {
  const [tab, setTab] = useState<'paste' | 'generate'>('paste');
  const [selectedLang, setSelectedLang] = useState<string>(currentLang || 'zh');
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedResult, setAnalyzedResult] = useState<CustomPhraseResult | null>(null);
  const [generatedScenarios, setGeneratedScenarios] = useState<any[]>([]);

  if (!open) return null;

  const handleAnalyzeCustom = async () => {
    if (!customInput.trim()) {
      setError('Please enter a phrase or word to analyze');
      return;
    }

    if (!canUseAi) {
      onOpenPro();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      onRecordAiUsage();
      const res = await fetch('/api/ai/analyze-custom-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customInput.trim(),
          lang: selectedLang,
        }),
      });

      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();
      setAnalyzedResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text with AI');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScenario = async (topicPrompt: string) => {
    if (!canUseAi) {
      onOpenPro();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      onRecordAiUsage();
      const res = await fetch('/api/ai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicPrompt,
          lang: selectedLang,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate scenario');
      const data = await res.json();
      setGeneratedScenarios(data.phrases || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate dialogue');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPhrase = (phraseData: {
    text: string;
    pinyin?: string;
    romaji?: string;
    translation: string;
  }) => {
    onSelectPhrase({
      id: `custom_${Date.now()}`,
      text: phraseData.text,
      pinyin: phraseData.pinyin,
      romaji: phraseData.romaji,
      translation: phraseData.translation,
      lang: selectedLang,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-2xl rounded-3xl border border-ink-700/60 bg-ink-900/95 p-6 md:p-8 text-white shadow-2xl relative max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-ink-800 hover:bg-ink-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-ocean-500 to-cyan-400 text-white shadow-lg shadow-ocean-500/25">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">AI Custom Voice Studio</h2>
              {isPro ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                  <Crown size={12} /> PRO Unlimited
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-ocean-500/10 border border-ocean-500/20 px-2 py-0.5 text-[11px] font-medium text-ocean-300">
                  {remainingFreeAi} free uses left today
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Practice any custom text, anime dialogue, or K-pop lyrics with pitch contour AI
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 mb-4 bg-ink-950/70 p-1.5 rounded-2xl border border-ink-800">
          {[
            { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳' },
            { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
            { code: 'ko', name: 'Korean', flag: '🇰🇷' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setSelectedLang(l.code);
                setAnalyzedResult(null);
                setGeneratedScenarios([]);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedLang === l.code
                  ? 'bg-ocean-500 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>

        {/* Modes: Paste text vs AI Roleplay Scenarios */}
        <div className="flex border-b border-ink-800 mb-6">
          <button
            onClick={() => setTab('paste')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
              tab === 'paste'
                ? 'border-ocean-400 text-ocean-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen size={16} />
            Paste Your Text / Phrase
          </button>
          <button
            onClick={() => setTab('generate')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
              tab === 'generate'
                ? 'border-ocean-400 text-ocean-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wand2 size={16} />
            AI Roleplay Scenarios
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {tab === 'paste' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-2">
                  Enter any word, sentence, or dialogue:
                </label>
                <div className="relative">
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={
                      selectedLang === 'zh'
                        ? 'e.g. 我想喝一杯半糖珍珠奶茶 (I want half-sugar boba)'
                        : selectedLang === 'ja'
                        ? 'e.g. お会計は別々でお願いします (Separate bills please)'
                        : 'e.g. 오늘 날씨가 정말 좋네요 (The weather is great today)'
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-ink-700 bg-ink-950/80 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyzeCustom}
                disabled={loading || !customInput.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 hover:shadow-xl hover:shadow-ocean-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing Phonetics & Tones with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze & Generate Pitch Blueprint
                  </>
                )}
              </button>

              {/* Analyzed result card */}
              <AnimatePresence>
                {analyzedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-ocean-500/30 bg-ocean-950/30 p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {analyzedResult.text}
                        </div>
                        <div className="text-sm font-mono text-ocean-300">
                          {analyzedResult.pinyin || analyzedResult.romaji || analyzedResult.hangul}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          speakText(
                            analyzedResult.text,
                            selectedLang,
                            { rate: 1.0 }
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-500/20 text-ocean-300 hover:bg-ocean-500 hover:text-white transition-colors"
                        title="Listen to native audio"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="text-xs text-stone-300 bg-ink-900/60 p-3 rounded-xl border border-ink-800 space-y-1">
                      <div><strong className="text-stone-400">Meaning:</strong> {analyzedResult.translation}</div>
                      {analyzedResult.translationRu && (
                        <div><strong className="text-stone-400">Перевод:</strong> {analyzedResult.translationRu}</div>
                      )}
                    </div>

                    {/* Syllables Breakdown */}
                    {analyzedResult.syllables && analyzedResult.syllables.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          Syllable Tone Guidance
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analyzedResult.syllables.map((s, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-ink-700 bg-ink-900 px-2.5 py-1.5 text-center"
                            >
                              <div className="text-xs font-bold text-white">{s.text}</div>
                              <div className="text-[10px] font-mono text-cyan-300">{s.roman}</div>
                              <div className="text-[9px] text-amber-300">Tone {s.tone}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analyzedResult.toneExplanation && (
                      <div className="text-xs text-stone-300 leading-relaxed bg-ink-900/40 p-3 rounded-xl">
                        💡 <strong className="text-ocean-200">Coach Tip:</strong> {analyzedResult.toneExplanation}
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleApplyPhrase({
                          text: analyzedResult.text,
                          pinyin: analyzedResult.pinyin,
                          romaji: analyzedResult.romaji,
                          translation: analyzedResult.translation,
                        })
                      }
                      className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <span>Load into Pitch Trainer</span>
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-medium text-stone-300">
                Choose a ready-to-practice scenario or dialogue theme:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(PRESET_TOPICS[selectedLang as keyof typeof PRESET_TOPICS] || []).map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGenerateScenario(preset.prompt)}
                    disabled={loading}
                    className="flex flex-col items-start p-3.5 rounded-2xl border border-ink-700 bg-ink-950/60 hover:bg-ink-800/80 hover:border-ocean-400/50 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="text-xs font-semibold text-white group-hover:text-ocean-300 flex items-center justify-between w-full">
                      <span>{preset.title}</span>
                      <Sparkles size={12} className="text-ocean-400 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                      {preset.prompt}
                    </div>
                  </button>
                ))}
              </div>

              {loading && (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-400 text-xs">
                  <Loader2 size={24} className="animate-spin text-ocean-400" />
                  <span>Generating native voice practice dialogue with Gemini...</span>
                </div>
              )}

              {generatedScenarios.length > 0 && !loading && (
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-semibold text-stone-300">
                    Select a generated sentence to train:
                  </div>
                  {generatedScenarios.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-ink-700 bg-ink-950/80 flex items-center justify-between gap-4 hover:border-ocean-500/40 transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="text-sm font-bold text-white">{item.text}</div>
                        <div className="text-xs font-mono text-ocean-300">
                          {item.pinyin || item.romaji || item.hangul}
                        </div>
                        <div className="text-xs text-stone-400">{item.translation}</div>
                        {item.toneHint && (
                          <div className="text-[11px] text-amber-300/90">🎙️ {item.toneHint}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakText(item.text, selectedLang, { rate: 1.0 })}
                          className="h-8 w-8 rounded-xl bg-ink-800 hover:bg-ink-700 text-stone-300 flex items-center justify-center"
                          title="Listen"
                        >
                          <Volume2 size={15} />
                        </button>
                        <button
                          onClick={() =>
                            handleApplyPhrase({
                              text: item.text,
                              pinyin: item.pinyin,
                              romaji: item.romaji,
                              translation: item.translation,
                            })
                          }
                          className="px-3 py-1.5 rounded-xl bg-ocean-500 hover:bg-ocean-400 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          Train
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
