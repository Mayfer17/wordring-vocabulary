import React from 'react';
import { BookOpen, Plus, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { Deck } from '../types/flashcard';
import { sounds } from '../utils/audio';

interface DeckShelfProps {
  decks: Deck[];
  activeDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onOpenCreateDeck: () => void;
  onOpenAiModal: () => void;
}

export const DeckShelf: React.FC<DeckShelfProps> = ({
  decks,
  activeDeckId,
  onSelectDeck,
  onOpenCreateDeck,
  onOpenAiModal,
}) => {
  return (
    <aside className="w-full bg-[#EAE5DC]/60 rounded-2xl p-4 sm:p-5 border border-[#484a50]/10 flex flex-col gap-4">
      {/* Shelf Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCEBFA] border border-[#A8BDD2] flex items-center justify-center text-[#52606d]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1d1c16]">Ring Binder Shelf</h2>
            <p className="text-[11px] text-[#74777c]">My Word Collections</p>
          </div>
        </div>

        {/* Quick AI Deck Button */}
        <button
          onClick={() => {
            sounds.playRingClick();
            onOpenAiModal();
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F5DFE5] hover:bg-[#edd0d7] active:translate-y-[1px] text-[#6a5a5f] text-xs font-semibold border border-[#d6c1c7] transition-all shadow-2xs"
          title="Generate vocabulary deck with AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Deck</span>
        </button>
      </div>

      {/* Decks List */}
      <div className="space-y-2.5">
        {decks.map((deck) => {
          const isActive = deck.id === activeDeckId;
          const totalCards = deck.cards.length;
          const masteredCount = deck.cards.filter((c) => c.status === 'mastered').length;
          const favoritesCount = deck.cards.filter((c) => c.isFavorite).length;
          const percentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

          // Color theme accents
          const colorStyles = {
            blue: {
              activeRing: 'border-[#A8BDD2] bg-[#FFFFFF]',
              tag: 'bg-[#DCEBFA] text-[#52606d]',
              bar: 'bg-[#7d98b0]',
            },
            pink: {
              activeRing: 'border-[#d6c1c7] bg-[#FFFFFF]',
              tag: 'bg-[#F5DFE5] text-[#6a5a5f]',
              bar: 'bg-[#e293a5]',
            },
            sand: {
              activeRing: 'border-[#ded9d1] bg-[#FFFFFF]',
              tag: 'bg-[#ede8df] text-[#52606d]',
              bar: 'bg-[#a39a8c]',
            },
            lavender: {
              activeRing: 'border-[#cbd2e6] bg-[#FFFFFF]',
              tag: 'bg-[#e6ebfa] text-[#4d5c7c]',
              bar: 'bg-[#899bc2]',
            },
            sage: {
              activeRing: 'border-[#ccd9cf] bg-[#FFFFFF]',
              tag: 'bg-[#e1ece3] text-[#486350]',
              bar: 'bg-[#81a68d]',
            },
          }[deck.color || 'blue'];

          return (
            <div
              key={deck.id}
              onClick={() => {
                sounds.playRingClick();
                onSelectDeck(deck.id);
              }}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#FFFFFF] shadow-[0_4px_12px_rgba(72,74,80,0.06)] border border-[#A8BDD2]'
                  : 'bg-[#FAF9F6]/80 hover:bg-[#FFFFFF] border border-[#EAE5DC]/80'
              }`}
            >
              {/* Binder Tab Notch */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorStyles.tag}`}
                    >
                      {totalCards} words
                    </span>
                    {favoritesCount > 0 && (
                      <span className="text-[10px] font-medium text-[#74777c] inline-flex items-center gap-0.5">
                        <Bookmark className="w-2.5 h-2.5 text-[#e6839b]" />
                        {favoritesCount}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#1d1c16] mt-1 truncate">
                    {deck.title}
                  </h3>
                  {deck.titleThai && (
                    <p className="text-xs text-[#74777c] font-['IBM_Plex_Sans_Thai',sans-serif] truncate">
                      {deck.titleThai}
                    </p>
                  )}
                </div>

                {/* Mastery Percentage Mini Badge */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-bold text-[#1d1c16]">
                    {percentage}%
                  </span>
                  <span className="text-[9px] text-[#74777c]">
                    {masteredCount}/{totalCards}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="mt-2.5 w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${colorStyles.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            sounds.playRingClick();
            onOpenCreateDeck();
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] active:translate-y-[1px] text-[#484A50] text-xs font-semibold border border-[#EAE5DC] transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#52606d]" />
          <span>New Custom Deck</span>
        </button>
      </div>
    </aside>
  );
};
