import React, { useState } from 'react';
import { Volume2, Star, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import { Flashcard } from '../types/flashcard';
import { sounds, speakWord } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FlashcardItemProps {
  card: Flashcard;
  currentIndex: number;
  totalCards: number;
  onStatusChange: (cardId: string, status: Flashcard['status']) => void;
  onToggleFavorite: (cardId: string) => void;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  currentIndex,
  totalCards,
  onStatusChange,
  onToggleFavorite,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    sounds.playPaperFlip();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, lang: 'th' | 'en' = 'th') => {
    e.stopPropagation();
    sounds.playRingClick();
    speakWord(lang === 'th' ? card.thai : card.english, lang);
  };

  const handleMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playStamp();
    sounds.playSuccessChime();

    // Trigger soft pastel celebratory confetti
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DCEBFA', '#F5DFE5', '#A8BDD2', '#FFF5B8'],
      ticks: 150,
      gravity: 0.85,
    });

    onStatusChange(card.id, 'mastered');
  };

  const handleNeedPractice = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playRingClick();
    onStatusChange(card.id, 'learning');
  };

  // Tone color/label badge
  const toneLabel = card.tone || 'Mid tone';

  return (
    <div className="w-full max-w-[460px] mx-auto select-none">
      {/* 3D Stack container with stationery depth */}
      <div className="relative perspective-1000">
        {/* Tier 2: Inactive Card 2 behind (offset 8px) */}
        {totalCards > currentIndex + 2 && (
          <div
            className="absolute inset-0 bg-[#FAF9F6] rounded-[20px] border border-[#EAE5DC] translate-y-3.5 scale-[0.94] opacity-50 shadow-[0_4px_12px_rgba(72,74,80,0.04)] pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Tier 2: Inactive Card 1 behind (offset 4px) */}
        {totalCards > currentIndex + 1 && (
          <div
            className="absolute inset-0 bg-[#FAF9F6] rounded-[20px] border border-[#EAE5DC] translate-y-2 scale-[0.97] opacity-80 shadow-[0_4px_12px_rgba(72,74,80,0.06)] pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Tier 3: Active Focus Card */}
        <div
          onClick={handleFlip}
          className={`relative min-h-[420px] sm:min-h-[440px] w-full rounded-[20px] cursor-pointer transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* ================= CARD FRONT ================= */}
          <div
            className={`absolute inset-0 w-full h-full bg-[#FFFFFF] rounded-[20px] border-[1.5px] border-[#EAE5DC] shadow-[0_4px_16px_0_rgba(72,74,80,0.07),0_1px_3px_0_rgba(72,74,80,0.04)] p-6 sm:p-7 flex flex-col justify-between backface-hidden paper-ruled overflow-hidden ${
              card.status === 'mastered' ? 'ring-2 ring-[#DCEBFA]' : ''
            }`}
          >
            {/* Real Metallic Ring Binder Coils (Dual Rings at top) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-12 z-20 pointer-events-none">
              {/* Left Ring Loop */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-9 rounded-full metallic-ring border border-[#A8BDD2]/60 flex items-center justify-center shadow-md">
                  <div className="w-2.5 h-6 rounded-full metallic-ring-inner opacity-70" />
                </div>
              </div>

              {/* Right Ring Loop */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-9 rounded-full metallic-ring border border-[#A8BDD2]/60 flex items-center justify-center shadow-md">
                  <div className="w-2.5 h-6 rounded-full metallic-ring-inner opacity-70" />
                </div>
              </div>
            </div>

            {/* Die-cut punch holes aligned with coils */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-12 z-10 pointer-events-none">
              <div className="w-3.5 h-3.5 rounded-full punch-hole" />
              <div className="w-3.5 h-3.5 rounded-full punch-hole" />
            </div>

            {/* Perforated edge line */}
            <div className="w-full pt-4 pb-2 border-b border-dashed border-[#484A50]/15 flex items-center justify-between">
              {/* Stack index badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAE5DC] text-[#484A50]">
                  {currentIndex + 1} / {totalCards}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCEBFA] text-[#52606d] border border-[#A8BDD2]/40">
                  {card.partOfSpeech}
                </span>
              </div>

              {/* Bookmark star & Tone indicator */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#74777c] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#EAE5DC]">
                  {toneLabel}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playRingClick();
                    onToggleFavorite(card.id);
                  }}
                  title={card.isFavorite ? 'Remove bookmark' : 'Bookmark card'}
                  className={`p-1.5 rounded-full transition-colors ${
                    card.isFavorite
                      ? 'text-[#e6839b] bg-[#F5DFE5]'
                      : 'text-[#a4a7ab] hover:text-[#484A50] hover:bg-[#EAE5DC]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Card Content (Center) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-6 relative">
              {/* Mastered Ink Stamp Overlay */}
              {card.status === 'mastered' && (
                <div className="absolute top-0 right-4 rotate-[-12deg] pointer-events-none border-2 border-[#52606d]/40 rounded-lg px-2.5 py-0.5 text-[11px] font-bold text-[#52606d]/60 uppercase tracking-widest bg-[#DCEBFA]/30">
                  ✓ จำได้แล้ว
                </div>
              )}

              {/* Thai Script Heading with generous vertical spacing */}
              <div className="relative group">
                <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1c16] tracking-wide font-['IBM_Plex_Sans_Thai','Anuphan',sans-serif] leading-[1.35] py-2">
                  {card.thai}
                </h2>

                {/* Pronounce audio button */}
                <button
                  onClick={(e) => handleSpeak(e, 'th')}
                  title="Listen to Thai pronunciation"
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAE5DC]/80 hover:bg-[#DCEBFA] text-[#484A50] text-xs font-semibold transition-colors shadow-xs active:translate-y-[1px]"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#52606d]" />
                  <span>{card.phonetic}</span>
                </button>
              </div>

              {/* Subtitle / category context */}
              <p className="text-xs text-[#74777c] mt-4 font-normal max-w-xs">
                Tap card or press <kbd className="px-1.5 py-0.5 bg-[#FAF9F6] border border-[#EAE5DC] rounded text-[10px] text-[#484A50] font-mono">Space</kbd> to see English meaning & example
              </p>
            </div>

            {/* Bottom prompt bar */}
            <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#74777c]">
              <span className="inline-flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 opacity-60" /> Click to flip
              </span>
              {card.status === 'learning' && (
                <span className="text-[#93000a] bg-[#ffdad6]/60 px-2 py-0.5 rounded-full text-[10px] font-medium">
                  In Practice
                </span>
              )}
              {card.status === 'mastered' && (
                <span className="text-[#3a4854] bg-[#dcebfa] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  Mastered
                </span>
              )}
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div
            className="absolute inset-0 w-full h-full bg-[#FFFFFF] rounded-[20px] border-[1.5px] border-[#EAE5DC] shadow-[0_4px_16px_0_rgba(72,74,80,0.07),0_1px_3px_0_rgba(72,74,80,0.04)] p-6 sm:p-7 flex flex-col justify-between rotate-y-180 backface-hidden paper-ruled overflow-hidden"
          >
            {/* Real Metallic Ring Binder Coils (Back) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-12 z-20 pointer-events-none">
              <div className="w-5 h-9 rounded-full metallic-ring border border-[#A8BDD2]/60 flex items-center justify-center shadow-md">
                <div className="w-2.5 h-6 rounded-full metallic-ring-inner opacity-70" />
              </div>
              <div className="w-5 h-9 rounded-full metallic-ring border border-[#A8BDD2]/60 flex items-center justify-center shadow-md">
                <div className="w-2.5 h-6 rounded-full metallic-ring-inner opacity-70" />
              </div>
            </div>

            {/* Die-cut punch holes */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-12 z-10 pointer-events-none">
              <div className="w-3.5 h-3.5 rounded-full punch-hole" />
              <div className="w-3.5 h-3.5 rounded-full punch-hole" />
            </div>

            {/* Perforated top bar */}
            <div className="w-full pt-4 pb-2 border-b border-dashed border-[#484A50]/15 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#52606d] bg-[#DCEBFA] px-2.5 py-0.5 rounded-full">
                English Meaning
              </span>
              <button
                onClick={(e) => handleSpeak(e, 'en')}
                title="Speak English"
                className="p-1.5 rounded-full hover:bg-[#EAE5DC] text-[#484A50] transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Meaning & Details */}
            <div className="flex-1 flex flex-col justify-center my-3 text-left">
              <div className="mb-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1d1c16] leading-tight">
                  {card.english}
                </h3>
                <span className="text-xs text-[#74777c] font-medium">
                  {card.partOfSpeech} • {card.thai} ({card.phonetic})
                </span>
              </div>

              {/* Bilingual Example Sentence in stationery paper note */}
              <div className="bg-[#FAF9F6] border border-[#EAE5DC] rounded-xl p-3 my-2 shadow-[inset_0_1px_3px_rgba(72,74,80,0.03)]">
                <div className="text-[11px] font-semibold text-[#52606d] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>Example Sentence</span>
                </div>
                <p className="text-sm font-medium text-[#1d1c16] font-['IBM_Plex_Sans_Thai','Anuphan',sans-serif] leading-relaxed">
                  {card.exampleThai}
                </p>
                <p className="text-xs text-[#74777c] mt-1 leading-normal italic">
                  "{card.exampleEnglish}"
                </p>
              </div>

              {/* Memory Mnemonic Tip if provided */}
              {card.mnemonic && (
                <div className="bg-[#F5DFE5]/50 border border-[#f3dde3] rounded-xl px-3 py-2 flex items-start gap-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#6a5a5f] shrink-0 mt-0.5" />
                  <span className="text-[#6a5a5f] font-normal leading-tight">
                    <strong className="font-semibold">Mnemonic:</strong> {card.mnemonic}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom prompt bar */}
            <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between text-xs text-[#74777c]">
              <span className="inline-flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 opacity-60" /> Tap to flip back
              </span>
              <span className="text-[11px] text-[#52606d] font-medium">
                Reviewed {card.reviewCount} times
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Action Buttons Under Flashcard */}
      <div className="mt-5 flex items-center justify-between gap-3">
        {/* Still Learning / Need Practice */}
        <button
          onClick={handleNeedPractice}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] active:translate-y-[1px] text-[#484A50] font-semibold text-xs transition-all shadow-xs border border-transparent hover:border-[#74777c]/20"
        >
          <HelpCircle className="w-4 h-4 text-[#74777c]" />
          <span>Still Learning</span>
        </button>

        {/* Flip button */}
        <button
          onClick={handleFlip}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#f8f3ea] active:translate-y-[1px] text-[#484A50] font-semibold text-xs border border-[#EAE5DC] transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#52606d]" />
          <span>Flip</span>
        </button>

        {/* Got it / Mastered (Powder blue primary) */}
        <button
          onClick={handleMastered}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] font-semibold text-xs border border-[#A8BDD2] transition-all shadow-xs"
        >
          <Check className="w-4 h-4 text-[#52606d]" />
          <span>Got It! (Mastered)</span>
        </button>
      </div>
    </div>
  );
};
