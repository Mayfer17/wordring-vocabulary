import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  PlusCircle,
  Layers,
  Sparkles,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  History,
  Search,
  Flame,
  Plus,
} from 'lucide-react';
import { Deck, Flashcard, UserProfile, AppView } from './types/flashcard';
import { INITIAL_DECKS } from './data/defaultDecks';
import { sounds, speakWord } from './utils/audio';
import { Mascot } from './components/Mascot';
import { AuthScreen } from './components/AuthScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { FoldersView } from './components/FoldersView';
import { FolderDetailView } from './components/FolderDetailView';
import { FlashcardItem } from './components/FlashcardItem';
import { QuizMode } from './components/QuizMode';
import { CreateFolderView } from './components/CreateFolderView';
import { HistoryView } from './components/HistoryView';
import { AiDeckModal } from './components/AiDeckModal';

const STORAGE_KEY = 'wordring_decks_v2';
const USER_KEY = 'wordring_user_v2';

export default function App() {
  // Saved decks state
  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved decks', e);
    }
    return INITIAL_DECKS;
  });

  // Current logged in user (defaults to cozy student "คุณมิลค์ Milk")
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved user', e);
    }
    return {
      name: 'คุณมิลค์ (Milk)',
      email: 'learner.cozy@wordring.app',
      isGuest: false,
    };
  });

  // Current view
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || 'deck-cozy-english');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());

  // Mobile sidebar menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User menu dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Global Navbar Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Quick Add Word Modal
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [quickEnglish, setQuickEnglish] = useState('');
  const [quickThai, setQuickThai] = useState('');
  const [quickIpa, setQuickIpa] = useState('');
  const [quickPartOfSpeech, setQuickPartOfSpeech] = useState('noun');
  const [quickDeckId, setQuickDeckId] = useState(activeDeckId);

  // Active deck calculation
  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const cards = activeDeck?.cards || [];
  const currentCard = cards[currentCardIndex] || cards[0];

  // Save decks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    } catch (e) {
      console.warn('Failed to save decks', e);
    }
  }, [decks]);

  // Save user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  }, [user]);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    sounds.setSoundEnabled(next);
    setSoundEnabled(next);
    if (next) sounds.playRingClick();
  };

  // Card status change
  const handleUpdateCardStatus = (cardId: string, status: Flashcard['status']) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== activeDeck.id) return d;
        return {
          ...d,
          cards: d.cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  status,
                  reviewCount: c.reviewCount + 1,
                  lastReviewed: Date.now(),
                }
              : c
          ),
        };
      })
    );
  };

  const handleToggleFavorite = (cardId: string) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== activeDeck.id) return d;
        return {
          ...d,
          cards: d.cards.map((c) =>
            c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        };
      })
    );
  };

  const handleAddCard = (
    deckId: string,
    newCardData: Omit<Flashcard, 'id' | 'status' | 'reviewCount'>
  ) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: `card-${Date.now()}`,
      status: 'new',
      reviewCount: 0,
      createdAt: Date.now(),
    };

    setDecks((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, cards: [newCard, ...d.cards] } : d))
    );
  };

  const handleDeleteCard = (deckId: string, cardId: string) => {
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== deckId) return d;
        return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
      })
    );
    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
  };

  const handleFolderCreated = (newDeck: Deck) => {
    setDecks((prev) => [newDeck, ...prev]);
    setActiveDeckId(newDeck.id);
    setCurrentView('deck-detail');
  };

  // Global search matching cards across all decks
  const searchResults = React.useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase().trim();
    const results: Array<Flashcard & { deckTitle: string; deckId: string }> = [];
    decks.forEach((deck) => {
      deck.cards.forEach((card) => {
        if (
          card.english.toLowerCase().includes(q) ||
          card.thai.toLowerCase().includes(q) ||
          (card.ipa && card.ipa.toLowerCase().includes(q))
        ) {
          results.push({ ...card, deckTitle: deck.title, deckId: deck.id });
        }
      });
    });
    return results.slice(0, 6);
  }, [globalSearch, decks]);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEnglish.trim() || !quickThai.trim()) return;
    sounds.playStamp();
    sounds.playSuccessChime();

    const targetDeckId = quickDeckId || activeDeckId;
    handleAddCard(targetDeckId, {
      english: quickEnglish.trim(),
      thai: quickThai.trim(),
      ipa: quickIpa.trim() || undefined,
      phonetic: quickEnglish.trim().toLowerCase(),
      partOfSpeech: quickPartOfSpeech,
      exampleEnglish: `Using ${quickEnglish.trim()} every day.`,
      exampleThai: `การใช้คำว่า ${quickThai.trim()}`,
      mnemonic: '',
      tone: 'Mid',
    });

    setQuickEnglish('');
    setQuickThai('');
    setQuickIpa('');
    setIsQuickAddModalOpen(false);
  };

  // If user navigated to login view or has no user session
  if (currentView === 'login' || !user) {
    return (
      <AuthScreen
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setCurrentView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col antialiased text-[#484A50]">
      {/* ================= TOP NAVIGATION BAR matching Image 2 & 5 ================= */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#EAE5DC] px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-[0_2px_8px_-2px_rgba(72,74,80,0.04)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Trigger + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playRingClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-[#484A50] hover:bg-[#EAE5DC] transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div
              onClick={() => {
                sounds.playRingClick();
                setCurrentView('home');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src="/assets/wordring-logo.png"
                alt="WordRing Logo"
                className="h-10 sm:h-11 w-auto object-contain hover:scale-105 transition-transform drop-shadow-2xs"
              />
              <span className="hidden sm:inline-block text-[11px] text-[#74777c] font-['Anuphan',sans-serif] pl-1 border-l border-[#EAE5DC]">
                สมุดคำศัพท์ห่วงคู่ใจ • Soft Stationery
              </span>
            </div>
          </div>

          {/* Center: Global Quick Word Search Bar (Replaces duplicate page tabs) */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาคำศัพท์ด่วน... (Quick search words across decks)"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif] shadow-2xs"
              />
              {globalSearch && (
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#74777c] hover:text-[#1d1c16] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Live Search Results Dropdown */}
            {isSearchOpen && globalSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#FFFFFF] rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-xl p-2 z-50 max-h-72 overflow-y-auto divide-y divide-[#EAE5DC]">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-[#74777c] font-['Anuphan',sans-serif]">
                    ไม่พบคำศัพท์ที่ค้นหา
                  </div>
                ) : (
                  searchResults.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => {
                        sounds.playRingClick();
                        setActiveDeckId(card.deckId);
                        setCurrentView('flashcards');
                        setIsSearchOpen(false);
                        setGlobalSearch('');
                      }}
                      className="p-2.5 hover:bg-[#FAF9F6] rounded-xl cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#1d1c16]">{card.english}</span>
                          <span className="text-[10px] text-[#74777c]">({card.ipa || card.phonetic})</span>
                        </div>
                        <p className="text-[11px] text-[#484A50] font-['Anuphan',sans-serif] truncate">
                          {card.thai}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(card.english, 'en');
                          }}
                          className="p-1 rounded-full hover:bg-[#EAE5DC] text-[#52606d]"
                          title="ฟังเสียง"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] bg-[#DCEBFA] text-[#52606d] px-1.5 py-0.5 rounded font-['Anuphan',sans-serif] truncate max-w-[90px]">
                          {card.deckTitle}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right: Quick Add + Streak + Sound + User Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Add Word Button */}
            <button
              onClick={() => {
                sounds.playRingClick();
                setIsQuickAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-all shadow-2xs font-['Anuphan',sans-serif]"
              title="เพิ่มคำศัพท์ใหม่ลงในห่วงการ์ด"
            >
              <Plus className="w-3.5 h-3.5 text-[#52606d]" />
              <span className="hidden sm:inline">+ เพิ่มคำศัพท์</span>
            </button>

            {/* Daily Streak Pill */}
            <div
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-bold text-[#1d1c16] shadow-2xs"
              title="สถิติการเรียนรู้ต่อเนื่อง 5 วัน"
            >
              <Flame className="w-3.5 h-3.5 text-[#e6839b] fill-current" />
              <span>5 วัน</span>
            </div>

            {/* Sound Effects Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-[#FAF9F6] border-[#EAE5DC] text-[#52606d]'
                  : 'bg-[#EAE5DC] border-[#d6c1c7] text-[#74777c]'
              }`}
              title={soundEnabled ? 'เสียงเอฟเฟกต์เปิดอยู่' : 'ปิดเสียง'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* User Profile Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  sounds.playRingClick();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-[#FAF9F6] hover:bg-[#EAE5DC]/70 border border-[#EAE5DC] transition-colors"
              >
                <div className="w-7 h-7 rounded-xl bg-[#F5DFE5] border border-[#d6c1c7] flex items-center justify-center text-[#706065] text-xs font-bold">
                  {user.name.slice(0, 1)}
                </div>
                <span className="text-xs font-bold text-[#1d1c16] hidden sm:inline font-['Anuphan',sans-serif]">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#FFFFFF] rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-lg p-2 z-40">
                  <div className="p-3 border-b border-[#EAE5DC] bg-[#FAF9F6] rounded-xl mb-1">
                    <p className="text-xs font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#74777c] truncate">{user.email}</p>
                    {user.isGuest && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#DCEBFA] text-[10px] font-semibold text-[#52606d]">
                        โหมดแขก (Guest Mode)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.playRingClick();
                      setIsUserMenuOpen(false);
                      setCurrentView('login');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FAF9F6] text-xs font-semibold text-[#484A50] text-left flex items-center gap-2 font-['Anuphan',sans-serif]"
                  >
                    <User className="w-4 h-4 text-[#7d98b0]" />
                    <span>สลับบัญชี / เข้าสู่ระบบ (Log In)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playRingClick();
                      setIsUserMenuOpen(false);
                      setUser(null);
                      setCurrentView('login');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#ffdad6]/60 text-xs font-semibold text-[#ba1a1a] text-left flex items-center gap-2 font-['Anuphan',sans-serif]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ (Log Out)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER WITH SIDEBAR matching Image 2 & 5 ================= */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col justify-between w-60 shrink-0 select-none">
          <div className="space-y-4">
            {/* Navigation links matching Image 2 sidebar */}
            <div className="space-y-1.5 bg-[#FFFFFF] p-3 rounded-3xl border border-[#EAE5DC] shadow-2xs">
              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('home');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'home'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home (หน้าแรก)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('decks');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'decks' || currentView === 'deck-detail'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>My Vocabulary (สำหรับคำศัพท์)</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-[#EAE5DC] text-[10px] font-bold text-[#52606d] flex items-center justify-center">
                  {decks.length}
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('create-folder');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'create-folder'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Folder (เพิ่มโฟลเดอร์)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('flashcards');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'flashcards'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards (แฟลชการ์ดห่วง)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('quiz');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'quiz'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#e6839b]" />
                <span>Review (ทบทวนและควิซ)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  setCurrentView('history');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all font-['Anuphan',sans-serif] ${
                  currentView === 'history'
                    ? 'bg-[#DCEBFA] text-[#52606d] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6]'
                }`}
              >
                <History className="w-4 h-4 text-[#52606d]" />
                <span>History (ประวัติการเรียนรู้)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playRingClick();
                  alert('ตั้งค่าเสียงและระบบการเรียนรู้ถูกจัดเตรียมไว้อย่างเหมาะสมแล้วในโหมด Soft Stationery 🌸');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#484A50] hover:bg-[#FAF9F6] transition-all font-['Anuphan',sans-serif]"
              >
                <Settings className="w-4 h-4 text-[#74777c]" />
                <span>Settings (ตั้งค่า)</span>
              </button>
            </div>

            {/* AI Generator Button */}
            <button
              onClick={() => {
                sounds.playRingClick();
                setIsAiModalOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#F5DFE5] hover:bg-[#edd0d7] text-xs font-bold text-[#6a5a5f] border border-[#d6c1c7] transition-all flex items-center justify-center gap-2 shadow-2xs font-['Anuphan',sans-serif]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e6839b]" />
              <span>AI สร้างชุดคำศัพท์</span>
            </button>
          </div>

          {/* Sidebar Mascot Comfort Note matching Image 2 */}
          <div className="p-4 rounded-3xl bg-[#F5DFE5]/60 border border-[#f3dde3] shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">🐾</span>
              <span className="text-xs font-bold text-[#6a5a5f] font-['Anuphan',sans-serif]">
                เจ้าโมจิชวนผ่อนคลาย
              </span>
            </div>
            <p className="text-[11px] text-[#706065] font-['Anuphan',sans-serif] leading-relaxed">
              เรียนรู้อย่างผ่อนคลาย ทีละคำ อย่างสบายใจ ไม่ต้องเร่งรีบนะเหมียว!
            </p>
          </div>
        </aside>

        {/* Content Area Rendering the Selected View */}
        <main className="flex-1 min-w-0">
          {currentView === 'home' && (
            <HomeDashboard
              user={user}
              decks={decks}
              activeDeck={activeDeck}
              onStartReview={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('flashcards');
              }}
              onStartQuiz={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('quiz');
              }}
              onGoToDecks={() => setCurrentView('decks')}
              onGoToHistory={() => setCurrentView('history')}
            />
          )}

          {currentView === 'decks' && (
            <FoldersView
              decks={decks}
              onSelectDeck={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('deck-detail');
              }}
              onOpenCreateFolder={() => setCurrentView('create-folder')}
              onStartQuiz={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('quiz');
              }}
            />
          )}

          {currentView === 'deck-detail' && (
            <FolderDetailView
              deck={activeDeck}
              onBack={() => setCurrentView('decks')}
              onStartReview={() => setCurrentView('flashcards')}
              onStartQuiz={() => setCurrentView('quiz')}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
            />
          )}

          {currentView === 'create-folder' && (
            <CreateFolderView
              onBack={() => setCurrentView('decks')}
              onFolderCreated={handleFolderCreated}
            />
          )}

          {/* THE REQUESTED VOCABULARY QUIZ INTERFACE */}
          {currentView === 'quiz' && (
            <QuizMode
              deck={activeDeck}
              onExitQuiz={() => setCurrentView('home')}
              onUpdateCardStatus={handleUpdateCardStatus}
            />
          )}

          {/* FLASHCARD STUDY VIEW matching Image 3 */}
          {currentView === 'flashcards' && (
            <div className="w-full max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentView('deck-detail')}
                  className="text-xs font-semibold text-[#74777c] hover:text-[#1d1c16] font-['Anuphan',sans-serif] flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ย้อนกลับไปโฟลเดอร์</span>
                </button>

                <button
                  onClick={() => setCurrentView('quiz')}
                  className="px-3 py-1.5 rounded-xl bg-[#DCEBFA] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] flex items-center gap-1.5 font-['Anuphan',sans-serif]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ทดสอบคำศัพท์ (Quiz)</span>
                </button>
              </div>

              {cards.length === 0 ? (
                <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#EAE5DC] text-center">
                  <p className="text-xs text-[#74777c] font-['Anuphan',sans-serif]">
                    โฟลเดอร์นี้ยังไม่มีการ์ดคำศัพท์
                  </p>
                </div>
              ) : (
                <>
                  <FlashcardItem
                    card={currentCard}
                    currentIndex={currentCardIndex}
                    totalCards={cards.length}
                    onStatusChange={handleUpdateCardStatus}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  {/* Navigation bar */}
                  <div className="flex items-center justify-between px-2 pt-2">
                    <button
                      onClick={() => {
                        sounds.playPaperFlip();
                        setCurrentCardIndex((prev) =>
                          prev > 0 ? prev - 1 : cards.length - 1
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-semibold text-[#484A50] shadow-2xs flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPaperFlip();
                        const shuffled = [...cards].sort(() => 0.5 - Math.random());
                        setDecks((prev) =>
                          prev.map((d) =>
                            d.id === activeDeck.id ? { ...d, cards: shuffled } : d
                          )
                        );
                        setCurrentCardIndex(0);
                      }}
                      className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-[#74777c] hover:text-[#1d1c16]"
                      title="สลับการ์ดแบบสุ่ม"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        sounds.playPaperFlip();
                        setCurrentCardIndex((prev) =>
                          prev < cards.length - 1 ? prev + 1 : 0
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-semibold text-[#484A50] shadow-2xs flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* VOCABULARY HISTORY & LEARNING TIMELINE */}
          {currentView === 'history' && (
            <HistoryView
              decks={decks}
              onSelectDeck={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('deck-detail');
              }}
              onStartQuiz={(d) => {
                setActiveDeckId(d.id);
                setCurrentView('quiz');
              }}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/25 backdrop-blur-xs flex">
          <div className="w-3/4 max-w-xs bg-[#FFFFFF] h-full p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
                <img
                  src="/assets/wordring-logo.png"
                  alt="WordRing Logo"
                  className="h-9 w-auto object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-[#EAE5DC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 font-['Anuphan',sans-serif]">
                {[
                  { id: 'home', label: 'Home (หน้าแรก)', icon: Home },
                  { id: 'decks', label: 'My Vocabulary (สำหรับคำศัพท์)', icon: BookOpen },
                  { id: 'create-folder', label: 'Add Folder (เพิ่มโฟลเดอร์)', icon: PlusCircle },
                  { id: 'quiz', label: 'Vocabulary Quiz (แบบฝึกหัด)', icon: Sparkles },
                  { id: 'flashcards', label: 'Flashcards (แฟลชการ์ดห่วง)', icon: Layers },
                  { id: 'history', label: 'History (ประวัติการเรียนรู้)', icon: History },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.playRingClick();
                        setCurrentView(item.id as AppView);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold ${
                        currentView === item.id ? 'bg-[#DCEBFA] text-[#52606d]' : 'text-[#484A50]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playRingClick();
                setIsMobileMenuOpen(false);
                setCurrentView('login');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-semibold text-[#1d1c16] flex items-center justify-center gap-2 font-['Anuphan',sans-serif]"
            >
              <User className="w-4 h-4" />
              <span>เข้าสู่ระบบ / สลับบัญชี</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* AI Deck Modal */}
      <AiDeckModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onDeckCreated={(newDeck) => {
          setDecks((prev) => [newDeck, ...prev]);
          setActiveDeckId(newDeck.id);
          setCurrentView('deck-detail');
        }}
      />

      {/* Quick Add Word Modal */}
      {isQuickAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1c16]/30 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-3xl border-[1.5px] border-[#EAE5DC] shadow-xl overflow-hidden paper-ruled">
            <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DCEBFA] border border-[#A8BDD2] flex items-center justify-center text-[#52606d]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
                    เพิ่มคำศัพท์ใหม่ลงในห่วง
                  </h3>
                  <p className="text-[10px] text-[#74777c]">Quick Add Word</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#EAE5DC] text-[#74777c]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                  เลือกโฟลเดอร์ปลายทาง (Target Deck)
                </label>
                <select
                  value={quickDeckId}
                  onChange={(e) => setQuickDeckId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif]"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      📁 {d.title} ({d.cards.length} คำ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                  คำศัพท์ภาษาอังกฤษ (English Vocabulary) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cherish"
                  value={quickEnglish}
                  onChange={(e) => setQuickEnglish(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                    คำอ่าน IPA (Pronunciation)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /ˈtʃer.ɪʃ/"
                    value={quickIpa}
                    onChange={(e) => setQuickIpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                    ชนิดคำ (Part of Speech)
                  </label>
                  <select
                    value={quickPartOfSpeech}
                    onChange={(e) => setQuickPartOfSpeech(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#484A50]"
                  >
                    <option value="Noun">Noun</option>
                    <option value="Verb">Verb</option>
                    <option value="Adjective">Adjective</option>
                    <option value="Phrase">Phrase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                  ความหมายภาษาไทย (Thai Meaning) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ทะนุถนอม, รักใคร่และเห็นคุณค่า"
                  value={quickThai}
                  onChange={(e) => setQuickThai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#EAE5DC]">
                <button
                  type="button"
                  onClick={() => setIsQuickAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] text-xs font-semibold text-[#484A50]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] shadow-2xs font-['Anuphan',sans-serif]"
                >
                  บันทึกลงห่วงการ์ด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
