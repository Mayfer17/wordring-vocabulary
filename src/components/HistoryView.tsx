import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Volume2,
  Calendar,
  Sparkles,
  BookOpen,
  Star,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds, speakWord } from '../utils/audio';

interface HistoryViewProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onStartQuiz: (deck: Deck) => void;
  onToggleFavorite: (cardId: string) => void;
}

interface HistoryItem extends Flashcard {
  deckTitle: string;
  deckId: string;
  addedTimestamp: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  decks,
  onSelectDeck,
  onStartQuiz,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'mastered' | 'learning' | 'starred'>('all');

  // Flatten all cards with deck info and timestamps
  const allHistoryItems: HistoryItem[] = useMemo(() => {
    const items: HistoryItem[] = [];
    const now = Date.now();

    decks.forEach((deck, deckIndex) => {
      deck.cards.forEach((card, cardIndex) => {
        // Calculate realistic timestamps if not set
        const simulatedOffset =
          card.createdAt ||
          now - (deckIndex * 86400000 * 1.5 + cardIndex * 3600000 * 3.2);

        items.push({
          ...card,
          deckTitle: deck.title,
          deckId: deck.id,
          addedTimestamp: simulatedOffset,
        });
      });
    });

    // Sort newest first
    return items.sort((a, b) => b.addedTimestamp - a.addedTimestamp);
  }, [decks]);

