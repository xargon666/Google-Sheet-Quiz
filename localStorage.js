
const newQuizBtn = document.getElementById("add-new-quiz-btn")
const quizForm = document.getElementById("add-quiz-form")
const quizFormWrapper = document.getElementById('add-quiz-form-wrapper')
const quizListWrapper = document.getElementById('quiz-list-wrapper')
const quizList = document.getElementById("quiz-list")
const quizName = document.getElementById("quiz-name")
const quizLink = document.getElementById("quiz-link")
const quizPass = document.getElementById("quiz-pass")
let quizData = []

console.log("New Test", localStorage.key(0))

const getQuizzes = () => {
    // Clear Quiz Data
    quizData = []

    // Loop through local storage to get new quiz data
    for (let i = 0; i < localStorage.length; i++) {
        quizData.push(JSON.parse(localStorage.getItem(i)))
    }

    // Create Button for each quiz

    // exit if no data
    if (quizData.length < 1) return

    quizData.map((quiz)=>{
        const el = document.createElement('button')
        el.classList.add('app-button')
        el.classList.add('primary-button')
        el.textContent = quiz.name
        // el.addEventListener('click',createQuiz)
        quizList.insertBefore(el,quizList.firstChild)
    })

}

const addQuiz = (e) => {
    quizFormWrapper.style.display = "flex"
    quizListWrapper.style.display = "none"
}

const submitQuiz = (e) => {
    e.preventDefault()

    let newQuizData = {}
    let index = localStorage.length

    if (quizName.value && quizLink.value && quizPass.value) {
        newQuizData = {
            name: quizName.value,
            link: quizLink.value,
            pass: quizPass.value
        }
    }

    // QC Data
    // Need to fetch data from link and check it isn't garbage here

    // Submit Data to Local Storage
    localStorage.setItem(index, JSON.stringify(newQuizData))
    console.log(localStorage)

    // Show the Available Quizzes
    quizFormWrapper.style.display = "none"
    quizListWrapper.style.display = "flex"

    // Refresh Data
    getQuizzes()
}

newQuizBtn.addEventListener("click", addQuiz)
quizForm.addEventListener("submit", submitQuiz)

// const addData = () => {
//     const i = localStorage.length
//     localStorage.setItem(i,JSON.stringify(testData))
//     i++
// 	console.log(localStorage)
// }

console.log(localStorage)
getQuizzes()


// const newQuizForm
// Quiz Name
// Quiz Link
// Passing Grade
