import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, AlertTriangle, X, ShieldCheck, FileArchive, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const apkUrl = '/quiz-concours-tunisie.apk';
  const zipUrl = '/quiz-concours-jetpack-compose-project.zip';

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + apkUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in" dir="rtl">
      <div className="bg-[#1c1b1f] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4CAF50]/15 flex items-center justify-center text-[#4CAF50]">
              <Smartphone className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                تحميل ملف التطبيق للأندرويد (.APK) - إصدار Android 10
              </h3>
              <p className="text-xs text-gray-400">
                Build optimisé pour Android 10 (API 29) • Compatible Android 5.0 à 15+
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-right">
          {/* Main Download Card */}
          <div className="p-5 rounded-2xl bg-[#2b2a30] border border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#4CAF50]/20 text-[#4CAF50] font-mono text-[11px] font-bold">
                  Android 10 (API 29) • v1.12.0
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                  واجهة شاشة كاملة بدون شريط علوي ✓
                </span>
                <span className="text-xs text-gray-400">الحجم: 225 Ko</span>
              </div>
              <h4 className="text-base font-bold text-white">
                quiz-concours-tunisie.apk
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                إصدار نقي لشاشة الهاتف كاملة (Full Screen)، تم حذف الشريط العلوي وشاشات المعاينة ليعمل كتطبيق أندرويد أصلي متكامل وسلس.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              <a
                href={apkUrl}
                download="quiz-concours-tunisie.apk"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل APK مباشر</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                title="Copier le lien direct de téléchargement"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#4CAF50]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-gray-400 mb-1">الأسئلة</div>
              <div className="font-bold text-white text-sm">300 سؤال</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-gray-400 mb-1">الإنترنت</div>
              <div className="font-bold text-[#4CAF50] text-sm">غير مطلوب (Offline)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-gray-400 mb-1">المستهدف (Target SDK)</div>
              <div className="font-bold text-amber-400 text-sm">Android 10 (API 29)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-gray-400 mb-1">التوقيع الأمني</div>
              <div className="font-bold text-[#4CAF50] text-sm">v1, v2, v3 Signature</div>
            </div>
          </div>

          {/* Android Studio Source Code Download */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-300 shrink-0">
                <FileArchive className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-right">
                <h5 className="font-bold text-xs sm:text-sm text-white">مشروع كود Android Studio الكامل (.ZIP)</h5>
                <p className="text-[11px] text-gray-400">Jetpack Compose + Gradle + Kotlin (مفتوح المصدر للتعديل والتطوير)</p>
              </div>
            </div>

            <a
              href={zipUrl}
              download="quiz-concours-jetpack-compose-project.zip"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل ZIP (19 Ko)</span>
            </a>
          </div>

          {/* Installation Steps Guide */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
              <span>خطوات التثبيت السهلة على هاتف أندرويد (Guide d'installation) :</span>
            </h4>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white block mb-0.5">اضغط على زر "تحميل APK مباشر" أعلاه:</strong>
                  سيتم تنزيل الملف <code className="text-emerald-300">quiz-concours-tunisie.apk</code> مباشرة على هاتفك أو حاسوبك.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white block mb-0.5">افتح الملف بعد اكتمال التنزيل:</strong>
                  اضغط على إشعار التنزيل المكتمل، أو افتح تطبيق "الملفات" (Files) ثم مجلد "التنزيلات" (Downloads).
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white block mb-0.5">السماح بالتثبيت من مصادر غير معروفة (إذا طُلب منك):</strong>
                  نظراً لأن الملف من خارج متجر Play Store، سيطلب أندرويد الإذن: اضغط على <strong>الإعدادات (Paramètres)</strong> ثم فعّل <strong>"السماح بتثبيت التطبيقات من هذا المصدر" (Autoriser cette source)</strong>.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#4CAF50] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-white block mb-0.5">اضغط على تثبيت (Installer) وابدأ الاختبار:</strong>
                  سيظهر التطبيق فوراً في قائمة تطبيقات هاتفك باسم <strong>"مسابقة الثقافة العامة"</strong> ويعمل كاملاً بدون إنترنت.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-800 bg-black/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
            <span>ملف APK أصلي وموقّع وجاهز للتثبيت الفوري</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
