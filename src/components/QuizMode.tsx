import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Volume2, ArrowLeft, X, Check, RotateCcw, Shuffle } from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds, speakWord } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuizModeProps {
  deck: Deck;
  allUserCards?: Flashcard[];
  onExitQuiz: () => void;
  onUpdateCardStatus?: (cardId: string, status: Flashcard['status']) => void;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  deck,
  allUserCards,
  onExitQuiz,
  onUpdateCardStatus,
}) => {
  const [inputStyle, setInputStyle] = useState<'choice' | 'write'>('choice');
  const [questionLimit, setQuestionLimit] = useState<'all' | 5 | 10 | 20>('all');

  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const initialCardsRef = useRef<Flashcard[]>(deck.cards || []);

  useEffect(() => {
    initialCardsRef.current = deck.cards || [];
  }, [deck.id]);

  const startNewQuizRound = useCallback((limit: 'all' | 5 | 10 | 20) => {
    const userCards = initialCardsRef.current.length > 0 ? [...initialCardsRef.current] : [];
    const randomized = shuffleArray(userCards);
    const sliced = limit === 'all' ? randomized : randomized.slice(0, limit);

    setShuffledCards(sliced);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsQuizComplete(false);
  }, []);

  useEffect(() => {
    startNewQuizRound(questionLimit);
  }, [deck.id, questionLimit, startNewQuizRound]);

  const currentCard = shuffledCards[currentIndex];
  const totalQuestions = shuffledCards.length;
  const totalDeckCards = initialCardsRef.current.length;

  const options = useMemo(() => {
    if (!currentCard) return [];
    const correctMeaning = currentCard.thai;
    const sameDeckMeanings = initialCardsRef.current.filter((c) => c.id !== currentCard.id).map((c) => c.thai);
    const otherUserMeanings = (allUserCards || []).filter((c) => c.id !== currentCard.id && c.thai !== correctMeaning).map((c) => c.thai);
    const fallbackDistractors = ['ความสุข, ความยินดีอย่างยิ่ง', 'ความผิดหวัง, ความเสียดาย', 'ความเหนื่อยล้า, ความอ่อนเพลีย', 'ความกังวล, ความหม่นหมอง', 'ความเงียบสงบ, ความสันโดษ', 'ความหวัง, กำลังใจอันอบอุ่น'];
    const uniquePool = Array.from(new Set([...sameDeckMeanings, ...otherUserMeanings, ...fallbackDistractors])).filter((m) => m !== correctMeaning);
    const chosenDistractors = shuffleArray(uniquePool).slice(0, 3);
    return shuffleArray([correctMeaning, ...chosenDistractors]);
  }, [currentCard, allUserCards]);

  const handlePronounce = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentCard) return;
    sounds.playRingClick();
    speakWord(currentCard.english, 'en');
  };

  const handleSubmit = (chosenValue?: string) => {
    if (isSubmitted || !currentCard) return;
    let userAns = '';
    if (inputStyle === 'choice') {
      const val = chosenValue || selectedOption;
      if (!val) return;
      userAns = val;
    } else {
      if (!typedAnswer.trim()) return;
      userAns = typedAnswer.trim();
    }

    let correct = false;
    if (inputStyle === 'choice') {
      correct = userAns === currentCard.thai;
    } else {
      const cleanUser = userAns.toLowerCase().replace(/[,\s]/g, '');
      const cleanTarget = currentCard.thai.toLowerCase().replace(/[,\s]/g, '');
      correct = cleanTarget.includes(cleanUser) || cleanUser.includes(cleanTarget.slice(0, 4)) || currentCard.thai.split(/[,/]/).some((part) => cleanUser.includes(part.trim().toLowerCase()));
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 1);
      sounds.playSuccessChime();
      confetti({ particleCount: 36, spread: 55, origin: { y: 0.72 }, colors: ['#22c55e', '#86efac', '#DCEBFA', '#F5DFE5'], ticks: 130 });
      onUpdateCardStatus?.(currentCard.id, 'mastered');
    } else {
      sounds.playRingClick();
      onUpdateCardStatus?.(currentCard.id, 'learning');
    }
  };

  const handleContinue = () => {
    sounds.playPaperFlip();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      setIsQuizComplete(true);
      sounds.playSuccessChime();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#86efac', '#DCEBFA', '#F5DFE5'] });
    }
  };

  const handleRestart = () => {
    sounds.playRingClick();
    startNewQuizRound(questionLimit);
  };

  if (!shuffledCards.length) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 bg-[#FFFFFF] rounded-3xl p-8 border border-[#EAE5DC] text-center shadow-xs">
        <p className="text-sm text-[#74777c] font-['Anuphan',sans-serif]">ยังไม่มีคำศัพท์ในโฟลเดอร์นี้เพื่อทำแบบฝึกหัด</p>
        <button onClick={onExitQuiz} className="mt-4 px-4 py-2 rounded-xl bg-[#DCEBFA] text-xs font-semibold text-[#1d1c16] border border-[#A8BDD2]">กลับสู่หน้าหลัก</button>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 bg-[#FFFFFF] rounded-3xl border-[1.5px] border-[#EAE5DC] p-6 sm:p-10 shadow-[0_8px_30px_rgba(72,74,80,0.06)] paper-ruled text-center select-none">
        <div className="flex items-center justify-center gap-10 -mt-2 mb-4 pointer-events-none">
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/60 shadow-xs" />
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/60 shadow-xs" />
        </div>
        <div className="my-4 flex justify-center">
          <Mascot type="kitten" size="lg" messageThai="ยอดเยี่ยมมาก! วันนี้ทบทวนคำศัพท์จบแล้วนะ" messageEng="Practice complete! Be proud of your gentle progress." />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1c16] mt-4 font-['Nunito_Sans',sans-serif]">Vocabulary Practice Complete!</h2>
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-800 text-xs font-bold font-['Anuphan',sans-serif]">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>ตอบถูก {score} จาก {totalQuestions} ข้อ ({Math.round((score / totalQuestions) * 100)}%)</span>
        </div>
        <p className="text-xs text-[#74777c] mt-2 font-['Anuphan',sans-serif] max-w-md mx-auto leading-relaxed">ขอบคุณที่ตั้งใจเปิดสมุดห่วงมาเรียนรู้ด้วยกันนะ การเรียนรู้แบบค่อยเป็นค่อยไปจะทำให้เราจำคำศัพท์ได้อย่างเป็นธรรมชาติและยาวนานที่สุด 🌸</p>
        <div className="my-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-[#52606d] mb-2 font-['Anuphan',sans-serif]">
            <span>คำศัพท์ที่สุ่มฝึกฝนในรอบนี้ ({deck.title})</span>
            <span>{totalQuestions} คำ</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shuffledCards.map((c) => (
              <span key={c.id} className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAE5DC] text-xs font-medium text-[#484A50]">
                {c.english} <span className="text-[#74777c] text-[10px] font-['Anuphan',sans-serif]">({c.thai.split(',')[0]})</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button onClick={handleRestart} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#EAE5DC]/80 hover:bg-[#EAE5DC] active:translate-y-[1px] text-xs font-bold text-[#484A50] transition-colors">
            <RotateCcw className="w-4 h-4" />
            <span className="font-['Anuphan',sans-serif]">สุ่มฝึกฝนอีกครั้ง (Practice Again)</span>
          </button>
          <button onClick={onExitQuiz} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-7 rounded-2xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] shadow-xs transition-colors">
            <span className="font-['Anuphan',sans-serif]">กลับสู่สมุดห่วง (Back to Binder)</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 sm:my-8 px-3 sm:px-4 select-none">
      <div className="w-full bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#EAE5DC] shadow-[0_2px_10px_rgba(72,74,80,0.04)] mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { sounds.playRingClick(); onExitQuiz(); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#EAE5DC] text-xs font-semibold text-[#484A50] border border-[#EAE5DC] transition-colors shadow-2xs">
            <ArrowLeft className="w-3.5 h-3.5 text-[#52606d]" />
            <span className="hidden sm:inline font-['Anuphan',sans-serif]">ย้อนกลับ</span>
          </button>
          <div className="text-center">
            <h1 className="text-sm sm:text-base font-bold text-[#1d1c16] tracking-tight">{deck.title}</h1>
            <p className="text-[11px] text-[#74777c] font-medium mt-0.5 font-['Anuphan',sans-serif]">ข้อที่ {currentIndex + 1} / {totalQuestions} • ถูก {score} ข้อ</p>
          </div>
          <button onClick={() => { sounds.playRingClick(); onExitQuiz(); }} className="p-1.5 rounded-xl hover:bg-[#EAE5DC] text-[#74777c] hover:text-[#1d1c16] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {totalDeckCards > 5 && (
          <div className="flex items-center justify-between gap-2 pt-2.5 pb-3 border-t border-[#EAE5DC]/70 text-[11px] font-['Anuphan',sans-serif]">
            <span className="inline-flex items-center gap-1 text-[#52606d] font-semibold">
              <Shuffle className="w-3 h-3 text-[#7d98b0]" />
              สุ่มจากทั้งหมด {totalDeckCards} คำ:
            </span>
            <div className="flex items-center gap-1">
              {(['all', 5, 10, 20] as const).filter((opt) => opt === 'all' || opt < totalDeckCards).map((opt) => (
                <button key={String(opt)} type="button" onClick={() => { sounds.playRingClick(); setQuestionLimit(opt); }} className={`px-2.5 py-0.5 rounded-lg font-semibold transition-colors ${questionLimit === opt ? 'bg-[#DCEBFA] text-[#1d1c16] border border-[#A8BDD2]' : 'bg-[#FAF9F6] text-[#74777c] hover:text-[#1d1c16] border border-[#EAE5DC]'}`}>
                  {opt === 'all' ? 'ทั้งหมด' : `${opt} ข้อ`}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-[#7d98b0] rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.max(8, progressPercent)}%` }} />
        </div>
      </div>

      <div className={`relative bg-[#FFFFFF] rounded-3xl border-2 transition-colors duration-300 shadow-[0_6px_24px_rgba(72,74,80,0.06)] p-6 sm:p-8 paper-ruled overflow-hidden mb-5 sm:mb-6 ${isSubmitted ? (isCorrect ? 'border-emerald-500 shadow-[0_6px_24px_rgba(34,197,94,0.14)]' : 'border-red-500 shadow-[0_6px_24px_rgba(239,68,68,0.14)]') : 'border-[#EAE5DC]'}`}>
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-14 z-20 pointer-events-none">
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/70 shadow-xs" />
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/70 shadow-xs" />
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#484A50]/15 mb-6">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full transition-colors ${isSubmitted ? (isCorrect ? 'bg-emerald-500' : 'bg-red-500') : 'bg-[#7d98b0]'}`} />
            <span className="text-xs font-semibold text-[#52606d] font-['Anuphan',sans-serif]">คำถามข้อที่ {currentIndex + 1}</span>
          </div>
          <div className="flex items-center bg-[#FAF9F6] p-1 rounded-xl border border-[#EAE5DC]">
            <button onClick={() => { if (!isSubmitted) { sounds.playRingClick(); setInputStyle('choice'); } }} className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${inputStyle === 'choice' ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-2xs' : 'text-[#74777c] hover:text-[#1d1c16]'}`}>Multiple Choice</button>
            <button onClick={() => { if (!isSubmitted) { sounds.playRingClick(); setInputStyle('write'); } }} className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${inputStyle === 'write' ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-2xs' : 'text-[#74777c] hover:text-[#1d1c16]'}`}>Write Meaning</button>
          </div>
        </div>
        <div className="text-center py-2 sm:py-4">
          <span className="text-xs font-semibold text-[#74777c] uppercase tracking-wider">English Vocabulary</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1d1c16] tracking-tight mt-1 mb-2 font-['Nunito_Sans',sans-serif]">{currentCard?.english}</h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button onClick={handlePronounce} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] hover:bg-[#DCEBFA] border border-[#EAE5DC] text-[#484A50] text-xs font-medium transition-colors shadow-2xs active:translate-y-[1px]">
              <Volume2 className="w-3.5 h-3.5 text-[#52606d]" />
              <span className="font-mono text-xs">{currentCard?.ipa || currentCard?.phonetic}</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[#DCEBFA]/70 text-[#52606d] text-xs font-semibold border border-[#A8BDD2]/40">{currentCard?.partOfSpeech || 'Word'}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#484A50] mt-6 pt-3 border-t border-[#EAE5DC]/80 font-['Nunito_Sans',sans-serif]">What is the meaning of this word?</p>
        </div>
      </div>

      {inputStyle === 'choice' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentCard.thai;

            let cardStyle = 'bg-[#FFFFFF] border-[#EAE5DC] hover:border-[#A8BDD2] hover:bg-[#FAF9F6] text-[#1d1c16]';
            let badgeStyle = 'bg-[#EAE5DC]/60 text-[#484A50]';

            if (isSubmitted) {
              if (isSelected) {
                // ขึ้นสีเขียวหรือแดงเฉพาะข้อที่กดเลือกเท่านั้น
                if (isCorrectOption) {
                  cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-500/20';
                  badgeStyle = 'bg-emerald-500 text-white';
                } else {
                  cardStyle = 'bg-red-50 border-red-500 text-red-950 font-bold shadow-sm ring-2 ring-red-500/20';
                  badgeStyle = 'bg-red-500 text-white';
                }
              } else {
                // ข้อที่ไม่ได้เลือกจะทำทึบ ไม่แสดงเฉลย
                cardStyle = 'bg-[#FAF9F6] border-[#EAE5DC] text-[#74777c] opacity-45';
              }
            } else if (isSelected) {
              cardStyle = 'bg-[#DCEBFA] border-[#7d98b0] text-[#0f1d28] font-bold shadow-xs';
              badgeStyle = 'bg-[#7d98b0] text-white';
            }

            return (
              <button key={idx} type="button" disabled={isSubmitted} onClick={() => { sounds.playRingClick(); setSelectedOption(option); handleSubmit(option); }} className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center justify-between gap-3 active:translate-y-[1px] shadow-2xs ${cardStyle}`}>
                <div className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${badgeStyle}`}>{letter}</span>
                  <span className="text-sm sm:text-base font-medium font-['Anuphan',sans-serif] leading-snug">{option}</span>
                </div>
                {isSubmitted && isSelected && isCorrectOption && <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs"><Check className="w-3.5 h-3.5 stroke-[3]" /></span>}
                {isSubmitted && isSelected && !isCorrectOption && <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-2xs"><X className="w-3.5 h-3.5 stroke-[3]" /></span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={`rounded-2xl border-2 p-5 shadow-2xs mb-5 transition-colors duration-200 ${isSubmitted ? (isCorrect ? 'bg-emerald-50/80 border-emerald-500' : 'bg-red-50/80 border-red-500') : 'bg-[#FFFFFF] border-[#EAE5DC]'}`}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#484A50] font-['Anuphan',sans-serif]">พิมพ์ความหมายภาษาไทย (Type Thai Meaning)</label>
              {isSubmitted && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-['Anuphan',sans-serif] ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isCorrect ? <><Check className="w-3 h-3 stroke-[3]" /> ถูกต้อง!</> : <><X className="w-3 h-3 stroke-[3]" /> ผิด!</>}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input type="text" disabled={isSubmitted} value={typedAnswer} onChange={(e) => setTypedAnswer(e.target.value)} placeholder="Type the Thai meaning here..." className={`w-full px-4 py-3 pr-10 rounded-xl border-2 text-sm focus:outline-none font-['Anuphan',sans-serif] transition-colors ${isSubmitted ? (isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' : 'bg-red-50 border-red-500 text-red-950 font-bold') : 'bg-[#FAF9F6] border-[#EAE5DC] focus:border-[#A8BDD2] text-[#1d1c16]'}`} autoFocus />
                {isSubmitted && <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>{isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}</span>}
              </div>
              {!isSubmitted && (
                <button type="submit" disabled={!typedAnswer.trim()} className="px-5 py-3 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] transition-all shadow-2xs disabled:opacity-40 font-['Anuphan',sans-serif]">
                  Submit Answer
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {isSubmitted && (
        <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-sm ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-950' : 'bg-red-50 border-red-500 text-red-950'}`}>
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <Mascot type={isCorrect ? 'kitten' : 'cloud'} size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-['Anuphan',sans-serif] ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isCorrect ? <><Check className="w-3 h-3 stroke-[3]" /> ถูกต้อง (Correct)</> : <><X className="w-3 h-3 stroke-[3]" /> ผิด (Incorrect)</>}
                </span>
                <h3 className="text-sm font-bold leading-tight font-['Nunito_Sans',sans-serif]">{isCorrect ? 'Wonderful! You got it right! 🎉' : "Not quite! Let's try again next time. 💪"}</h3>
              </div>
              {/* ซ่อนคำเฉลยเมื่อตอบผิด */}
              {isCorrect ? (
                <>
                  <p className="text-xs mt-1.5 font-['Anuphan',sans-serif] text-[#484A50]">ความหมายที่ถูกต้อง: <span className="font-bold text-[#1d1c16]">{currentCard.thai}</span></p>
                  {currentCard.exampleEnglish && <p className="text-[11px] text-[#52606d] mt-0.5 italic">"{currentCard.exampleEnglish}"</p>}
                </>
              ) : (
                <p className="text-xs mt-1.5 font-['Anuphan',sans-serif] text-[#484A50]">ยังไม่ถูกต้อง ลองพยายามจำคำนี้ใหม่อีกครั้งนะ</p>
              )}
            </div>
          </div>
          <button onClick={handleContinue} className={`w-full sm:w-auto px-6 py-2.5 rounded-xl active:translate-y-[1px] text-xs font-bold transition-all shadow-xs shrink-0 text-white border ${isCorrect ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-700' : 'bg-red-600 hover:bg-red-700 border-red-700'}`}>
            Continue ➔
          </button>
        </div>
      )}
    </div>
  );
};