import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Plus,
  Search,
  Volume2,
  Trash2,
  Edit3,
  BookOpen,
  Sparkles,
  Check,
} from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { sounds, speakWord } from '../utils/audio';

interface FolderDetailViewProps {
  deck: Deck;
  onBack: () => void;
  onStartReview: () => void;
  onStartQuiz: () => void;
  onAddCard: (deckId: string, card: Omit<Flashcard, 'id' | 'status' | 'reviewCount'>) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
}

export const FolderDetailView: React.FC<FolderDetailViewProps> = ({
  deck,
  onBack,
  onStartReview,
  onStartQuiz,
  onAddCard,
  onDeleteCard,
}) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New card inputs
  const [newEnglish, setNewEnglish] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newThai, setNewThai] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newExample, setNewExample] = useState('');

  const filteredCards = deck.cards.filter(
    (c) =>
      c.english.toLowerCase().includes(search.toLowerCase()) ||
      c.thai.toLowerCase().includes(search.toLowerCase()) ||
      (c.ipa && c.ipa.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newThai.trim()) return;

    sounds.playStamp();
    onAddCard(deck.id, {
      english: newEnglish.trim(),
      thai: newThai.trim(),
      ipa: newIpa.trim() || undefined,
      phonetic: newEnglish.trim().toLowerCase(),
      partOfSpeech: newPartOfSpeech,
      exampleEnglish: newExample.trim() || `Learning ${newEnglish.trim()} every day.`,
      exampleThai: `ตัวอย่างการใช้คำว่า ${newThai.trim()}`,
      mnemonic: '',
      tone: 'Mid',
    });

    setNewEnglish('');
    setNewIpa('');
    setNewThai('');
    setNewExample('');
    setIsAdding(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none">
      {/* Back button */}
      <button
        onClick={() => {
          sounds.playRingClick();
          onBack();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74777c] hover:text-[#1d1c16] font-['Anuphan',sans-serif]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ย้อนกลับไปหน้าโฟลเดอร์ทั้งหมด</span>
      </button>

      {/* Header Info Card matching Image 4 */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#EAE5DC] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 paper-ruled">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#52606d] text-[11px] font-bold">
              โฟลเดอร์ห่วงคำศัพท์
            </span>
            <span className="text-xs text-[#74777c]">ทั้งหมด {deck.cards.length} คำศัพท์</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1c16]">
            {deck.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#74777c] mt-1 font-['Anuphan',sans-serif]">
            {deck.description || deck.titleThai}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-col items-stretch gap-2.5 shrink-0">
          <button
            onClick={() => {
              sounds.playRingClick();
              onStartReview();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FAF9F6] hover:bg-[#EAE5DC] text-xs font-bold text-[#1d1c16] border border-[#EAE5DC] transition-all shadow-2xs font-['Anuphan',sans-serif]"
          >
            <Play className="w-4 h-4 text-[#52606d]" />
            <span>เริ่มท่องแฟลชการ์ดห่วง (Start Review)</span>
          </button>

          <button
            onClick={() => {
              sounds.playRingClick();
              onStartQuiz();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DCEBFA] hover:bg-[#c9e1f8] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] transition-all shadow-2xs font-['Anuphan',sans-serif]"
          >
            <Sparkles className="w-4 h-4 text-[#52606d]" />
            <span>เริ่มทำควิซ (Vocabulary Quiz)</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาคำศัพท์หรือความหมายในโฟลเดอร์นี้..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif] shadow-2xs"
        />
      </div>

      {/* Add New Word Big Dashed Button or Form */}
      {isAdding ? (
        <form
          onSubmit={handleSaveCard}
          className="bg-[#FFFFFF] rounded-3xl p-6 border-2 border-[#A8BDD2] shadow-sm paper-ruled space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#484A50]/15">
            <span className="text-xs font-bold text-[#52606d] font-['Anuphan',sans-serif]">
              + เพิ่มคำศัพท์ใหม่ลงในห่วงการ์ด
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#74777c] hover:text-[#1d1c16]"
            >
              ยกเลิก
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                English Vocabulary *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Delight"
                value={newEnglish}
                onChange={(e) => setNewEnglish(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                Pronunciation (IPA)
              </label>
              <input
                type="text"
                placeholder="e.g. /dɪˈlaɪt/"
                value={newIpa}
                onChange={(e) => setNewIpa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                Part of Speech
              </label>
              <select
                value={newPartOfSpeech}
                onChange={(e) => setNewPartOfSpeech(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#484A50]"
              >
                <option value="Noun">Noun</option>
                <option value="Verb">Verb</option>
                <option value="Adjective">Adjective</option>
                <option value="Phrase">Phrase</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                ความหมายภาษาไทย (Thai Meaning) *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ความสุข, ความยินดีอย่างยิ่ง"
                value={newThai}
                onChange={(e) => setNewThai(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] font-['Anuphan',sans-serif]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                Example Sentence (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. The warm cup of tea was a pure delight."
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-[#EAE5DC] text-xs font-semibold text-[#484A50]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16]"
            >
              บันทึกการ์ดลงห่วง
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => {
            sounds.playRingClick();
            setIsAdding(true);
          }}
          className="w-full py-5 rounded-3xl bg-[#FFFFFF] hover:bg-[#FAF9F6] border-2 border-dashed border-[#A8BDD2]/60 hover:border-[#A8BDD2] transition-all flex flex-col sm:flex-row items-center justify-center gap-2.5 text-[#52606d] font-['Anuphan',sans-serif] shadow-2xs group"
        >
          <div className="w-8 h-8 rounded-full bg-[#DCEBFA] group-hover:scale-105 flex items-center justify-center text-[#52606d] transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-[#1d1c16]">
              + แตะที่นี่เพื่อเพิ่มคำศัพท์ใหม่ในห่วงการ์ด
            </span>
            <p className="text-[11px] text-[#74777c]">
              พิมพ์คำศัพท์, ความหมายภาษาไทย หรือตัวอย่างประโยคเพื่อสร้างการ์ดทันที
            </p>
          </div>
        </button>
      )}

      {/* Vocabulary List Table matching Image 4 */}
      <div className="bg-[#FFFFFF] rounded-3xl border-[1.5px] border-[#EAE5DC] overflow-hidden shadow-2xs">
        <div className="divide-y divide-[#EAE5DC]">
          {filteredCards.map((card, idx) => (
            <div
              key={card.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors"
            >
              {/* Left: Index + Word + Badge */}
              <div className="flex items-center gap-4 min-w-[220px]">
                <span className="text-xs font-bold text-[#74777c] w-6 shrink-0">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#1d1c16]">
                      {card.english}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F5DFE5]/80 text-[#706065] text-[10px] font-semibold">
                      {card.partOfSpeech.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: IPA + Speaker */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <button
                  onClick={() => speakWord(card.english, 'en')}
                  className="p-1.5 rounded-full hover:bg-[#EAE5DC] text-[#52606d] transition-colors"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#74777c]">
                  {card.ipa || card.phonetic}
                </span>
              </div>

              {/* Right: Thai Meaning */}
              <div className="flex-1 text-xs sm:text-sm font-medium text-[#1d1c16] font-['Anuphan',sans-serif]">
                {card.thai}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    sounds.playRingClick();
                    onDeleteCard(deck.id, card.id);
                  }}
                  className="p-1.5 rounded-xl hover:bg-[#ffdad6]/60 text-[#74777c] hover:text-[#93000a] transition-colors"
                  title="Delete word"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
