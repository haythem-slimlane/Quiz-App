package com.example.quizapp.model

data class Question(
    val id: Int,
    val testNumber: Int,
    val question: String,
    val options: List<String>,
    val correctIndex: Int
)

enum class ScreenState {
    HOME, QUIZ, RESULT
}