  // Filtering
  const now = Date.now();
  const oneDay = 86400000;
  const filteredItems = useMemo(() => {
    return allHistoryItems.filter((item) => {
      const matchesSearch =
        item.english.toLowerCase().includes(search.toLowerCase()) ||
        item.thai.toLowerCase().includes(search.toLowerCase()) ||
        (item.ipa && item.ipa.toLowerCase().includes(search.toLowerCase())) ||
        item.deckTitle.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === 'today') {
        return now - item.addedTimestamp < oneDay;
      }
      if (filter === 'mastered') {
        return item.status === 'mastered';
      }
      if (filter === 'learning') {
        return item.status === 'learning';
      }
      if (filter === 'starred') {
        return item.isFavorite;
      }
      return true;
    });
  }, [allHistoryItems, search, filter, now]);

  // Format date helper
  const formatDateGroup = (timestamp: number) => {
    const diff = now - timestamp;
    if (diff < oneDay * 0.8) {
      return 'วันนี้ (Today)';
    } else if (diff < oneDay * 1.8) {
      return 'เมื่อวานนี้ (Yesterday)';
    } else if (diff < oneDay * 3.5) {
      return '2-3 วันที่ผ่านมา (2-3 Days Ago)';
    } else {
      return 'สัปดาห์ที่ผ่านมา (Past Weeks)';
    }
  };

  // Group by date
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: HistoryItem[] } = {};
    filteredItems.forEach((item) => {
      const groupKey = formatDateGroup(item.addedTimestamp);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    return groups;
  }, [filteredItems]);

  const masteredCount = allHistoryItems.filter((i) => i.status === 'mastered').length;
  const starredCount = allHistoryItems.filter((i) => i.isFavorite).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none font-['Nunito_Sans',sans-serif]">
      {/* Top Breadcrumb */}
      <div>
        <p className="text-xs text-[#74777c] font-['Anuphan',sans-serif] mb-1">
          สมุดคำศัพท์ของฉัน &gt; ประวัติการเพิ่มคำศัพท์และการเรียนรู้
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1c16] font-['Anuphan',sans-serif] flex items-center gap-2">
              <span>ประวัติการเพิ่มคำศัพท์และบันทึกการเรียนรู้</span>
              <span>📜✨</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#74777c] font-['Anuphan',sans-serif] mt-1 max-w-2xl leading-relaxed">
              ติดตามบันทึกคำศัพท์ที่คุณได้เพิ่มลงในห่วงการ์ด ทบทวนคำศัพท์ตามลำดับเวลา และย้อนดูความคืบหน้าอย่างสบายใจ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs font-bold text-[#52606d] shadow-2xs">
              รวม {allHistoryItems.length} คำศัพท์
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EAE5DC] shadow-2xs">
          <span className="text-[10px] font-bold text-[#74777c] uppercase tracking-wider block mb-1">
            คำศัพท์ที่บันทึก
          </span>
          <div className="text-2xl font-extrabold text-[#1d1c16]">
            {allHistoryItems.length} <span className="text-xs font-normal text-[#74777c]">คำ</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EAE5DC] shadow-2xs">
          <span className="text-[10px] font-bold text-[#52606d] uppercase tracking-wider block mb-1">
            จำได้แม่นยำแล้ว
          </span>
          <div className="text-2xl font-extrabold text-[#52606d]">
            {masteredCount} <span className="text-xs font-normal text-[#74777c]">คำ</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EAE5DC] shadow-2xs">
          <span className="text-[10px] font-bold text-[#e6839b] uppercase tracking-wider block mb-1">
            คำศัพท์ติดดาว
          </span>
          <div className="text-2xl font-extrabold text-[#e6839b]">
            {starredCount} <span className="text-xs font-normal text-[#74777c]">คำ</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#486350] uppercase tracking-wider block mb-1">
              สำรับทั้งหมด
            </span>
            <div className="text-2xl font-extrabold text-[#1d1c16]">
              {decks.length} <span className="text-xs font-normal text-[#74777c]">โฟลเดอร์</span>
            </div>
          </div>
          <BookOpen className="w-6 h-6 text-[#A8BDD2]" />
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาในประวัติคำศัพท์ (คำ, คำแปล, IPA หรือโฟลเดอร์)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif] shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'ทั้งหมด (All)' },
            { id: 'today', label: 'เพิ่มล่าสุด (Recently Added)' },
            { id: 'mastered', label: 'จำได้แล้ว (Mastered)' },
            { id: 'learning', label: 'กำลังเรียน (Learning)' },
            { id: 'starred', label: 'คำโปรด (Starred)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playRingClick();
                setFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors font-['Anuphan',sans-serif] ${
                filter === tab.id
                  ? 'bg-[#DCEBFA] text-[#52606d] border border-[#A8BDD2] shadow-2xs'
                  : 'bg-[#FAF9F6] text-[#74777c] border border-[#EAE5DC] hover:bg-[#EAE5DC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl p-10 border border-[#EAE5DC] text-center shadow-2xs">
          <Mascot type="cloud" size="md" />
          <h3 className="text-base font-bold text-[#1d1c16] mt-3 font-['Anuphan',sans-serif]">
            ไม่พบประวัติคำศัพท์ที่ตรงกับการค้นหา
          </h3>
          <p className="text-xs text-[#74777c] mt-1 font-['Anuphan',sans-serif]">
            ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรอง "ทั้งหมด" ดูนะ
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([groupTitle, items]) => (
            <div key={groupTitle} className="space-y-3">
              {/* Group Date Header */}
              <div className="flex items-center gap-2 px-1">
                <Calendar className="w-4 h-4 text-[#7d98b0]" />
                <h3 className="text-xs font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
                  {groupTitle}
                </h3>
                <span className="text-[11px] text-[#74777c]">
                  • {items.length} คำ
                </span>
              </div>

              {/* Items Card List with Stationery Feel */}
              <div className="bg-[#FFFFFF] rounded-3xl border-[1.5px] border-[#EAE5DC] divide-y divide-[#EAE5DC] overflow-hidden shadow-2xs">
                {items.map((item) => {
                  const targetDeck = decks.find((d) => d.id === item.deckId) || decks[0];

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors paper-ruled"
                    >
                      {/* Left: Word + Pronunciation + Deck Badge */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-[280px]">
                        <button
                          onClick={() => {
                            sounds.playRingClick();
                            onToggleFavorite(item.id);
                          }}
                          className={`p-1.5 rounded-xl transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                            item.isFavorite
                              ? 'text-[#e6839b] bg-[#F5DFE5]'
                              : 'text-[#cbd8e6] hover:text-[#e6839b] hover:bg-[#FAF9F6]'
                          }`}
                          title={item.isFavorite ? 'คำโปรด' : 'เพิ่มในคำโปรด'}
                        >
                          <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-[#1d1c16] font-['Nunito_Sans',sans-serif]">
                              {item.english}
                            </span>

                            <span className="px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[10px] font-semibold text-[#52606d]">
                              {item.partOfSpeech.toLowerCase()}
                            </span>

                            <button
                              onClick={() => speakWord(item.english, 'en')}
                              className="p-1 rounded-full hover:bg-[#EAE5DC] text-[#52606d] transition-colors"
                              title="ฟังเสียงอ่าน"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>

                            <span className="text-xs font-mono text-[#74777c]">
                              {item.ipa || item.phonetic}
                            </span>
                          </div>

                          {/* Deck origin */}
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              onClick={() => onSelectDeck(targetDeck)}
                              className="text-[10px] text-[#52606d] bg-[#DCEBFA]/60 hover:bg-[#DCEBFA] px-2 py-0.5 rounded-md cursor-pointer font-['Anuphan',sans-serif] transition-colors truncate max-w-[200px]"
                            >
                              📁 {item.deckTitle}
                            </span>

                            <span className="text-[10px] text-[#74777c]">
                              ทบทวนแล้ว {item.reviewCount} ครั้ง
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Thai Meaning */}
                      <div className="flex-1 text-xs sm:text-sm font-medium text-[#1d1c16] font-['Anuphan',sans-serif]">
                        {item.thai}
                      </div>

                      {/* Right: Status Pill & Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'mastered' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#e1f5ea] text-[#1b432a] text-[10px] font-bold border border-[#81a68d]/40">
                            ✓ จำได้แล้ว
                          </span>
                        ) : item.status === 'learning' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#74777c] text-[10px] font-medium border border-[#EAE5DC]">
                            กำลังเรียน
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#52606d] text-[10px] font-medium">
                            เพิ่งเพิ่มใหม่
                          </span>
                        )}

                        <button
                          onClick={() => {
                            sounds.playRingClick();
                            onStartQuiz(targetDeck);
                          }}
                          className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-[#DCEBFA] border border-[#EAE5DC] text-[#484A50] hover:text-[#1d1c16] text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1 font-['Anuphan',sans-serif]"
                          title="ทำควิซทบทวนคำนี้"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#52606d]" />
                          <span className="hidden sm:inline">ทบทวน</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mascot Footer Note */}
      <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EAE5DC] shadow-2xs flex items-center gap-4">
        <Mascot type="kitten" size="sm" />
        <div className="text-xs text-[#484A50] font-['Anuphan',sans-serif]">
          <span className="font-bold text-[#1d1c16]">บันทึกของน้องคลาวดี้ 🌸 :</span>{' '}
          คำศัพท์ทุกคำที่คุณบันทึกไว้ในสมุดห่วง คือหนึ่งก้าวของการเติบโตทางภาษา ค่อยๆ เพิ่มทีละคำและย้อนกลับมาทบทวนอย่างสม่ำเสมอนะ!
        </div>
      </div>
    </div>
  );
};
