import { getQuizData, quizData } from '../js/getQuizData.js'

const loader = document.getElementById('loader')
const quizWrapper = document.getElementById('quiz-wrapper')
const quizName = document.getElementById('quiz-name')
const quizPass = document.getElementById('quiz-pass')
const startQuizButton = document.getElementById('start-quiz-button')

const index = parseInt(parent.document.URL.substring(parent.document.URL.indexOf('?') + 1, parent.document.URL.length));

const game = {
    name: quizData.name,
    pass: quizData.pass,
    data: {},
    playerData: {
        question: 0,
        score: 0,
        questionData: {
            question: 0,
            playerAnswer: [],
            correctAnswer: [],
            correct: Boolean
        }
    }
}

function generateQuiz() {
    getQuizData()
    const quiz = quizData.find((quiz) => quiz.id === index)
    if (!quiz) return
    console.log(quiz.link)
    fetch(`${quiz.link}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            game.data = data;
            console.log(data)
            loader.style.display = "none"
            quizWrapper.style.display = "flex"
            if (game.data.length > 0) {
                game.name = quiz.name
                game.pass = quiz.pass
                quizName.textContent = game.name
                quizPass.textContent = `The passing grade on this quiz is ${game.pass}%`
            }
        })
        .catch(error => {
            // Handle the error here
            console.error('There has been a problem with your fetch operation:', error);
        });
}

generateQuiz()

startQuizButton.addEventListener('click', startQuiz)

function startQuiz() {
    clearScreen()
    nextQuestion()
}

function clearScreen() {
    while (quizWrapper.firstChild) {
        quizWrapper.removeChild(quizWrapper.firstChild)
    }
}

function createElement(element, text, classList, parent) {
    const el = document.createElement(element)
    text && (el.textContent = text)
    classList && (el.classList.add(classList))
    parent.appendChild(el)
    return
}

function createRadioButton(id, text, parent) {
    const option = document.createElement("div")
    const radio = document.createElement("input")
    const label = document.createElement("label")

    radio.setAttribute("type", "radio")
    radio.setAttribute("id", id)
    radio.setAttribute("value", id)
    radio.setAttribute("name", "answer")

    label.setAttribute("for", id)
    label.innerText = text

    option.appendChild(radio)
    option.appendChild(label)

    parent.appendChild(option)
    return
}

function nextQuestion() {

    // Add Question Details
    createElement("h2", `Question ${game.playerData.question + 1}`, "self-centered", quizWrapper)
    createElement("h3", `${game.data[game.playerData.question].question}`, "self-centered", quizWrapper)

    const newForm = document.createElement('form')

    switch (game.data.type) {

        case 'Checkbox':
            break

        // Multiple Choice
        default:
            const options = Object.values(game.data[game.playerData.question].options)
            options.forEach((option, index) => {
                createRadioButton(index, option, newForm)
            })
            break
    }

    // Create Form
    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('value', 'Submit')
    submitButton.classList.add('app-button')
    submitButton.classList.add('secondary-button')
    newForm.appendChild(submitButton)
    quizWrapper.appendChild(newForm)

}

console.log(game)




