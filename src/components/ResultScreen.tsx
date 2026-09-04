import React, { useState } from 'react';
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../types';

interface ResultScreenProps {
  score: number;
  total: number;
  userAnswers: { question: Question; selected: number; isCorrect: boolean }[];
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  total,
  userAnswers,
  onRestart,
  onHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((score / total) * 100);

  let title = 'ممتاز جداً!';
  let subtitle = 'لقد أظهرت معرفة استثنائية بالثقافة العامة والتاريخ!';
  let badgeColor = 'text-[#2E7D32] bg-[#E8F5E9] border-[#4CAF50]/30';

  if (percentage < 50) {
    title = 'يمكنك التحسن أكثر!';
    subtitle = 'راجع الأسئلة وحاول مرة أخرى لتحقيق نتيجة أفضل.';
    badgeColor = 'text-[#C62828] bg-[#FFEBEE] border-[#E53935]/30';
  } else if (percentage < 75) {
    title = 'أداء جيد جداً!';
    subtitle = 'بداية موفقة ومستوى متميز في الإجابات.';
    badgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  return (
    <div id="result-screen-container" className="flex flex-col h-full bg-white p-6 overflow-y-auto justify-between text-[#1c1b1f]">
      <div className="space-y-5 text-center pt-2">
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-16 h-16 mx-auto rounded-3xl bg-gray-100 flex items-center justify-center text-[#1c1b1f] shadow-xs"
        >
          <Trophy className="w-8 h-8" />
        </motion.div>

        {/* Score Display */}
        <div className="space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            النتيجة النهائية
          </span>
          <h2 className="text-2xl font-bold text-[#1c1b1f]">{title}</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">{subtitle}</p>

          <div className="pt-2">
            <div className="text-4xl font-extrabold text-[#1c1b1f]">
              {score} <span className="text-base text-gray-400 font-normal">/ {total}</span>
            </div>
            <div className="text-xs font-bold text-[#2E7D32] mt-1">
              نسبة النجاح: {percentage}%
            </div>
          </div>
        </div>

        {/* Mini Stats Card */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="bg-[#E8F5E9] border border-[#4CAF50]/20 rounded-2xl p-3 flex flex-col items-center">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32] mb-1" />
            <span className="text-xs text-gray-600 font-medium">إجابات صحيحة</span>
            <span className="text-lg font-extrabold text-[#2E7D32]">{score}</span>
          </div>
          <div className="bg-[#FFEBEE] border border-[#E53935]/20 rounded-2xl p-3 flex flex-col items-center">
            <XCircle className="w-5 h-5 text-[#C62828] mb-1" />
            <span className="text-xs text-gray-600 font-medium">إجابات خاطئة</span>
            <span className="text-lg font-extrabold text-[#C62828]">{total - score}</span>
          </div>
        </div>

        {/* Question Review Toggle */}
        <div className="text-right">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full py-2.5 px-4 text-xs font-bold text-[#1c1b1f] bg-gray-50 hover:bg-gray-100 border-2 border-gray-100 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>مراجعة الأسئلة وتصحيحها ({userAnswers.length})</span>
            {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showReview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 space-y-2.5 max-h-52 overflow-y-auto text-right pr-1"
            >
              {userAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 text-xs ${
                    item.isCorrect
                      ? 'bg-[#E8F5E9]/50 border-[#4CAF50]/30'
                      : 'bg-[#FFEBEE]/50 border-[#E53935]/30'
                  }`}
                >
                  <p className="font-bold text-[#1c1b1f] mb-1">{idx + 1}. {item.question.question}</p>
                  <div className="text-[11px] space-y-0.5">
                    <p className="text-[#2E7D32] font-semibold">
                      ✓ الصحيحة: {item.question.options[item.question.correctIndex]}
                    </p>
                    {!item.isCorrect && (
                      <p className="text-[#C62828] font-medium">
                        ✗ اختيارك: {item.selected >= 0 ? item.question.options[item.selected] : 'لم تجب'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div id="result-actions" className="space-y-2.5 pt-4">
        <button
          id="btn-restart-quiz"
          onClick={onRestart}
          className="w-full py-4 bg-[#1c1b1f] hover:bg-black active:scale-95 text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة الاختبار
        </button>

        <button
          id="btn-back-home"
          onClick={onHome}
          className="w-full py-3.5 bg-white border-2 border-gray-200 hover:bg-gray-50 active:scale-95 text-[#1c1b1f] font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          العودة للقائمة الرئيسية
        </button>
      </div>
    </div>
  );
};
