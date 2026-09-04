import { useState, useMemo } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { Question, QuizScreenState } from './types';
import allQuestionsRaw from './data/questions.json';
import { Smartphone, Code, Wifi, Battery, Sparkles, Download } from 'lucide-react';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<QuizScreenState>('home');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentTestTitle, setCurrentTestTitle] = useState('اختبار الثقافة العامة');
  const [finalScore, setFinalScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ question: Question; selected: number; isCorrect: boolean }[]>([]);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  const allQuestions: Question[] = useMemo(() => allQuestionsRaw as Question[], []);

  const handleStartQuiz = (testNumber: number | 'all', count: number) => {
    let pool = allQuestions;
    let title = 'اختبار الثقافة العامة الشامل';

    if (testNumber !== 'all') {
      pool = allQuestions.filter((q) => q.testNumber === testNumber);
      title = `الاختبار التجريبي عدد ${testNumber}`;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    setActiveQuestions(selected);
    setCurrentTestTitle(title);
    setCurrentScreen('quiz');
  };

  const handleFinishQuiz = (score: number, answers: { question: Question; selected: number; isCorrect: boolean }[]) => {
    setFinalScore(score);
    setUserAnswers(answers);
    setCurrentScreen('result');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-2 sm:p-6 text-[#1c1b1f] font-['Cairo',sans-serif]" dir="rtl">
      {/* Top Banner Toolbar for AI Studio */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2.5 px-4 mb-4 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm text-xs text-[#1c1b1f]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
          <span className="font-bold text-[#1c1b1f]">تطبيق مسابقة الأسئلة (Android Jetpack Compose + Web Preview)</span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-mono text-[11px]">
            {allQuestions.length} سؤالاً مستخرجاً من PDF
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل APK للأندرويد (.apk)</span>
          </button>

          <button
            onClick={() => setShowAndroidModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1c1b1f] hover:bg-black text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            <Code className="w-4 h-4" />
            <span>كود المشروع</span>
          </button>
        </div>
      </header>

      {/* Realistic Mobile Device Container Frame (Clean Minimalism theme: 40px rounded, 12px #1c1b1f border, shadow-2xl) */}
      <main className="relative w-full max-w-[370px] h-[720px] max-h-[92vh] bg-white rounded-[40px] shadow-2xl border-[12px] border-[#1c1b1f] flex flex-col overflow-hidden text-[#1c1b1f]">
        {/* Mobile Status Bar matching Clean Minimalism */}
        <div className="h-7 w-full flex items-center justify-between px-7 pt-4 pb-1 select-none shrink-0 z-30">
          <span className="text-xs font-bold text-[#1c1b1f]">9:41</span>
          <div className="flex items-center gap-1.5 text-[#1c1b1f]">
            <div className="w-3.5 h-2 bg-[#1c1b1f] rounded-full" />
            <div className="w-1.5 h-1.5 bg-[#1c1b1f] rounded-full" />
          </div>
        </div>

        {/* App Screen Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {currentScreen === 'home' && (
            <HomeScreen
              onStartQuiz={handleStartQuiz}
              totalQuestions={allQuestions.length}
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizScreen
              questions={activeQuestions}
              testTitle={currentTestTitle}
              onQuit={() => setCurrentScreen('home')}
              onFinish={handleFinishQuiz}
            />
          )}

          {currentScreen === 'result' && (
            <ResultScreen
              score={finalScore}
              total={activeQuestions.length}
              userAnswers={userAnswers}
              onRestart={() => handleStartQuiz(1, activeQuestions.length)}
              onHome={() => setCurrentScreen('home')}
            />
          )}
        </div>

        {/* Mobile Home Bar Indicator matching Clean Minimalism */}
        <div className="h-4 bg-white flex items-center justify-center pb-2 shrink-0">
          <div className="h-1.5 w-32 bg-gray-300 mx-auto rounded-full" />
        </div>
      </main>

      {/* Footer info */}
      <footer className="mt-3 text-center text-gray-500 text-xs flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5 text-[#4CAF50]" />
        <span>تصميم Clean Minimalism • 300 سؤال ثقافة عامة وتاريخ</span>
      </footer>

      {/* Android Code Modal */}
      {showAndroidModal && (
        <AndroidCodeModal onClose={() => setShowAndroidModal(false)} />
      )}

      {/* APK Download Modal */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
}
