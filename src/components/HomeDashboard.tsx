import React, { useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Play,
  Volume2,
  Clock,
  Plus,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Deck, Flashcard, UserProfile } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds, speakWord } from '../utils/audio';

interface HomeDashboardProps {
  user: UserProfile;
  decks: Deck[];
  activeDeck: Deck;
  onStartReview: (deck: Deck) => void;
  onStartQuiz: (deck: Deck) => void;
  onGoToDecks: () => void;
  onGoToHistory: () => void;
  onSelectCard?: (deckId: string, cardId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  decks,
  activeDeck,
  onStartReview,
  onStartQuiz,
  onGoToDecks,
  onGoToHistory,
  onSelectCard,
}) => {
  const totalWords = decks.reduce((acc, d) => acc + d.cards.length, 0);

  // Extract recently added vocabulary across all decks
  const recentWords = useMemo(() => {
    const list: Array<Flashcard & { deckTitle: string; deckId: string; deckColor: string }> = [];
    const now = Date.now();

    decks.forEach((deck, deckIndex) => {
      deck.cards.forEach((card, cardIndex) => {
        const timestamp =
          card.createdAt ||
          now - (deckIndex * 86400000 * 1.2 + cardIndex * 3600000 * 2.5);

        list.push({
          ...card,
          deckTitle: deck.title,
          deckId: deck.id,
          deckColor: deck.color,
          createdAt: timestamp,
        });
      });
    });

    // Sort newest first and take top 6
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 6);
  }, [decks]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 select-none font-['Nunito_Sans',sans-serif]">
      {/* ================= 1. TOP WELCOME STATIONERY CARD matching Image 2 ================= */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#EAE5DC] shadow-[0_4px_20px_rgba(72,74,80,0.05)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 paper-ruled">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[11px] font-semibold text-[#52606d] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#7d98b0]" />
            <span>{totalWords} คำศัพท์ในสมุดห่วงของคุณ</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1c16] font-['Anuphan',sans-serif] leading-tight">
            สวัสดี{user.name} 🌸
          </h1>

          <p className="text-xs sm:text-sm text-[#74777c] mt-2 font-['Anuphan',sans-serif] leading-relaxed max-w-lg">
            Warm welcome. วันนี้พร้อมเติมคำศัพท์อบอุ่นลงในห่วงการ์ดหรือยัง? ค่อยๆ ทบทวนไปทีละนิดด้วยกันนะ
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playRingClick();
                onStartReview(activeDeck);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] transition-colors shadow-2xs font-['Anuphan',sans-serif]"
            >
              <Play className="w-3.5 h-3.5 text-[#52606d]" />
              <span>เปิดการ์ดทบทวน</span>
            </button>

            <button
              onClick={() => {
                sounds.playRingClick();
                onStartQuiz(activeDeck);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5DFE5] hover:bg-[#edd0d7] active:translate-y-[1px] text-xs font-bold text-[#6a5a5f] border border-[#d6c1c7] transition-colors shadow-2xs font-['Anuphan',sans-serif]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e6839b]" />
              <span>ทำแบบฝึกหัด (Quiz)</span>
            </button>
          </div>
        </div>

        {/* WordRing Stationery Calendar Pad Graphic with authentic Logo */}
        <div className="w-40 h-36 rounded-2xl bg-[#FFFFFF] border-[1.5px] border-[#EAE5DC] flex flex-col items-center justify-center p-3 relative shadow-xs shrink-0 hover:scale-102 transition-transform">
          <div className="absolute -top-2 flex gap-6">
            <div className="w-2.5 h-4 rounded-full bg-[#cbd8e6] border border-[#7d98b0]" />
            <div className="w-2.5 h-4 rounded-full bg-[#cbd8e6] border border-[#7d98b0]" />
          </div>
          <img
            src="/assets/wordring-logo.png"
            alt="WordRing Logo"
            className="w-32 h-auto object-contain drop-shadow-2xs"
          />
        </div>
      </div>

      {/* ================= 2. TWO ACTION COLUMNS matching Image 2 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Today's Flow Card */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border-[1.5px] border-[#EAE5DC] shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[#F5DFE5] text-[#706065] text-[11px] font-bold">
                🌸 Today's Flow
              </span>
              <span className="text-[10px] font-semibold text-[#74777c]">Daily Deck</span>
            </div>

            <h3 className="text-lg font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
              เริ่มเรียนรู้คำศัพท์ใหม่
            </h3>
            <p className="text-xs text-[#74777c] mt-1 font-['Anuphan',sans-serif] leading-relaxed">
              เปิดการ์ดทีละใบ พลิกดูคำแปลพร้อมตัวอย่างประโยคสำนวนง่ายๆ อย่างเพลิดเพลิน
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playRingClick();
              onStartReview(activeDeck);
            }}
            className="w-full mt-5 py-3 px-4 rounded-2xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-all flex items-center justify-between font-['Anuphan',sans-serif] shadow-xs"
          >
            <span>เริ่มเรียนรู้ / ฝึกคำศัพท์วันนี้</span>
            <span className="px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[10px] text-[#52606d]">พร้อมแล้ว!</span>
          </button>
        </div>

        {/* Continue Learning Card */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border-[1.5px] border-[#EAE5DC] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1d1c16] flex items-center gap-1.5 font-['Anuphan',sans-serif]">
                <BookOpen className="w-4 h-4 text-[#52606d]" />
                เรียนรู้ต่อจากค้างไว้ (Continue Learning)
              </span>
              <span className="text-[11px] text-[#74777c]">
                {activeDeck.cards.length} คำในชุด
              </span>
            </div>

            {/* Active deck card mini-preview */}
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#DCEBFA] border border-[#A8BDD2] flex items-center justify-center text-[10px] font-bold text-[#52606d] shrink-0">
                  EN
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1d1c16] truncate">
                    {activeDeck.title}
                  </h4>
                  <p className="text-[10px] text-[#74777c] truncate font-['Anuphan',sans-serif]">
                    {activeDeck.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  onStartReview(activeDeck);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-bold text-[#1d1c16] shadow-2xs shrink-0 font-['Anuphan',sans-serif]"
              >
                <span>เปิดต่อ</span>
                <ArrowRight className="w-3 h-3 text-[#52606d]" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 pt-3 border-t border-[#EAE5DC]">
            <div className="flex items-center justify-between text-[11px] text-[#74777c] mb-1.5">
              <span>ความคืบหน้าของชุดนี้</span>
              <span>
                จำได้แล้ว {activeDeck.cards.filter((c) => c.status === 'mastered').length} / {activeDeck.cards.length} คำ
              </span>
            </div>
            <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7d98b0] rounded-full transition-all duration-300"
                style={{
                  width: `${
                    activeDeck.cards.length > 0
                      ? Math.round(
                          (activeDeck.cards.filter((c) => c.status === 'mastered').length /
                            activeDeck.cards.length) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. NEW: RECENTLY ADDED VOCABULARY SECTION ================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] flex items-center justify-center text-[#52606d]">
              <Clock className="w-4 h-4 text-[#7d98b0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
                  คำศัพท์ที่เพิ่มเข้าล่าสุด
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#DCEBFA] text-[#52606d] text-[10px] font-bold">
                  ✨ ล่าสุด {recentWords.length} คำ
                </span>
              </div>
              <p className="text-[11px] text-[#74777c] font-['Anuphan',sans-serif]">
                คำศัพท์ที่คุณและระบบได้ร้อยใส่ห่วงการ์ดไว้เมื่อเร็วๆ นี้
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playRingClick();
              onGoToHistory();
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#52606d] hover:text-[#1d1c16] font-['Anuphan',sans-serif] hover:underline"
          >
            <span>ดูประวัติทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recently Added Vocabulary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recentWords.map((word) => {
            const targetDeck = decks.find((d) => d.id === word.deckId) || activeDeck;

            return (
              <div
                key={word.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 border-[1.5px] border-[#EAE5DC] hover:border-[#A8BDD2] shadow-2xs transition-all flex flex-col justify-between paper-ruled group relative overflow-hidden"
              >
                {/* Top Binder punch hole hint */}
                <div className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full punch-hole" />

                <div>
                  {/* Category origin pill */}
                  <div className="flex items-center justify-between text-[10px] mb-2 pr-4">
                    <span className="font-semibold text-[#74777c] truncate max-w-[150px] font-['Anuphan',sans-serif]">
                      📁 {word.deckTitle}
                    </span>

                    <span className="text-[9px] font-semibold text-[#52606d] bg-[#DCEBFA]/70 px-1.5 py-0.2 rounded-md">
                      เพิ่งเพิ่ม
                    </span>
                  </div>

                  {/* Word + IPA + Speaker */}
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1c16] truncate">
                        {word.english}
                      </h3>
                      <p className="text-[11px] font-mono text-[#74777c]">
                        {word.ipa || word.phonetic}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FAF9F6] border border-[#EAE5DC] text-[9px] font-bold text-[#52606d]">
                        {word.partOfSpeech.toLowerCase()}
                      </span>
                      <button
                        onClick={() => speakWord(word.english, 'en')}
                        className="p-1 rounded-full hover:bg-[#EAE5DC] text-[#52606d] transition-colors"
                        title="ฟังเสียงอ่าน"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thai Meaning */}
                  <p className="text-xs font-semibold text-[#1d1c16] font-['Anuphan',sans-serif] mt-2.5 line-clamp-1 leading-snug">
                    {word.thai}
                  </p>

                  {/* Example sentence preview */}
                  {word.exampleEnglish && (
                    <p className="text-[10px] text-[#74777c] mt-1 line-clamp-1 italic">
                      "{word.exampleEnglish}"
                    </p>
                  )}
                </div>

                {/* Footer action button */}
                <div className="mt-3 pt-2.5 border-t border-[#EAE5DC] flex items-center justify-between">
                  <span className="text-[10px] text-[#74777c]">
                    {word.status === 'mastered' ? '✓ จำได้แล้ว' : 'รอทบทวน'}
                  </span>

                  <button
                    onClick={() => {
                      sounds.playRingClick();
                      onStartReview(targetDeck);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#52606d] group-hover:text-[#1d1c16] font-['Anuphan',sans-serif]"
                  >
                    <span>เปิดทบทวนการ์ด</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
