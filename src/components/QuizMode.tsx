import React, { useState, useMemo, useEffect } from 'react';
import { Volume2, ArrowLeft, X, Sparkles, Check, RotateCcw, Heart } from 'lucide-react';
import { Deck, Flashcard } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds, speakWord } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuizModeProps {
  deck: Deck;
  onExitQuiz: () => void;
  onUpdateCardStatus?: (cardId: string, status: Flashcard['status']) => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  deck,
  onExitQuiz,
  onUpdateCardStatus,
}) => {
  // Interaction style: Multiple Choice vs Write Meaning
  const [inputStyle, setInputStyle] = useState<'choice' | 'write'>('choice');

  // Question cards randomized
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User input states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Initialize and randomize cards
  useEffect(() => {
    const list = deck.cards && deck.cards.length > 0 ? [...deck.cards] : [];
    // Shuffle
    const randomized = list.sort(() => 0.5 - Math.random());
    setShuffledCards(randomized);
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsQuizComplete(false);
  }, [deck]);

  const currentCard = shuffledCards[currentIndex];
  const totalQuestions = shuffledCards.length;

  // Generate 4 randomized options for multiple choice
  const options = useMemo(() => {
    if (!currentCard) return [];
    const correctMeaning = currentCard.thai;

    // Distractors from other cards in this deck or fallback stationery vocabulary
    const otherMeanings = shuffledCards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.thai);

    const fallbackDistractors = [
      'ความสุข, ความยินดีอย่างยิ่ง',
      'ความผิดหวัง, ความเสียดาย',
      'ความเหนื่อยล้า, ความอ่อนเพลีย',
      'ความกังวล, ความหม่นหมอง',
      'ความเงียบสงบ, ความสันโดษ',
      'ความหวัง, กำลังใจอันอบอุ่น',
      'ความรักความผูกพันในครอบครัว',
    ].filter((item) => item !== correctMeaning);

    const pool = otherMeanings.length >= 3 ? otherMeanings : [...otherMeanings, ...fallbackDistractors];
    const uniquePool = Array.from(new Set(pool)).filter((m) => m !== correctMeaning);
    const chosenDistractors = uniquePool.sort(() => 0.5 - Math.random()).slice(0, 3);

    const choices = [correctMeaning, ...chosenDistractors];
    return choices.sort(() => 0.5 - Math.random());
  }, [currentCard, shuffledCards]);

  // Audio pronunciation helper
  const handlePronounce = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentCard) return;
    sounds.playRingClick();
    speakWord(currentCard.english, 'en');
  };

  // Submit Answer (Choice or Write)
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

    // Check correctness:
    // For choice: exact match
    // For write: check if user typed substring or keywords in Thai meaning
    let correct = false;
    if (inputStyle === 'choice') {
      correct = userAns === currentCard.thai;
    } else {
      const cleanUser = userAns.toLowerCase().replace(/[,\s]/g, '');
      const cleanTarget = currentCard.thai.toLowerCase().replace(/[,\s]/g, '');
      correct =
        cleanTarget.includes(cleanUser) ||
        cleanUser.includes(cleanTarget.slice(0, 4)) ||
        currentCard.thai.split(/[,/]/).some((part) => cleanUser.includes(part.trim().toLowerCase()));
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      sounds.playSuccessChime();
      confetti({
        particleCount: 28,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#DCEBFA', '#F5DFE5', '#A8BDD2', '#d1edd8'],
        ticks: 120,
      });
      onUpdateCardStatus?.(currentCard.id, 'mastered');
    } else {
      sounds.playRingClick();
      onUpdateCardStatus?.(currentCard.id, 'learning');
    }
  };

  // Continue to next question
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
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DCEBFA', '#F5DFE5', '#A8BDD2', '#e1ece3'],
      });
    }
  };

  // Restart quiz
  const handleRestart = () => {
    sounds.playRingClick();
    const randomized = [...shuffledCards].sort(() => 0.5 - Math.random());
    setShuffledCards(randomized);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsQuizComplete(false);
  };

  if (!shuffledCards.length) {
    return (
      <div className="w-full max-w-xl mx-auto my-12 bg-[#FFFFFF] rounded-3xl p-8 border border-[#EAE5DC] text-center shadow-xs">
        <p className="text-sm text-[#74777c] font-['Anuphan',sans-serif]">
          ยังไม่มีคำศัพท์ในโฟลเดอร์นี้เพื่อทำแบบฝึกหัด
        </p>
        <button
          onClick={onExitQuiz}
          className="mt-4 px-4 py-2 rounded-xl bg-[#DCEBFA] text-xs font-semibold text-[#1d1c16] border border-[#A8BDD2]"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  // ================= COMPLETION SCREEN (RELAXING STATIONERY NOTEBOOK FINALE) =================
  if (isQuizComplete) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 bg-[#FFFFFF] rounded-3xl border-[1.5px] border-[#EAE5DC] p-6 sm:p-10 shadow-[0_8px_30px_rgba(72,74,80,0.06)] paper-ruled text-center select-none">
        {/* Top Ring loops */}
        <div className="flex items-center justify-center gap-10 -mt-2 mb-4 pointer-events-none">
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/60 shadow-xs" />
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/60 shadow-xs" />
        </div>

        {/* Mascot Center Celebration */}
        <div className="my-4 flex justify-center">
          <Mascot
            type="kitten"
            size="lg"
            messageThai="ยอดเยี่ยมมาก! วันนี้ทบทวนคำศัพท์จบแล้วนะ"
            messageEng="Practice complete! Be proud of your gentle progress."
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1c16] mt-4 font-['Nunito_Sans',sans-serif]">
          Vocabulary Practice Complete!
        </h2>
        <p className="text-xs text-[#74777c] mt-1.5 font-['Anuphan',sans-serif] max-w-md mx-auto leading-relaxed">
          ขอบคุณที่ตั้งใจเปิดสมุดห่วงมาเรียนรู้ด้วยกันนะ การเรียนรู้แบบค่อยเป็นค่อยไปจะทำให้เราจำคำศัพท์ได้อย่างเป็นธรรมชาติและยาวนานที่สุด 🌸
        </p>

        {/* Word recap list chip stack */}
        <div className="my-6 p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DC] text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-[#52606d] mb-2 font-['Anuphan',sans-serif]">
            <span>คำศัพท์ที่ได้ฝึกฝนในรอบนี้</span>
            <span>{totalQuestions} คำ</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shuffledCards.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#EAE5DC] text-xs font-medium text-[#484A50]"
              >
                {c.english} <span className="text-[#74777c] text-[10px] font-['Anuphan',sans-serif]">({c.thai.split(',')[0]})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#EAE5DC]/80 hover:bg-[#EAE5DC] active:translate-y-[1px] text-xs font-bold text-[#484A50] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-['Anuphan',sans-serif]">ฝึกฝนอีกครั้ง (Practice Again)</span>
          </button>

          <button
            onClick={onExitQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-7 rounded-2xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] shadow-xs transition-colors"
          >
            <span className="font-['Anuphan',sans-serif]">กลับสู่สมุดห่วง (Back to Binder)</span>
          </button>
        </div>
      </div>
    );
  }

  // Progress percentage calculation
  const progressPercent = Math.round(((currentIndex) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 sm:my-8 px-3 sm:px-4 select-none">
      {/* ================= 2. TOP SECTION ================= */}
      <div className="w-full bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#EAE5DC] shadow-[0_2px_10px_rgba(72,74,80,0.04)] mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-3">
          {/* Back Button */}
          <button
            onClick={() => {
              sounds.playRingClick();
              onExitQuiz();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#EAE5DC] text-xs font-semibold text-[#484A50] border border-[#EAE5DC] transition-colors shadow-2xs"
            title="Back to Decks"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#52606d]" />
            <span className="hidden sm:inline font-['Anuphan',sans-serif]">ย้อนกลับ</span>
          </button>

          {/* Title & Counter */}
          <div className="text-center">
            <h1 className="text-sm sm:text-base font-bold text-[#1d1c16] tracking-tight">
              Vocabulary Practice
            </h1>
            <p className="text-[11px] text-[#74777c] font-medium mt-0.5">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>

          {/* Exit Quiz Button */}
          <button
            onClick={() => {
              sounds.playRingClick();
              onExitQuiz();
            }}
            className="p-1.5 rounded-xl hover:bg-[#EAE5DC] text-[#74777c] hover:text-[#1d1c16] transition-colors"
            title="Exit Quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thin Progress Bar */}
        <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7d98b0] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* ================= 2. MAIN QUESTION CARD ================= */}
      <div className="relative bg-[#FFFFFF] rounded-3xl border-[1.5px] border-[#EAE5DC] shadow-[0_6px_24px_rgba(72,74,80,0.06)] p-6 sm:p-8 paper-ruled overflow-hidden mb-5 sm:mb-6">
        {/* Binder Metallic Rings & Punch Holes */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-14 z-20 pointer-events-none">
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/70 shadow-xs" />
          <div className="w-4 h-8 rounded-full metallic-ring border border-[#A8BDD2]/70 shadow-xs" />
        </div>

        {/* Style Selector Tabs (Multiple Choice vs Write Meaning) */}
        <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#484A50]/15 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7d98b0]" />
            <span className="text-xs font-semibold text-[#52606d] font-['Anuphan',sans-serif]">
              คำถามข้อที่ {currentIndex + 1}
            </span>
          </div>

          <div className="flex items-center bg-[#FAF9F6] p-1 rounded-xl border border-[#EAE5DC]">
            <button
              onClick={() => {
                if (!isSubmitted) {
                  sounds.playRingClick();
                  setInputStyle('choice');
                }
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                inputStyle === 'choice'
                  ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-2xs'
                  : 'text-[#74777c] hover:text-[#1d1c16]'
              }`}
            >
              Multiple Choice
            </button>
            <button
              onClick={() => {
                if (!isSubmitted) {
                  sounds.playRingClick();
                  setInputStyle('write');
                }
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                inputStyle === 'write'
                  ? 'bg-[#FFFFFF] text-[#1d1c16] shadow-2xs'
                  : 'text-[#74777c] hover:text-[#1d1c16]'
              }`}
            >
              Write Meaning
            </button>
          </div>
        </div>

        {/* Center: Prominent English Vocabulary Word */}
        <div className="text-center py-2 sm:py-4">
          <span className="text-xs font-semibold text-[#74777c] uppercase tracking-wider">
            English Vocabulary
          </span>

          {/* Prominent Word */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1d1c16] tracking-tight mt-1 mb-2 font-['Nunito_Sans',sans-serif]">
            {currentCard?.english}
          </h2>

          {/* Pronunciation IPA & Part of Speech & Speaker Audio */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={handlePronounce}
              title="Click to hear pronunciation"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] hover:bg-[#DCEBFA] border border-[#EAE5DC] text-[#484A50] text-xs font-medium transition-colors shadow-2xs active:translate-y-[1px]"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#52606d]" />
              <span className="font-mono text-xs">{currentCard?.ipa || currentCard?.phonetic}</span>
            </button>

            <span className="px-2.5 py-1 rounded-full bg-[#DCEBFA]/70 text-[#52606d] text-xs font-semibold border border-[#A8BDD2]/40">
              {currentCard?.partOfSpeech || 'Word'}
            </span>
          </div>

          {/* The question text */}
          <p className="text-xs sm:text-sm font-semibold text-[#484A50] mt-6 pt-3 border-t border-[#EAE5DC]/80 font-['Nunito_Sans',sans-serif]">
            What is the meaning of this word?
          </p>
        </div>
      </div>

      {/* ================= 3. ANSWER SECTION ================= */}
      {inputStyle === 'choice' ? (
        /* A. MULTIPLE CHOICE: 2-column grid on desktop, full-width stacked on mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === option;

            let cardStyle =
              'bg-[#FFFFFF] border-[#EAE5DC] hover:border-[#A8BDD2] hover:bg-[#FAF9F6] text-[#1d1c16]';

            if (isSubmitted) {
              if (option === currentCard.thai) {
                // Correct answer highlighted in soft pastel green
                cardStyle = 'bg-[#e1f5ea] border-[#81a68d] text-[#1b432a] font-bold shadow-xs';
              } else if (isSelected) {
                // Wrong selection highlighted in soft blush pink
                cardStyle = 'bg-[#F5DFE5] border-[#d6c1c7] text-[#706065] font-medium';
              } else {
                cardStyle = 'bg-[#FAF9F6] border-[#EAE5DC] text-[#74777c] opacity-50';
              }
            } else if (isSelected) {
              // Active selected choice
              cardStyle = 'bg-[#DCEBFA] border-[#7d98b0] text-[#0f1d28] font-bold shadow-xs';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => {
                  sounds.playRingClick();
                  setSelectedOption(option);
                  // Quick submit if user taps choice
                  handleSubmit(option);
                }}
                className={`p-4 rounded-2xl border-[1.5px] transition-all text-left flex items-start gap-3 active:translate-y-[1px] shadow-2xs ${cardStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-[#EAE5DC]/60 flex items-center justify-center text-xs font-bold text-[#484A50] shrink-0 mt-0.5">
                  {letter}
                </span>
                <span className="text-sm sm:text-base font-medium font-['Anuphan',sans-serif] leading-snug">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* B. WRITE MEANING: Clean text input field with Thai support */
        <div className="bg-[#FFFFFF] rounded-2xl border-[1.5px] border-[#EAE5DC] p-5 shadow-2xs mb-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-semibold text-[#484A50] font-['Anuphan',sans-serif]">
              พิมพ์ความหมายภาษาไทย (Type Thai Meaning)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                disabled={isSubmitted}
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type the Thai meaning here... (พิมพ์ความหมายที่นี่)"
                className="flex-1 px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-sm focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif]"
                autoFocus
              />

              {!isSubmitted && (
                <button
                  type="submit"
                  disabled={!typedAnswer.trim()}
                  className="px-5 py-3 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] transition-all shadow-2xs disabled:opacity-40 font-['Anuphan',sans-serif]"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ================= 4. ANSWER FEEDBACK ================= */}
      {isSubmitted && (
        <div
          className={`p-5 rounded-2xl border-[1.5px] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-xs ${
            isCorrect
              ? 'bg-[#e1f5ea] border-[#81a68d]/60 text-[#1b432a]'
              : 'bg-[#F5DFE5] border-[#d6c1c7] text-[#706065]'
          }`}
        >
          {/* Mascot Illustration & Feedback Message */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <Mascot
              type={isCorrect ? 'kitten' : 'cloud'}
              size="md"
            />
            <div>
              <h3 className="text-sm font-bold leading-tight font-['Nunito_Sans',sans-serif]">
                {isCorrect ? 'Wonderful! You got it right! 🎉' : "Almost there! Let's remember this word together. 🌸"}
              </h3>
              <p className="text-xs mt-1 font-['Anuphan',sans-serif] text-[#484A50]">
                ความหมายที่ถูกต้อง: <span className="font-bold text-[#1d1c16]">{currentCard.thai}</span>
              </p>
              {currentCard.exampleEnglish && (
                <p className="text-[11px] text-[#74777c] mt-0.5 italic">
                  "{currentCard.exampleEnglish}"
                </p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] active:translate-y-[1px] text-xs font-bold text-[#1d1c16] border border-[#A8BDD2] transition-all shadow-2xs shrink-0"
          >
            Continue ➔
          </button>
        </div>
      )}
    </div>
  );
};
