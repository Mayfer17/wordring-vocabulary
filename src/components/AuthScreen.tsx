import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, BookOpen, Sparkles, Check, ArrowRight, User } from 'lucide-react';
import { UserProfile } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds } from '../utils/audio';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('คุณมิลค์ (Milk)');
  const [email, setEmail] = useState('learner.cozy@wordring.app');
  const [password, setPassword] = useState('wordring2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playStamp();
    sounds.playSuccessChime();
    onLoginSuccess({
      name: isRegister ? (name.trim() || 'เพื่อนนักเรียน') : 'คุณมิลค์ (Milk)',
      email: email.trim(),
      isGuest: false,
    });
  };

  const handleGuestLogin = () => {
    sounds.playRingClick();
    onLoginSuccess({
      name: 'นักเรียนโหมดแขก (Guest)',
      email: 'guest@wordring.app',
      isGuest: true,
    });
  };

  const handleGoogleLogin = () => {
    sounds.playStamp();
    sounds.playSuccessChime();
    onLoginSuccess({
      name: 'คุณมิลค์ (Google Account)',
      email: 'maytawee.google@gmail.com',
      isGuest: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col justify-between antialiased selection:bg-[#DCEBFA] selection:text-[#1d1c16]">
      {/* Top Bar matching Image 1 */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#EAE5DC]/60 bg-[#FFFFFF]/70 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <img
            src="/assets/wordring-logo.png"
            alt="WordRing Logo"
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-2xs"
          />
          <div className="text-xs font-medium text-[#484A50] hidden sm:block border-l border-[#EAE5DC] pl-3">
            <span className="text-[#74777c]">A little space for every new word • สมุดคำศัพท์ห่วงคู่ใจ</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE5DC]/70 text-[11px] font-medium text-[#484A50]">
            <Sparkles className="w-3 h-3 text-[#7d98b0]" />
            โหมดการเรียนรู้แบบผ่อนคลาย
          </span>
          <button className="px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[11px] font-semibold text-[#484A50] hover:bg-[#EAE5DC] transition-colors">
            ไทย / EN
          </button>
        </div>
      </header>

      {/* Main Dual-Column Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Cozy Visual Card with Mascot */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#EAE5DC]/40 rounded-3xl p-6 sm:p-8 border border-[#484A50]/10 min-h-[520px]">
            {/* Top Tag Pills */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#DCEBFA] text-[#52606d] text-[11px] font-bold tracking-wide">
                #GENTLE_STUDY
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F5DFE5] text-[#706065] text-[11px] font-bold tracking-wide">
                DAILY VOCAB
              </span>
            </div>

            {/* Faux Flashcard preview with metal rings */}
            <div className="relative my-6 mx-auto w-full max-w-sm">
              <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#EAE5DC] shadow-[0_4px_16px_rgba(72,74,80,0.06)] relative overflow-hidden paper-ruled">
                {/* Binder rings on the side */}
                <div className="absolute left-2.5 top-6 flex flex-col gap-10 z-10 pointer-events-none">
                  <div className="w-4 h-7 rounded-full metallic-ring border border-[#A8BDD2] shadow-xs" />
                  <div className="w-4 h-7 rounded-full metallic-ring border border-[#A8BDD2] shadow-xs" />
                </div>

                <div className="pl-6">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#74777c] pb-2 border-b border-dashed border-[#484A50]/15">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#52606d]" />
                      สมุดห่วงบทเรียนประจำวัน
                    </span>
                    <span className="bg-[#DCEBFA] text-[#52606d] px-2 py-0.5 rounded-full">
                      3 / 20 คำในห่วง
                    </span>
                  </div>

                  <div className="py-5 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#7d98b0] tracking-widest">
                      English Vocabulary
                    </span>
                    <h3 className="text-2xl font-bold text-[#1d1c16] mt-0.5">Serendipity</h3>
                    <p className="text-xs text-[#74777c] mt-0.5">/ˌser.ənˈdɪp.ə.ti/ • Noun</p>
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE5DC] text-xs font-['Anuphan',sans-serif] text-[#1d1c16] shadow-2xs">
                      การพบเจอสิ่งดีๆ หรือความสุขโดยบังเอิญ 💡
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mascot Quote Banner */}
            <div className="flex items-center gap-4 bg-[#FFFFFF]/90 rounded-2xl p-3.5 border border-[#EAE5DC] shadow-xs">
              <div className="flex -space-x-2 shrink-0">
                <Mascot type="kitten" size="sm" />
                <Mascot type="cloud" size="sm" />
              </div>
              <div className="text-xs text-[#484A50] font-['Anuphan',sans-serif]">
                <p className="font-semibold text-[#1d1c16] leading-tight">
                  "ท่องศัพท์ทีละคำ ไม่ต้องรีบ ค่อยๆ เติบโตไปพร้อมกับสมุดคำศัพท์ห่วงของคุณ"
                </p>
                <p className="text-[10px] text-[#74777c] mt-0.5">
                  • น้องคลาวดี้ & เจ้าโมจิ • ผู้ช่วยท่องศัพท์
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Student Desk Login / Register Card */}
          <div className="lg:col-span-6 relative">
            {/* Student Desk Top Ribbon Tag */}
            <div className="absolute -top-3.5 right-6 z-20 bg-[#DCEBFA] border border-[#A8BDD2] px-3 py-1 rounded-full text-[10px] font-bold text-[#52606d] uppercase tracking-wider shadow-2xs">
              STUDENT DESK
            </div>

            <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#EAE5DC] shadow-[0_8px_30px_rgba(72,74,80,0.06)] relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#1d1c16] font-['Anuphan',sans-serif]">
                    {isRegister ? 'สร้างบัญชีสมุดห่วง' : 'ยินดีต้อนรับกลับมา'}
                  </h2>
                  <p className="text-xs text-[#74777c] mt-1 font-['Anuphan',sans-serif]">
                    {isRegister
                      ? 'เริ่มต้นสะสมคำศัพท์และบันทึกความทรงจำไปด้วยกันนะ'
                      : 'เปิดสมุดห่วงแล้วมาทบทวนศัพท์ใหม่ด้วยกันนะ'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] flex items-center justify-center text-[#52606d] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Mode Toggle Tabs (Log In vs Register) */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#EAE5DC]/60 mt-5 border border-[#484A50]/10">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playRingClick();
                    setIsRegister(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    !isRegister
                      ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-xs'
                      : 'text-[#484A50] hover:text-[#1d1c16]'
                  }`}
                >
                  ➜] เข้าสู่ระบบ (Log In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playRingClick();
                    setIsRegister(true);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isRegister
                      ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-xs'
                      : 'text-[#484A50] hover:text-[#1d1c16]'
                  }`}
                >
                  + สร้างบัญชีใหม่ (Register)
                </button>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                {isRegister && (
                  <div>
                    <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                      ชื่อที่ให้เรียกในสมุด (Display Name)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="เช่น คุณมิลค์ (Milk)"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                    อีเมล (Email address)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="learner.cozy@wordring.app"
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
                    />
                    <Check className="w-4 h-4 text-[#7d98b0] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-[#484A50] font-['Anuphan',sans-serif]">
                      รหัสผ่าน (Password)
                    </label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => alert('คำใบ้รหัสผ่าน: รหัสผ่านเดโมถูกกรอกไว้แล้ว กดเข้าสู่ระบบได้ทันทีเลย!')}
                        className="text-[10px] text-[#74777c] hover:text-[#52606d] underline font-['Anuphan',sans-serif]"
                      >
                        ลืมรหัสผ่าน? (Forgot Password?)
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#74777c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#74777c] hover:text-[#1d1c16]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#52606d] border-[#EAE5DC] focus:ring-[#A8BDD2] cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[#484A50] cursor-pointer select-none font-['Anuphan',sans-serif]">
                    จดจำฉันไว้ในอุปกรณ์นี้ (Remember me)
                  </label>
                </div>

                {/* Main Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-all shadow-xs flex items-center justify-center gap-2 font-['Anuphan',sans-serif]"
                >
                  <span>{isRegister ? 'สมัครสมาชิก WordRing' : 'เข้าสู่ระบบ WordRing'}</span>
                  <ArrowRight className="w-4 h-4 text-[#52606d]" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#EAE5DC]" />
                </div>
                <span className="relative bg-[#FFFFFF] px-3 text-[11px] text-[#74777c]">
                  หรือดำเนินการต่อด้วย (or continue with)
                </span>
              </div>

              {/* 3rd Party & Guest Mode Buttons */}
              <div className="space-y-2">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-medium text-[#1d1c16] transition-all shadow-2xs flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-['Anuphan',sans-serif]">เข้าสู่ระบบด้วย Google (Sign in with Google)</span>
                </button>

                {/* Try Guest Mode */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EAE5DC]/80 hover:bg-[#EAE5DC] active:translate-y-[1px] text-xs font-semibold text-[#484A50] transition-all flex items-center justify-center gap-2 font-['Anuphan',sans-serif]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#52606d]" />
                  <span>ทดลองใช้โหมดแขกก่อน (Try Guest Mode without account)</span>
                </button>
              </div>

              {/* Privacy Footer */}
              <p className="mt-4 text-[10px] text-[#74777c] text-center leading-relaxed font-['Anuphan',sans-serif]">
                โดยการเข้าสู่ระบบ คุณยอมรับ <span className="underline hover:text-[#1d1c16] cursor-pointer">เงื่อนไขการใช้งาน</span> และ <span className="underline hover:text-[#1d1c16] cursor-pointer">นโยบายความเป็นส่วนตัว</span> ของ WordRing
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-[11px] text-[#74777c] border-t border-[#EAE5DC]/60 bg-[#FAF9F6]">
        WordRing Stationery Studio © 2025 • Handcrafted for stress-free language learners • Bangkok & Global
      </footer>
    </div>
  );
};
