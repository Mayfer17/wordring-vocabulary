import React, { useState } from 'react';
import { Layers, Sparkles, Volume2, VolumeX, Flame, BookMarked, HelpCircle, Menu } from 'lucide-react';
import { StudyMode } from '../types/flashcard';
import { sounds } from '../utils/audio';

interface RingBinderHeaderProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  streakDays: number;
  onToggleMobileShelf: () => void;
  onOpenDeckManager: () => void;
}

export const RingBinderHeader: React.FC<RingBinderHeaderProps> = ({
  currentMode,
  onSelectMode,
  streakDays,
  onToggleMobileShelf,
  onOpenDeckManager,
}) => {
  const [soundOn, setSoundOn] = useState(sounds.isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    sounds.setSoundEnabled(next);
    setSoundOn(next);
    if (next) sounds.playRingClick();
  };

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#EAE5DC] px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-[0_2px_8px_-2px_rgba(72,74,80,0.04)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Drawer Trigger + Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playRingClick();
              onToggleMobileShelf();
            }}
            className="md:hidden p-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-[#484A50] hover:bg-[#EAE5DC] transition-colors"
            title="Open Deck Shelf"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/assets/wordring-logo.png"
              alt="WordRing Logo"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-2xs"
            />
            <span className="hidden sm:inline-block text-[11px] text-[#74777c] font-['Anuphan',sans-serif] pl-1 border-l border-[#EAE5DC]">
              สมุดคำศัพท์ห่วงคู่ใจ
            </span>
          </div>
        </div>

        {/* Center: Mode Switcher Tabs */}
        <nav className="flex items-center bg-[#EAE5DC]/70 p-1 rounded-xl border border-[#484A50]/10">
          <button
            onClick={() => {
              sounds.playRingClick();
              onSelectMode('ring');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'ring'
                ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-xs'
                : 'text-[#484A50] hover:text-[#1d1c16]'
            }`}
          >
            Study Ring
          </button>

          <button
            onClick={() => {
              sounds.playRingClick();
              onSelectMode('quiz');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'quiz'
                ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-xs'
                : 'text-[#484A50] hover:text-[#1d1c16]'
            }`}
          >
            Recall Quiz
          </button>

          <button
            onClick={() => {
              sounds.playRingClick();
              onOpenDeckManager();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#484A50] hover:text-[#1d1c16] transition-all hidden sm:block"
          >
            Deck Cards
          </button>
        </nav>

        {/* Right: Streak & Settings */}
        <div className="flex items-center gap-2">
          {/* Daily Micro-Streak badge */}
          <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-semibold text-[#484A50]"
            title={`You're on a ${streakDays} day study streak!`}
          >
            <Flame className="w-3.5 h-3.5 text-[#e6839b] fill-current" />
            <span className="text-[11px] font-bold text-[#1d1c16]">{streakDays}d</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundOn
                ? 'bg-[#FAF9F6] border-[#EAE5DC] text-[#52606d]'
                : 'bg-[#EAE5DC] border-[#d6c1c7] text-[#74777c]'
            }`}
            title={soundOn ? 'Tactile sounds enabled' : 'Sounds muted'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
