

const quizForm = document.getElementById("add-quiz-form")
const quizFormWrapper = document.getElementById('add-quiz-form-wrapper')
const quizListWrapper = document.getElementById('quiz-list-wrapper')

const quizName = document.getElementById("quiz-name")
const quizLink = document.getElementById("quiz-link")
const quizPass = document.getElementById("quiz-pass")

let quizData = []

console.log("New Test", localStorage.key(0))


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

    // Return to Quiz List page
    window.location.href="./quizList.html"
}

quizForm.addEventListener("submit", submitQuiz)
