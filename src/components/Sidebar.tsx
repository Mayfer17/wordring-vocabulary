import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Layers,
  Sparkles,
  History,
  PlusCircle,
  Volume2,
  VolumeX,
  Settings,
  User,
  LogOut,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';
import { AppView, UserProfile } from '../types/flashcard';
import { sounds } from '../utils/audio';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  decksCount: number;
  user: UserProfile | null;
  onOpenAiModal: () => void;
  onOpenSettings?: () => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  decksCount,
  user,
  onOpenAiModal,
  onOpenSettings,
  onLogout,
  onSwitchAccount,
  soundEnabled,
  onToggleSound,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleNavClick = (view: AppView) => {
    sounds.playRingClick();
    onSelectView(view);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const handleAiClick = () => {
    sounds.playRingClick();
    onOpenAiModal();
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  // Active check helper
  const isVocabularyActive = currentView === 'decks' || currentView === 'deck-detail';

  return (
    <div
      className={`flex flex-col justify-between h-full bg-[#FFFFFF] select-none ${
        isMobileDrawer
          ? 'p-4'
          : 'p-3.5 rounded-3xl border border-[#EAE5DC] shadow-[0_4px_20px_-4px_rgba(72,74,80,0.05)] paper-ruled'
      }`}
    >
      {/* ================= 1. BRAND SECTION (Fixed top) ================= */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]/80 px-1 shrink-0">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* WordRing Logo with subtle hover scale */}
          <div className="relative">
            <img
              src="/assets/wordring-logo.png"
              alt="WordRing Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#1d1c16] tracking-tight">
                WordRing
              </span>
              {/* Cute Kitten Mascot Accent (Soft Stationery Deco) */}
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F5DFE5] border border-[#d6c1c7] text-[10px] shadow-2xs cursor-default"
                title="น้องโมจิ • ผู้ช่วยท่องศัพท์"
              >
                🐱
              </span>
            </div>
            <p className="text-[10px] text-[#74777c] font-['Anuphan',sans-serif] leading-tight font-medium">
              สมุดคำศัพท์ห่วงคู่ใจ
            </p>
          </div>
        </div>

        {/* Close button for Mobile Drawer */}
        {isMobileDrawer && onCloseMobileDrawer && (
          <button
            onClick={() => {
              sounds.playRingClick();
              onCloseMobileDrawer();
            }}
            className="p-1.5 rounded-xl hover:bg-[#FAF9F6] text-[#74777c] hover:text-[#1d1c16] transition-colors"
            title="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ================= 2. MAIN NAVIGATION (Scrollable middle) ================= */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-0.5 min-h-0">
        <nav className="space-y-4 font-['Anuphan',sans-serif]">
          {/* SECTION: HOME */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-bold text-[#8c9096] uppercase tracking-wider">
                Home
              </span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'home'
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {/* Active Indicator Bar */}
                {currentView === 'home' && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <Home className={`w-4 h-4 ${currentView === 'home' ? 'text-[#3d536b]' : 'text-[#74777c]'}`} />
                <div className="flex flex-col text-left">
                  <span>Home Dashboard</span>
                  <span className="text-[10px] font-normal opacity-70">หน้าแรก</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION: LEARNING */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-bold text-[#8c9096] uppercase tracking-wider">
                Learning
              </span>
            </div>
            <div className="space-y-1">
              {/* My Vocabulary */}
              <button
                onClick={() => handleNavClick('decks')}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isVocabularyActive
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {isVocabularyActive && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-4 h-4 ${isVocabularyActive ? 'text-[#3d536b]' : 'text-[#74777c]'}`} />
                  <div className="flex flex-col text-left">
                    <span>My Vocabulary</span>
                    <span className="text-[10px] font-normal opacity-70">คลังคำศัพท์</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                    isVocabularyActive
                      ? 'bg-[#FFFFFF] text-[#3d536b] shadow-2xs'
                      : 'bg-[#EAE5DC] text-[#52606d]'
                  }`}
                >
                  {decksCount}
                </span>
              </button>

              {/* Flashcards */}
              <button
                onClick={() => handleNavClick('flashcards')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'flashcards'
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {currentView === 'flashcards' && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <Layers className={`w-4 h-4 ${currentView === 'flashcards' ? 'text-[#3d536b]' : 'text-[#74777c]'}`} />
                <div className="flex flex-col text-left">
                  <span>Ring Flashcards</span>
                  <span className="text-[10px] font-normal opacity-70">แฟลชการ์ดห่วง</span>
                </div>
              </button>

              {/* Quiz & Review */}
              <button
                onClick={() => handleNavClick('quiz')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'quiz'
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {currentView === 'quiz' && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <Sparkles className={`w-4 h-4 ${currentView === 'quiz' ? 'text-[#e6839b]' : 'text-[#e6839b]/80'}`} />
                <div className="flex flex-col text-left">
                  <span>Review & Quiz</span>
                  <span className="text-[10px] font-normal opacity-70">ทบทวนและควิซ</span>
                </div>
              </button>

              {/* Learning History */}
              <button
                onClick={() => handleNavClick('history')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'history'
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {currentView === 'history' && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <History className={`w-4 h-4 ${currentView === 'history' ? 'text-[#3d536b]' : 'text-[#74777c]'}`} />
                <div className="flex flex-col text-left">
                  <span>Learning History</span>
                  <span className="text-[10px] font-normal opacity-70">ประวัติการเรียนรู้</span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION: TOOLS */}
          <div>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-bold text-[#8c9096] uppercase tracking-wider">
                Tools
              </span>
            </div>
            <div className="space-y-1.5">
              {/* AI Deck Generator (Pastel Pink Highlight) */}
              <button
                onClick={handleAiClick}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 bg-[#F5DFE5]/80 hover:bg-[#F5DFE5] text-[#705961] border border-[#ecd2d8] shadow-2xs hover:shadow-xs active:translate-y-[1px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#FFFFFF]/80 flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#e6839b]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span>AI Deck Generator</span>
                    <span className="text-[10px] font-normal text-[#8c626e]">สร้างชุดคำศัพท์ AI</span>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-[#FFFFFF]/90 text-[9px] font-bold text-[#e6839b] border border-[#ecd2d8]/60 shadow-2xs">
                  ✨ AI
                </span>
              </button>

              {/* Add Folder */}
              <button
                onClick={() => handleNavClick('create-folder')}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  currentView === 'create-folder'
                    ? 'bg-[#DCEBFA] text-[#2b3e52] font-bold shadow-2xs'
                    : 'text-[#484A50] hover:bg-[#FAF9F6] hover:text-[#1d1c16]'
                }`}
              >
                {currentView === 'create-folder' && (
                  <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-[#7d98b0]" />
                )}
                <PlusCircle className={`w-4 h-4 ${currentView === 'create-folder' ? 'text-[#3d536b]' : 'text-[#74777c]'}`} />
                <div className="flex flex-col text-left">
                  <span>Add Folder</span>
                  <span className="text-[10px] font-normal opacity-70">เพิ่มโฟลเดอร์</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Soft Stationery Comfort Quote Box */}
        <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] shadow-2xs flex items-center gap-2.5 font-['Anuphan',sans-serif]">
          <span className="text-base select-none shrink-0">🐾</span>
          <p className="text-[11px] text-[#74777c] leading-tight">
            <span className="font-semibold text-[#52606d]">เจ้าโมจิชวนผ่อนคลาย</span>
            <br />
            ค่อยๆ ท่องทีละคำ สบายใจไปด้วยกันนะ 🌸
          </p>
        </div>
      </div>

      {/* ================= 3. BOTTOM PROFILE SECTION (Fixed bottom) ================= */}
      <div className="pt-2 border-t border-[#EAE5DC] shrink-0">
        <div className="relative" ref={profileMenuRef}>
          {/* Profile Dropdown Popup (opens upwards) */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#FFFFFF] rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-xl p-2 z-50 font-['Anuphan',sans-serif] animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* User Summary Header */}
              <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#EAE5DC]/80 mb-1">
                <p className="text-xs font-bold text-[#1d1c16] truncate">
                  {user?.name || 'ผู้ใช้งาน'}
                </p>
                <p className="text-[10px] text-[#74777c] truncate">
                  {user?.email || 'guest@wordring.app'}
                </p>
                {user?.isGuest && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#DCEBFA] text-[9px] font-semibold text-[#52606d]">
                    โหมดแขก (Guest Mode)
                  </span>
                )}
              </div>

              {/* Sound Effect Toggle */}
              <button
                onClick={() => {
                  sounds.playRingClick();
                  onToggleSound();
                }}
                className="w-full px-2.5 py-2 rounded-xl hover:bg-[#FAF9F6] text-xs font-medium text-[#484A50] text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#52606d]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-[#74777c]" />
                  )}
                  <span>เสียงเอฟเฟกต์</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    soundEnabled
                      ? 'bg-[#DCEBFA] text-[#52606d]'
                      : 'bg-[#EAE5DC] text-[#74777c]'
                  }`}
                >
                  {soundEnabled ? 'เปิด' : 'ปิด'}
                </span>
              </button>

              {/* Settings Action */}
              <button
                onClick={() => {
                  sounds.playRingClick();
                  setIsProfileMenuOpen(false);
                  if (onOpenSettings) {
                    onOpenSettings();
                  } else {
                    alert('ตั้งค่าเสียงและระบบการเรียนรู้ถูกจัดเตรียมไว้อย่างเหมาะสมแล้วในโหมด Soft Stationery 🌸');
                  }
                }}
                className="w-full px-2.5 py-2 rounded-xl hover:bg-[#FAF9F6] text-xs font-medium text-[#484A50] text-left flex items-center gap-2 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#74777c]" />
                <span>ตั้งค่า (Settings)</span>
              </button>

              {/* Switch Account */}
              <button
                onClick={() => {
                  sounds.playRingClick();
                  setIsProfileMenuOpen(false);
                  onSwitchAccount();
                  if (isMobileDrawer && onCloseMobileDrawer) {
                    onCloseMobileDrawer();
                  }
                }}
                className="w-full px-2.5 py-2 rounded-xl hover:bg-[#FAF9F6] text-xs font-medium text-[#484A50] text-left flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#7d98b0]" />
                <span>สลับบัญชี (Switch Account)</span>
              </button>

              {/* Log Out */}
              <button
                onClick={() => {
                  sounds.playRingClick();
                  setIsProfileMenuOpen(false);
                  onLogout();
                  if (isMobileDrawer && onCloseMobileDrawer) {
                    onCloseMobileDrawer();
                  }
                }}
                className="w-full px-2.5 py-2 rounded-xl hover:bg-[#ffdad6]/50 text-xs font-semibold text-[#ba1a1a] text-left flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-[#ba1a1a]" />
                <span>ออกจากระบบ (Log Out)</span>
              </button>
            </div>
          )}

          {/* Profile Trigger Button */}
          <button
            onClick={() => {
              sounds.playRingClick();
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
            className="w-full flex items-center justify-between p-2 rounded-2xl bg-[#FAF9F6] hover:bg-[#EAE5DC]/60 border border-[#EAE5DC] transition-all duration-200 group shadow-2xs font-['Anuphan',sans-serif]"
            title="คลิกเพื่อเปิดเมนูบัญชีผู้ใช้"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Circular Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#F5DFE5] border border-[#d6c1c7] flex items-center justify-center text-[#706065] text-xs font-bold shrink-0 shadow-2xs">
                {user?.name ? user.name.slice(0, 1) : 'U'}
              </div>

              {/* Username & Status */}
              <div className="text-left truncate min-w-0">
                <p className="text-xs font-bold text-[#1d1c16] truncate leading-tight">
                  {user?.name || 'WordRing User'}
                </p>
                <p className="text-[10px] text-[#74777c] truncate">
                  {user?.isGuest ? 'Guest Learner' : 'Member'}
                </p>
              </div>
            </div>

            {/* Dropdown Chevron */}
            <div className="p-1 rounded-lg text-[#74777c] group-hover:text-[#1d1c16] transition-colors shrink-0">
              {isProfileMenuOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
