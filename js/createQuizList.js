import { getQuizData, quizData } from "./getQuizData.js"

// VARIABLE BLOCK =============================================================

const quizList = document.getElementById("quiz-list")

// FUNCTION BLOCK =============================================================

function createQuizList() {

    // Safety: Exit function if no data
    if (quizData.length < 1) return

    // Create the buttons
    quizData.map((quiz) => {
        if (!quiz.id) return
        if (!quiz.name) return
        if (!quiz.link) return
        if (!quiz.pass) return

        // Create Buttons
        const el = document.createElement('a')
        el.classList.add('app-button')
        el.classList.add('primary-button')
        if (quiz.name.length > 100) {
            el.textContent = quiz.name.slice(0, 108) + "..."
        } else {
            el.textContent = quiz.name
        }
        el.addEventListener('click', () => goToQuiz(quiz.id))
        quizList.insertBefore(el, quizList.firstChild)
    })
}

function goToQuiz(id) {
    window.location.href = `./quiz.html?${id}`
}

// LAUNCH CODE ================================================================

getQuizData()
createQuizList()
