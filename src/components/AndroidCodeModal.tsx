import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Download } from 'lucide-react';

interface AndroidCodeModalProps {
  onClose: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'screen' | 'vm' | 'gradle' | 'build'>('screen');
  const [copied, setCopied] = useState(false);

  const files = {
    screen: {
      name: 'QuizScreen.kt',
      lang: 'kotlin',
      code: `package com.example.quizapp.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.material.icons.outlined.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.quizapp.model.Question

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizScreen(
    questions: List<Question>,
    onFinish: (score: Int) -> Unit,
    onClose: () -> Unit
) {
    var currentIndex by remember { mutableStateOf(0) }
    var selectedIndex by remember { mutableStateOf<Int?>(null) }
    var hasChecked by remember { mutableStateOf(false) }
    var score by remember { mutableStateOf(0) }

    val currentQuestion = questions[currentIndex]
    val isLast = currentIndex == questions.size - 1

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "اختبار الثقافة العامة",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "تاريخ ودبلوماسية • \${questions.size} أسئلة",
                            fontSize = 11.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                },
                actions = {
                    IconButton(onClick = {}) { Icon(Icons.Default.Share, contentDescription = "Share") }
                    IconButton(onClick = {}) { Icon(Icons.Default.MoreVert, contentDescription = "More") }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = Color.White
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp, vertical = 8.dp)
            ) {
                // Progress Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "\${currentIndex + 1}/\${questions.size}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.Gray
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = (currentIndex + if (hasChecked) 1f else 0f) / questions.size,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = Color(0xFF10B981),
                    trackColor = Color(0xFFE2E8F0)
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Subheader (Quiz tag + Speaker + Timer)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("اختبار", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(Icons.Outlined.VolumeUp, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .background(Color(0xFFFEF3C7), RoundedCornerShape(12.dp))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Icon(Icons.Outlined.Timer, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("00:30 Sec", color = Color(0xFFD97706), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Question Text
                Text(
                    text = currentQuestion.question,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A),
                    lineHeight = 26.sp,
                    textAlign = TextAlign.Right,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Options List
                currentQuestion.options.forEachIndexed { index, optionText ->
                    val isSelected = selectedIndex == index
                    val isCorrect = index == currentQuestion.correctIndex

                    val (bgColor, borderColor) = when {
                        !hasChecked -> {
                            if (isSelected) Color(0xFFE0F2F1) to Color(0xFF00897B)
                            else Color.White to Color(0xFFE2E8F0)
                        }
                        isCorrect -> Color(0xFFDCFCE7) to Color(0xFF10B981)
                        isSelected && !isCorrect -> Color(0xFFFEE2E2) to Color(0xFFEF4444)
                        else -> Color(0xFFF8FAFC) to Color(0xFFE2E8F0)
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                            .background(bgColor, RoundedCornerShape(14.dp))
                            .border(1.5.dp, borderColor, RoundedCornerShape(14.dp))
                            .clickable(enabled = !hasChecked) { selectedIndex = index }
                            .padding(horizontal = 16.dp, vertical = 14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = optionText,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF1E293B),
                                modifier = Modifier.weight(1f),
                                textAlign = TextAlign.Right
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Box(
                                modifier = Modifier
                                    .size(20.dp)
                                    .clip(CircleShape)
                                    .border(2.dp, borderColor, CircleShape)
                                    .background(if (isSelected && !hasChecked) Color(0xFF00897B) else Color.Transparent),
                                contentAlignment = Alignment.Center
                            ) {
                                if (hasChecked && isCorrect) {
                                    Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(14.dp))
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                // Bottom Check Button
                if (!hasChecked) {
                    Button(
                        onClick = {
                            if (selectedIndex != null) {
                                hasChecked = true
                                if (selectedIndex == currentQuestion.correctIndex) score++
                            }
                        },
                        enabled = selectedIndex != null,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFFF385C),
                            disabledContainerColor = Color(0xFFE2E8F0),
                            contentColor = Color.White,
                            disabledContentColor = Color(0xFF94A3B8)
                        )
                    ) {
                        Text("تحقق", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Bottom Sheet Feedback
            AnimatedVisibility(
                visible = hasChecked,
                enter = slideInVertically(initialOffsetY = { it }),
                exit = slideOutVertically(targetOffsetY = { it }),
                modifier = Modifier.align(Alignment.BottomCenter)
            ) {
                val isAnswerCorrect = selectedIndex == currentQuestion.correctIndex
                Surface(
                    shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                    color = Color.White,
                    shadowElevation = 16.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = if (isAnswerCorrect) "إجابة صحيحة" else "إجابة خاطئة",
                            color = if (isAnswerCorrect) Color(0xFF10B981) else Color(0xFFEF4444),
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (isAnswerCorrect) "ممتاز! إجابة صحيحة تماماً." else "الإجابة الصحيحة: \${currentQuestion.options[currentQuestion.correctIndex]}",
                            fontSize = 14.sp,
                            color = Color(0xFF334155),
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = {
                                if (isLast) onFinish(score)
                                else {
                                    currentIndex++
                                    selectedIndex = null
                                    hasChecked = false
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                        ) {
                            Text(if (isLast) "عرض النتيجة" else "التالي", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }
                }
            }
        }
    }
}`
    },
    main: {
      name: 'MainActivity.kt',
      lang: 'kotlin',
      code: `package com.example.quizapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.example.quizapp.ui.HomeScreen
import com.example.quizapp.ui.QuizScreen
import com.example.quizapp.ui.ResultScreen
import com.example.quizapp.viewmodel.QuizViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: QuizViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val screenState by viewModel.screenState.collectAsState()
                    val questions by viewModel.currentQuestions.collectAsState()
                    val score by viewModel.score.collectAsState()

                    when (screenState) {
                        ScreenState.HOME -> HomeScreen(
                            onStart = { testNum, count -> viewModel.startQuiz(testNum, count) }
                        )
                        ScreenState.QUIZ -> QuizScreen(
                            questions = questions,
                            onFinish = { finalScore -> viewModel.showResults(finalScore) },
                            onClose = { viewModel.resetToHome() }
                        )
                        ScreenState.RESULT -> ResultScreen(
                            score = score,
                            total = questions.size,
                            onRestart = { viewModel.restartCurrentQuiz() },
                            onHome = { viewModel.resetToHome() }
                        )
                    }
                }
            }
        }
    }
}`
    },
    vm: {
      name: 'QuizViewModel.kt & Question.kt',
      lang: 'kotlin',
      code: `package com.example.quizapp.model

data class Question(
    val id: Int,
    val testNumber: Int,
    val question: String,
    val options: List<String>,
    val correctIndex: Int
)

enum class ScreenState { HOME, QUIZ, RESULT }

// --- ViewModel ---
package com.example.quizapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.example.quizapp.model.Question
import com.example.quizapp.model.ScreenState
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class QuizViewModel(application: Application) : AndroidViewModel(application) {
    private val allQuestions = mutableListOf<Question>()
    private val _screenState = MutableStateFlow(ScreenState.HOME)
    val screenState = _screenState.asStateFlow()

    private val _currentQuestions = MutableStateFlow<List<Question>>(emptyList())
    val currentQuestions = _currentQuestions.asStateFlow()

    private val _score = MutableStateFlow(0)
    val score = _score.asStateFlow()

    init {
        loadQuestions()
    }

    private fun loadQuestions() {
        val jsonString = getApplication<Application>().assets
            .open("questions.json")
            .bufferedReader()
            .use { it.readText() }
        val type = object : TypeToken<List<Question>>() {}.type
        val list: List<Question> = Gson().fromJson(jsonString, type)
        allQuestions.addAll(list)
    }

    fun startQuiz(testNumber: Int?, count: Int) {
        val pool = if (testNumber != null) {
            allQuestions.filter { it.testNumber == testNumber }
        } else {
            allQuestions
        }
        _currentQuestions.value = pool.shuffled().take(count)
        _score.value = 0
        _screenState.value = ScreenState.QUIZ
    }

    fun showResults(finalScore: Int) {
        _score.value = finalScore
        _screenState.value = ScreenState.RESULT
    }

    fun restartCurrentQuiz() {
        _currentQuestions.value = _currentQuestions.value.shuffled()
        _score.value = 0
        _screenState.value = ScreenState.QUIZ
    }

    fun resetToHome() {
        _screenState.value = ScreenState.HOME
    }
}`
    },
    gradle: {
      name: 'app/build.gradle.kts',
      lang: 'kotlin',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.quizapp"
    compileSdk = 29 // Android 10 (API 29)

    defaultConfig {
        applicationId = "com.example.quizapp"
        minSdk = 21
        targetSdk = 29 // Android 10 (API 29)
        versionCode = 3
        versionName = "1.10.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            storeFile = file("my-release-key.jks")
            storePassword = "password123"
            keyAlias = "my-key-alias"
            keyPassword = "password123"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("com.google.code.gson:gson:2.11.0")
}`
    },
    build: {
      name: 'APK Build Instructions',
      lang: 'bash',
      code: `# 1. Générer le KeyStore pour signer l'APK :
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias -storepass password123 -keypass password123 -dname "CN=QuizApp, OU=Dev, O=Kedma, L=Tunis, S=Tunis, C=TN"

# 2. Placer questions.json dans app/src/main/assets/ :
mkdir -p app/src/main/assets/
cp questions.json app/src/main/assets/

# 3. Compiler l'application et générer l'APK Release signé :
./gradlew assembleRelease

# 4. L'APK signé est disponible à :
# app/build/outputs/apk/release/app-release.apk`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50">
      <div className="bg-[#1c1b1f] border border-gray-800 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl text-gray-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#4CAF50]" />
            <h3 className="font-bold text-base text-white">
              ملفات تطبيق Android (Jetpack Compose) وأوامر التجميع APK
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 py-2 border-b border-gray-800 flex items-center justify-between gap-2 overflow-x-auto bg-black/40 text-xs">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveTab('screen')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'screen' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              QuizScreen.kt
            </button>
            <button
              onClick={() => setActiveTab('main')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'main' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              MainActivity.kt
            </button>
            <button
              onClick={() => setActiveTab('vm')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'vm' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              ViewModel & Model
            </button>
            <button
              onClick={() => setActiveTab('gradle')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'gradle' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              build.gradle.kts
            </button>
            <button
              onClick={() => setActiveTab('build')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'build' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              أوامر Build APK
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/quiz-concours-tunisie.apk"
              download="quiz-concours-tunisie.apk"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4CAF50] hover:bg-[#43a047] text-white transition-colors cursor-pointer text-xs font-bold shrink-0"
              title="Télécharger directement le fichier APK"
            >
              <Download className="w-4 h-4" />
              <span>تحميل APK (217 Ko)</span>
            </a>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors cursor-pointer text-xs font-bold"
            >
              {copied ? <Check className="w-4 h-4 text-[#4CAF50]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 p-4 bg-black/60 overflow-auto font-mono text-xs text-emerald-300/90 leading-relaxed text-left dir-ltr">
          <pre>{files[activeTab].code}</pre>
        </div>
      </div>
    </div>
  );
};
