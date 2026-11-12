import React, { useState } from 'react';
import { Search, Plus, Sparkles, Folder, ArrowRight, BookOpen, Volume2, Star, Check } from 'lucide-react';
import { Deck } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds } from '../utils/audio';

interface FoldersViewProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onOpenCreateFolder: () => void;
  onStartQuiz: (deck: Deck) => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  decks,
  onSelectDeck,
  onOpenCreateFolder,
  onStartQuiz,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = [
    '#ภาษาอังกฤษ',
    '#สนทนาและอารมณ์',
    '#TOEIC 850+',
    '#ท่องเที่ยวและคาเฟ่',
    '#คำศัพท์ทั่วไป',
  ];

  const filteredDecks = decks.filter((deck) => {
    const matchesSearch =
      deck.title.toLowerCase().includes(search.toLowerCase()) ||
      (deck.titleThai && deck.titleThai.toLowerCase().includes(search.toLowerCase())) ||
      (deck.category && deck.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-xs text-[#74777c] font-['Anuphan',sans-serif] mb-1">
          สมุดคำศัพท์ของฉัน &gt; คลังโฟลเดอร์ทั้งหมด
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1c16] font-['Anuphan',sans-serif] flex items-center gap-2">
              <span>สำรับและโฟลเดอร์คำศัพท์ของฉัน</span>
              <span>📁✨</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#74777c] font-['Anuphan',sans-serif] mt-1 max-w-2xl leading-relaxed">
              จัดหมวดหมู่แฟลชการ์ดห่วงคำศัพท์ตามความสนใจ เลือกโฟลเดอร์เพื่อดูการ์ด พลิกอ่านง่ายๆ หรือเริ่มทำควิซทบทวนได้ทันที
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playRingClick();
              onOpenCreateFolder();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-all shadow-xs shrink-0 font-['Anuphan',sans-serif]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52606d]" />
            <span>+ สร้างโฟลเดอร์ใหม่</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar & Tag Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาโฟลเดอร์หรือแท็ก..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif] shadow-2xs"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playRingClick();
                setSelectedTag(selectedTag === tag ? null : tag);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors font-['Anuphan',sans-serif] ${
                selectedTag === tag
                  ? 'bg-[#DCEBFA] text-[#52606d] border border-[#A8BDD2]'
                  : 'bg-[#FAF9F6] text-[#74777c] border border-[#EAE5DC] hover:bg-[#EAE5DC]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Folders Grid matching Image 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDecks.map((deck) => {
          const masteredCount = deck.cards.filter((c) => c.status === 'mastered').length;
          const percent = deck.cards.length > 0 ? Math.round((masteredCount / deck.cards.length) * 100) : 0;

          // Theme pill colors
          const themeBadge = {
            blue: 'bg-[#DCEBFA] text-[#52606d]',
            pink: 'bg-[#F5DFE5] text-[#706065]',
            sage: 'bg-[#e1ece3] text-[#486350]',
            sand: 'bg-[#ede8df] text-[#52606d]',
            lavender: 'bg-[#e6ebfa] text-[#4d5c7c]',
          }[deck.color || 'blue'];

          return (
            <div
              key={deck.id}
              className="bg-[#FFFFFF] rounded-3xl p-5 border-[1.5px] border-[#EAE5DC] hover:border-[#A8BDD2] shadow-2xs transition-all relative flex flex-col justify-between group"
            >
              {/* Binder Top Coils */}
              <div className="absolute -top-3 left-8 flex gap-6 pointer-events-none">
                <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
                <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
              </div>

              <div>
                {/* Category & Word count badge */}
                <div className="flex items-center justify-between text-[11px] mb-3">
                  <span className="flex items-center gap-1.5 font-medium text-[#74777c] font-['Anuphan',sans-serif]">
                    <span className="w-2 h-2 rounded-full bg-[#7d98b0]" />
                    {deck.category || 'คำศัพท์ทั่วไป'} • {deck.cards.length} คำศัพท์
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${themeBadge}`}>
                    {percent === 100 ? 'จำได้ครบแล้ว' : percent > 0 ? `ทบทวนแล้ว ${percent}%` : 'กำลังเรียน'}
                  </span>
                </div>

                {/* Deck Title */}
                <h3 className="text-base font-bold text-[#1d1c16] group-hover:text-[#52606d] transition-colors">
                  {deck.title}
                </h3>
                <p className="text-xs text-[#74777c] mt-1 font-['Anuphan',sans-serif] line-clamp-2 leading-relaxed">
                  {deck.titleThai || deck.description}
                </p>

                {/* Vocabulary preview pills */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {deck.cards.slice(0, 3).map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded-lg bg-[#FAF9F6] border border-[#EAE5DC] text-[11px] text-[#484A50] font-medium"
                    >
                      {c.english}
                    </span>
                  ))}
                  {deck.cards.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-lg bg-[#EAE5DC]/60 text-[10px] text-[#74777c] font-medium">
                      +{deck.cards.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                <button
                  onClick={() => {
                    sounds.playRingClick();
                    onStartQuiz(deck);
                  }}
                  className="text-xs font-semibold text-[#52606d] hover:text-[#1d1c16] flex items-center gap-1 font-['Anuphan',sans-serif]"
                >
                  <Sparkles className="w-3 h-3 text-[#e6839b]" />
                  <span>ทำควิซ</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playRingClick();
                    onSelectDeck(deck);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1d1c16] hover:text-[#52606d] font-['Anuphan',sans-serif]"
                >
                  <span>เปิดโฟลเดอร์นี้</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Create Folder Card */}
        <div
          onClick={() => {
            sounds.playRingClick();
            onOpenCreateFolder();
          }}
          className="bg-[#FAF9F6]/80 hover:bg-[#FFFFFF] rounded-3xl p-6 border-2 border-dashed border-[#EAE5DC] hover:border-[#A8BDD2] transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] group-hover:bg-[#DCEBFA] border border-[#EAE5DC] flex items-center justify-center text-[#52606d] transition-colors shadow-2xs mb-3">
            <Plus className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
            + สร้างโฟลเดอร์ใหม่
          </h3>
          <p className="text-xs text-[#74777c] mt-1 max-w-xs font-['Anuphan',sans-serif] leading-relaxed">
            ตั้งชื่อ เลือกสีสันพาสเทล และเริ่มร้อยห่วงการ์ดคำศัพท์ของคุณเอง
          </p>

          <span className="mt-3 text-xs font-bold text-[#52606d] underline font-['Anuphan',sans-serif]">
            คลิกเพื่อสร้างสำรับ
          </span>
        </div>
      </div>

      {/* Mascot Study Tip Banner matching Image 5 footer */}
      <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EAE5DC] shadow-2xs flex items-center gap-4">
        <Mascot type="kitten" size="sm" />
        <div className="text-xs text-[#484A50] font-['Anuphan',sans-serif]">
          <span className="font-bold text-[#1d1c16]">เคล็ดลับจากน้องคุกกี้ 🐾 :</span>{' '}
          สีพาสเทลช่วยลดความล้าของสายตาเมื่อต้องท่องศัพท์เป็นเวลานาน จัดหมวดหมู่โฟลเดอร์แยกตามเป้าหมายช่วยให้จำได้แม่นยำยิ่งขึ้น เหมียว!
        </div>
      </div>
    </div>
  );
};
