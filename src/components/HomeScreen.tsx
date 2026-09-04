import React from 'react';
import { Play, Award, BookOpen, Layers, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeScreenProps {
  onStartQuiz: (testNumber: number | 'all', count: number) => void;
  totalQuestions: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz, totalQuestions }) => {
  const [selectedTest, setSelectedTest] = React.useState<number | 'all'>(1);
  const [questionCount, setQuestionCount] = React.useState<number>(10);

  const tests = [
    { id: 1, title: 'الاختبار التجريبي 1', desc: '50 سؤالاً في التاريخ والدبلوماسية' },
    { id: 2, title: 'الاختبار التجريبي 2', desc: '50 سؤالاً في الدستور والقانون' },
    { id: 3, title: 'الاختبار التجريبي 3', desc: '50 سؤالاً في المنظمات الدولية' },
    { id: 4, title: 'الاختبار التجريبي 4', desc: '50 سؤالاً في الجغرافيا والسياسة' },
    { id: 5, title: 'الاختبار التجريبي 5', desc: '50 سؤالاً في الشؤون التونسية والعالمية' },
    { id: 6, title: 'الاختبار التجريبي 6', desc: '50 سؤالاً في الاتفاقيات والتواريخ' },
    { id: 'all', title: 'جميع الاختبارات (شامل)', desc: `${totalQuestions} سؤالاً متنوعاً من كافة المحاور` },
  ];

  return (
    <div id="home-screen-container" className="flex flex-col h-full justify-between p-6 bg-white overflow-y-auto text-[#1c1b1f]">
      {/* Top Header */}
      <div id="home-header" className="space-y-3 text-center pt-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 mx-auto rounded-3xl bg-gray-100 flex items-center justify-center text-[#1c1b1f] shadow-xs"
        >
          <Award className="w-7 h-7 text-[#1c1b1f]" />
        </motion.div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            اختبارات الثقافة العامة الرسمية
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c1b1f] tracking-tight">
            مسابقة الثقافة العامة وتاريخ تونس
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            استعد للمناظرات الوطنية عبر اختبارات تجريبية مطابقة للوثائق الرسمية
          </p>
        </div>
      </div>

      {/* Options Section */}
      <div id="home-options-section" className="space-y-4 my-5">
        {/* Choose Test */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-[#1c1b1f] mb-2">
            <Layers className="w-4 h-4 text-gray-700" />
            اختر الاختبار التجريبي:
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {tests.map((test) => {
              const isSelected = selectedTest === test.id;
              return (
                <button
                  key={test.id}
                  id={`test-option-${test.id}`}
                  onClick={() => setSelectedTest(test.id as number | 'all')}
                  className={`text-right p-3.5 rounded-2xl border-2 text-sm transition-all duration-150 flex flex-col cursor-pointer ${
                    isSelected
                      ? 'border-[#1c1b1f] bg-gray-50 text-[#1c1b1f] shadow-xs'
                      : 'border-gray-100 bg-white hover:border-gray-200 text-gray-700'
                  }`}
                >
                  <span className={`font-bold ${isSelected ? 'text-[#1c1b1f]' : 'text-gray-800'}`}>
                    {test.title}
                  </span>
                  <span className="text-[11px] text-gray-500 mt-0.5">{test.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Choose Questions Count */}
        <div>
          <label className="text-xs font-bold text-[#1c1b1f] block mb-2">
            عدد الأسئلة في الجولة:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 30, 50].map((count) => (
              <button
                key={count}
                id={`count-option-${count}`}
                onClick={() => setQuestionCount(count)}
                className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                  questionCount === count
                    ? 'bg-[#1c1b1f] text-white border-[#1c1b1f] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
                }`}
              >
                {count} سؤالاً
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button & APK Download */}
      <div id="home-actions" className="pt-2 space-y-2.5">
        <button
          id="btn-start-quiz"
          onClick={() => onStartQuiz(selectedTest, questionCount)}
          className="w-full py-3.5 bg-[#1c1b1f] hover:bg-black active:scale-95 text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          ابدأ الاختبار الآن
        </button>

        <a
          id="btn-download-apk-direct"
          href="/quiz-concours-tunisie.apk"
          download="quiz-concours-tunisie.apk"
          className="w-full py-2.5 px-3 bg-gray-100 hover:bg-gray-200 active:scale-95 text-[#1c1b1f] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-200/80"
        >
          <Download className="w-3.5 h-3.5 text-[#4CAF50]" />
          <span>تحميل تطبيق APK للأندرويد (217 Ko • Offline)</span>
        </a>
      </div>
    </div>
  );
};
