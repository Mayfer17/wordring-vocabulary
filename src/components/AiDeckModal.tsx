import React, { useState } from 'react';
import { X, Sparkles, Loader2, BookOpen, Wand2 } from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { sounds } from '../utils/audio';

interface AiDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckCreated: (newDeck: Deck) => void;
}

const POPULAR_THEMES = [
  { topic: 'Ordering Coffee & Bakery Treats', thai: 'สั่งกาแฟและขนมคาเฟ่', color: 'pink' as const },
  { topic: 'Bangkok Street Market Bargaining', thai: 'เดินตลาดนัดและต่อราคา', color: 'blue' as const },
  { topic: 'Riding BTS & Taxi Directions', thai: 'การเดินทาง รถไฟฟ้า และแท็กซี่', color: 'sage' as const },
  { topic: 'Friendly Chats & Small Talk', thai: 'บทสนทนาผูกมิตรกับเพื่อนใหม่', color: 'lavender' as const },
  { topic: 'Office & Meeting Etiquette', thai: 'คำศัพท์ทำงานและการประชุม', color: 'sand' as const },
];

export const AiDeckModal: React.FC<AiDeckModalProps> = ({
  isOpen,
  onClose,
  onDeckCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [count, setCount] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedTopic?: string) => {
    const finalTopic = selectedTopic || topic;
    if (!finalTopic.trim()) {
      setError('Please choose or enter a topic.');
      return;
    }

    setLoading(true);
    setError(null);
    sounds.playRingClick();

    try {
      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: finalTopic,
          level,
          count,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      
      const newDeck: Deck = {
        id: `deck-${Date.now()}`,
        title: data.deckTitle || finalTopic,
        titleThai: data.deckDescription || 'บัตรคำศัพท์ภาษาไทย-อังกฤษ',
        description: data.deckDescription || `Curated flashcards for ${finalTopic}`,
        color: 'blue',
        createdAt: Date.now(),
        cards: (data.cards || []).map((c: any, idx: number) => ({
          id: `card-${Date.now()}-${idx}`,
          thai: c.thai,
          phonetic: c.phonetic || '',
          english: c.english,
          partOfSpeech: c.partOfSpeech || 'noun',
          exampleThai: c.exampleThai || '',
          exampleEnglish: c.exampleEnglish || '',
          mnemonic: c.mnemonic || '',
          tone: c.tone || 'Mid',
          status: 'new' as const,
          reviewCount: 0,
        })),
      };

      sounds.playSuccessChime();
      onDeckCreated(newDeck);
      onClose();
    } catch (err: any) {
      console.warn('AI deck generation error:', err);
      // If API fails or key is missing, offer a friendly message or automatic fallback
      setError(
        err.message || 'Could not connect to Gemini API. Please check your API key in Settings > Secrets.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1c16]/30 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#DCEBFA] border border-[#A8BDD2] flex items-center justify-center text-[#52606d]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1d1c16]">AI Ring Binder Generator</h2>
              <p className="text-[11px] text-[#74777c]">Craft custom bilingual flashcard decks</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playRingClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-[#EAE5DC] text-[#74777c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Quick theme tags */}
          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-2">
              Popular Stationery Themes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_THEMES.map((theme, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTopic(theme.topic);
                    handleGenerate(theme.topic);
                  }}
                  disabled={loading}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#FAF9F6] hover:bg-[#DCEBFA] hover:text-[#1d1c16] text-[#484A50] border border-[#EAE5DC] hover:border-[#A8BDD2] transition-colors text-left"
                >
                  {theme.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-1.5">
              Or Enter Your Own Theme / Scenario
            </label>
            <input
              type="text"
              placeholder="e.g. Cooking Thai Green Curry, Doctor visit, Airport..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
            />
          </div>

          {/* Level and Card count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-1">
                Learning Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                disabled={loading}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#484A50]"
              >
                <option value="beginner">Beginner (คำศัพท์เบื้องต้น)</option>
                <option value="intermediate">Intermediate (ระดับกลาง)</option>
                <option value="advanced">Advanced (ระดับสูง)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-1">
                Batch Size
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={loading}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#484A50]"
              >
                <option value={5}>5 flashcards</option>
                <option value={6}>6 flashcards (Standard ring)</option>
                <option value={8}>8 flashcards</option>
                <option value={10}>10 flashcards (Expanded pack)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/20 text-[11px] text-[#93000a] leading-relaxed">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] text-xs font-semibold text-[#484A50] transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={loading || !topic.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] transition-all shadow-2xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Binding Stationery Cards...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate Ring Deck</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
