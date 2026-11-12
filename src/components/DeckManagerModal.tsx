import React, { useState } from 'react';
import { X, Plus, Search, Trash2, Edit3, Volume2, Star, Check } from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { sounds, speakWord } from '../utils/audio';

interface DeckManagerModalProps {
  deck: Deck;
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (deckId: string, card: Omit<Flashcard, 'id' | 'status' | 'reviewCount'>) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
  onResetDeckProgress: (deckId: string) => void;
}

export const DeckManagerModal: React.FC<DeckManagerModalProps> = ({
  deck,
  isOpen,
  onClose,
  onAddCard,
  onDeleteCard,
  onToggleFavorite,
  onResetDeckProgress,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered' | 'favorite'>('all');
  const [isAddingCard, setIsAddingCard] = useState(false);

  // New card form state
  const [newThai, setNewThai] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newExampleThai, setNewExampleThai] = useState('');
  const [newExampleEnglish, setNewExampleEnglish] = useState('');
  const [newMnemonic, setNewMnemonic] = useState('');
  const [newTone, setNewTone] = useState('Mid');

  if (!isOpen) return null;

  const filteredCards = deck.cards.filter((card) => {
    const matchesSearch =
      card.thai.toLowerCase().includes(search.toLowerCase()) ||
      card.phonetic.toLowerCase().includes(search.toLowerCase()) ||
      card.english.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'learning') return card.status === 'learning';
    if (filter === 'mastered') return card.status === 'mastered';
    if (filter === 'favorite') return card.isFavorite;
    return true;
  });

  const handleSaveNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThai.trim() || !newEnglish.trim()) return;

    sounds.playStamp();
    onAddCard(deck.id, {
      thai: newThai.trim(),
      phonetic: newPhonetic.trim() || '—',
      english: newEnglish.trim(),
      partOfSpeech: newPartOfSpeech,
      exampleThai: newExampleThai.trim() || `${newThai.trim()} ในชีวิตประจำวัน`,
      exampleEnglish: newExampleEnglish.trim() || `Using ${newEnglish.trim()} every day.`,
      mnemonic: newMnemonic.trim(),
      tone: newTone,
    });

    // Reset form
    setNewThai('');
    setNewPhonetic('');
    setNewEnglish('');
    setNewExampleThai('');
    setNewExampleEnglish('');
    setNewMnemonic('');
    setIsAddingCard(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1c16]/30 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7d98b0]" />
              <h2 className="text-base font-bold text-[#1d1c16]">{deck.title}</h2>
            </div>
            <p className="text-xs text-[#74777c] mt-0.5">
              Deck Organizer • {deck.cards.length} flashcards in collection
            </p>
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

        {/* Toolbar: Search, Filters, Add Card Button */}
        <div className="p-4 border-b border-[#EAE5DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777c]" />
            <input
              type="text"
              placeholder="Search words (Thai, English, or phonetics)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'learning', 'mastered', 'favorite'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  sounds.playRingClick();
                  setFilter(mode);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filter === mode
                    ? 'bg-[#DCEBFA] text-[#52606d] border border-[#A8BDD2]'
                    : 'bg-[#EAE5DC]/70 text-[#484A50] hover:bg-[#EAE5DC]'
                }`}
              >
                {mode === 'all'
                  ? `All (${deck.cards.length})`
                  : mode === 'learning'
                  ? 'Need Practice'
                  : mode === 'mastered'
                  ? 'Mastered'
                  : 'Starred'}
              </button>
            ))}

            <button
              onClick={() => {
                sounds.playRingClick();
                setIsAddingCard(!isAddingCard);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-colors flex items-center gap-1 shrink-0 shadow-2xs active:translate-y-[1px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingCard ? 'Cancel' : 'Add Card'}</span>
            </button>
          </div>
        </div>

        {/* Content Body: Scrollable Cards or New Card Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* Add New Card Collapsible Form (Stationery Index Card Style) */}
          {isAddingCard && (
            <form
              onSubmit={handleSaveNewCard}
              className="p-4 sm:p-5 rounded-xl bg-[#FAF9F6] border-[1.5px] border-[#A8BDD2] paper-ruled shadow-xs mb-4"
            >
              <div className="flex items-center justify-between mb-3 border-b border-dashed border-[#484a50]/20 pb-2">
                <span className="text-xs font-bold text-[#52606d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7d98b0]" />
                  New Stationery Flashcard
                </span>
                <span className="text-[10px] text-[#74777c]">Bilingual entry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Thai Word / Phrase *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. สวัสดี"
                    value={newThai}
                    onChange={(e) => setNewThai(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-sm focus:border-[#A8BDD2] focus:outline-none font-['IBM_Plex_Sans_Thai',sans-serif]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Phonetic / Romanization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. sa-wat-dee"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    English Meaning *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hello / Greetings"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Part of Speech
                  </label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none text-[#484A50]"
                  >
                    <option value="noun">noun</option>
                    <option value="verb">verb</option>
                    <option value="adjective">adjective</option>
                    <option value="phrase">phrase</option>
                    <option value="greeting">greeting</option>
                    <option value="idiom">idiom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Example Sentence (Thai)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. สวัสดีครับ ยินดีที่ได้พบ"
                    value={newExampleThai}
                    onChange={(e) => setNewExampleThai(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none font-['IBM_Plex_Sans_Thai',sans-serif]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Example Sentence (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hello, pleased to meet you"
                    value={newExampleEnglish}
                    onChange={(e) => setNewExampleEnglish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Memory Mnemonic / Study Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Picture a warm wai greeting hands"
                    value={newMnemonic}
                    onChange={(e) => setNewMnemonic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1">
                    Tone Category
                  </label>
                  <select
                    value={newTone}
                    onChange={(e) => setNewTone(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs focus:border-[#A8BDD2] focus:outline-none text-[#484A50]"
                  >
                    <option value="Mid">Mid Tone (เสียงสามัญ)</option>
                    <option value="Low">Low Tone (เสียงเอก)</option>
                    <option value="Falling">Falling Tone (เสียงโท)</option>
                    <option value="High">High Tone (เสียงตรี)</option>
                    <option value="Rising">Rising Tone (เสียงจัตวา)</option>
                    <option value="Mixed">Mixed / Polysyllabic</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] text-xs font-semibold text-[#484A50]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] shadow-2xs"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          )}

          {/* Cards List */}
          {filteredCards.length === 0 ? (
            <div className="text-center py-10 bg-[#FAF9F6] rounded-xl border border-[#EAE5DC]">
              <p className="text-xs text-[#74777c]">No cards match your filter or search.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredCards.map((card, index) => (
                <div
                  key={card.id}
                  className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#EAE5DC] hover:border-[#A8BDD2] flex items-center justify-between gap-3 shadow-2xs transition-all"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#FAF9F6] border border-[#EAE5DC] flex items-center justify-center text-[10px] font-bold text-[#74777c] shrink-0">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#1d1c16] font-['IBM_Plex_Sans_Thai',sans-serif]">
                          {card.thai}
                        </span>
                        <button
                          onClick={() => speakWord(card.thai, 'th')}
                          title="Speak Thai"
                          className="p-1 rounded-full hover:bg-[#EAE5DC] text-[#52606d]"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs text-[#74777c]">({card.phonetic})</span>
                      </div>
                      <p className="text-xs text-[#484A50] truncate font-medium">
                        {card.english}
                      </p>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status Pill */}
                    {card.status === 'mastered' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcebfa] text-[#52606d]">
                        Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[#74777c]">
                        Learning
                      </span>
                    )}

                    {/* Bookmark */}
                    <button
                      onClick={() => onToggleFavorite(card.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        card.isFavorite
                          ? 'text-[#e6839b] bg-[#F5DFE5]'
                          : 'text-[#a4a7ab] hover:text-[#484A50] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        sounds.playRingClick();
                        onDeleteCard(deck.id, card.id);
                      }}
                      title="Delete card"
                      className="p-1.5 rounded-lg text-[#ba1a1a]/70 hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#74777c]">
          <button
            onClick={() => {
              if (confirm('Reset mastery status for all cards in this deck?')) {
                sounds.playRingClick();
                onResetDeckProgress(deck.id);
              }
            }}
            className="text-xs text-[#ba1a1a]/80 hover:text-[#ba1a1a] hover:underline"
          >
            Reset Progress
          </button>

          <button
            onClick={() => {
              sounds.playRingClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] border border-[#A8BDD2] text-[#1d1c16] font-bold shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
