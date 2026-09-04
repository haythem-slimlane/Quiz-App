import React, { useState, useEffect } from 'react';
import { X, Share2, MoreVertical, Volume2, Hourglass, Target, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { playSound, speakArabicText } from '../utils/sound';

interface QuizScreenProps {
  questions: Question[];
  onQuit: () => void;
  onFinish: (score: number, userAnswers: { question: Question; selected: number; isCorrect: boolean }[]) => void;
  testTitle?: string;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  onQuit,
  onFinish,
  testTitle = 'اختبار الثقافة العامة'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [userAnswers, setUserAnswers] = useState<{ question: Question; selected: number; isCorrect: boolean }[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Timer countdown per question
  useEffect(() => {
    if (hasChecked) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Time out auto-check or stay at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasChecked, currentIndex]);

  const handleSelectOption = (index: number) => {
    if (hasChecked) return;
    setSelectedOption(index);
    playSound('click');
  };

  const handleCheck = () => {
    if (selectedOption === null || hasChecked) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setHasChecked(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selected: selectedOption,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = selectedOption === currentQuestion.correctIndex ? score + 1 : score;
      onFinish(finalScore, [
        ...userAnswers,
        ...(userAnswers.length === questions.length
          ? []
          : [{ question: currentQuestion, selected: selectedOption ?? -1, isCorrect: selectedOption === currentQuestion.correctIndex }])
      ]);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setTimerSeconds(30);
    }
  };

  const isCurrentCorrect = selectedOption !== null && selectedOption === currentQuestion.correctIndex;
  const progressPercent = ((currentIndex + (hasChecked ? 1 : 0)) / questions.length) * 100;

  return (
    <div id="quiz-screen-container" className="relative flex flex-col h-full bg-white text-[#1c1b1f] overflow-hidden select-none">
      {/* Top Bar matching Clean Minimalism design */}
      <div id="quiz-topbar" className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <button
          id="btn-close-quiz"
          onClick={() => setShowExitConfirm(true)}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#1c1b1f] transition-colors cursor-pointer"
          title="خروج"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center flex-1 px-2">
          <h1 className="text-base sm:text-lg font-bold text-[#1c1b1f] truncate">{testTitle}</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-audio-speak"
            onClick={() => speakArabicText(currentQuestion.question)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
            title="استمع للسؤال"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            id="btn-share"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: testTitle, text: currentQuestion.question, url: window.location.href });
              }
            }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
            title="مشاركة"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Section matching Clean Minimalism */}
      <div id="quiz-progress-section" className="px-6 mt-3">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-500 font-semibold">
            السؤال {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 font-semibold">
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds} ث
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {String(currentIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#4CAF50] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question & Options Scrollable Area */}
      <div id="quiz-body-content" className="px-6 mt-4 flex-1 overflow-y-auto space-y-4 pb-28">
        {/* Question Card matching Clean Minimalism: bg-[#f9fafb] p-6 rounded-3xl */}
        <div className="bg-[#f9fafb] p-5 sm:p-6 rounded-3xl border border-gray-100/80 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-[#1c1b1f] leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List matching Clean Minimalism */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQuestion.correctIndex;

            // Styles matching Clean Minimalism:
            // Default: border-2 border-gray-100 bg-white text-gray-700
            // Selected before check: border-2 border-[#1c1b1f] bg-gray-50 text-[#1c1b1f]
            // Correct: border-2 border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]
            // Wrong: border-2 border-[#E53935] bg-[#FFEBEE] text-[#C62828]
            let containerStyle = 'border-2 border-gray-100 bg-white hover:border-gray-200 text-gray-700';
            let indicator = <div className="w-6 h-6 rounded-full border-2 border-gray-200" />;

            if (!hasChecked) {
              if (isSelected) {
                containerStyle = 'border-2 border-[#1c1b1f] bg-gray-50/80 text-[#1c1b1f] shadow-sm';
                indicator = (
                  <div className="w-6 h-6 rounded-full border-2 border-[#1c1b1f] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1c1b1f]" />
                  </div>
                );
              }
            } else {
              if (isCorrectAnswer) {
                containerStyle = 'border-2 border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32] font-bold';
                indicator = (
                  <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                );
              } else if (isSelected && !isCorrectAnswer) {
                containerStyle = 'border-2 border-[#E53935] bg-[#FFEBEE] text-[#C62828] font-bold';
                indicator = (
                  <div className="w-6 h-6 rounded-full bg-[#E53935] flex items-center justify-center text-white">
                    <XCircle className="w-4 h-4" />
                  </div>
                );
              } else {
                containerStyle = 'border-2 border-gray-100 bg-gray-50/60 opacity-60 text-gray-500';
              }
            }

            return (
              <motion.div
                key={idx}
                id={`quiz-option-${idx}`}
                whileTap={!hasChecked ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(idx)}
                className={`group w-full p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${containerStyle}`}
              >
                <span className="text-base sm:text-lg font-medium leading-normal flex-1">
                  {option}
                </span>
                <div className="shrink-0">{indicator}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Area (Check Button) matching Clean Minimalism */}
      {!hasChecked && (
        <div id="quiz-bottom-bar" className="absolute bottom-0 inset-x-0 p-5 bg-white/95 backdrop-blur-xs border-t border-gray-100">
          <button
            id="btn-check-answer"
            disabled={selectedOption === null}
            onClick={handleCheck}
            className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center ${
              selectedOption !== null
                ? 'bg-[#1c1b1f] hover:bg-black text-white cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            تحقق من الإجابة
          </button>
        </div>
      )}

      {/* Bottom Sheet Feedback matching Clean Minimalism */}
      <AnimatePresence>
        {hasChecked && (
          <motion.div
            id="feedback-bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-[32px] shadow-2xl border-t border-gray-100 p-6 z-30 flex flex-col items-center text-center"
          >
            {isCurrentCorrect ? (
              <>
                <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-3 text-[#4CAF50]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#2E7D32] mb-1">
                  إجابة صحيحة!
                </h4>
                <p className="text-sm text-gray-600 mb-5">
                  أحسنت، الإجابة مطابقة تماماً للوثائق الرسمية.
                </p>
                <button
                  id="btn-next-question-correct"
                  onClick={handleNext}
                  className="w-full py-3.5 sm:py-4 bg-[#1c1b1f] hover:bg-black text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isLastQuestion ? 'عرض النتيجة' : 'السؤال التالي'}
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[#FFEBEE] flex items-center justify-center mb-3 text-[#E53935]">
                  <XCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#C62828] mb-1">
                  إجابة غير صحيحة
                </h4>
                <p className="text-xs text-gray-500 mb-1.5">
                  الإجابة الصحيحة هي:
                </p>
                <p className="text-sm font-bold text-[#2E7D32] bg-[#E8F5E9] px-4 py-2 rounded-xl border border-[#4CAF50]/30 mb-5">
                  {currentQuestion.options[currentQuestion.correctIndex]}
                </p>
                <button
                  id="btn-next-question-wrong"
                  onClick={handleNext}
                  className="w-full py-3.5 sm:py-4 bg-[#1c1b1f] hover:bg-black text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isLastQuestion ? 'عرض النتيجة' : 'السؤال التالي'}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Dialog matching Clean Minimalism */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 z-40">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl space-y-4 border border-gray-100"
            >
              <h4 className="text-base font-bold text-[#1c1b1f]">هل تريد إنهاء الاختبار؟</h4>
              <p className="text-xs text-gray-500">سيتم حفظ نتيجتك الحالية والعودة للقائمة الرئيسية.</p>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  متابعة
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#1c1b1f] text-white hover:bg-black"
                >
                  خروج
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
