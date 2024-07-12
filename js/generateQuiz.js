import { getQuizData, quizData } from '../js/getQuizData.js'

// VARIABLE BLOCK =============================================================

const loader = document.getElementById('loader')
const quizWrapper = document.getElementById('quiz-wrapper')
const quizName = document.getElementById('quiz-name')
const quizPass = document.getElementById('quiz-pass')
const startQuizButton = document.getElementById('start-quiz-button')
const quizInfo = document.getElementById('quiz-info')

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

// FUNCTION BLOCK =============================================================

function generateQuiz() {
    getQuizData()
    const quiz = quizData.find((quiz) => quiz.id === index)
    if (!quiz) return
    fetch(`${quiz.link}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            game.data = data;
            loader.style.display = "none"
            quizWrapper.style.display = "flex"
            if (game.data.length > 0) {
                game.name = quiz.name
                game.pass = quiz.pass
                quizName.textContent = game.name
                quizPass.textContent = `The passing grade on this quiz is ${game.pass}%`
                // convert answers to string array
                for (let i = 0; i < Object.keys(game.data).length; i++) {
                    let newAnswer = []
                    let string = String(game.data[i].answer)
                    string.includes(',')
                        ? newAnswer = string.split(',')
                        : newAnswer.push(string)
                    game.data[i].answer = newAnswer.map(Number)

                }
            }
        })
        .catch(error => {
            // Handle the error here
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function startQuiz() {
    console.log(game.data)
    clearScreen()
    setupQuizInfo()
    nextQuestion()
}

function clearScreen() {
    while (quizWrapper.firstChild) {
        quizWrapper.removeChild(quizWrapper.firstChild)
    }
}

function submitAnswer(e) {
    e.preventDefault()

    // Hide Error Text
    const redText = document.getElementsByClassName('red-text')[0]
    redText && (redText.style.display = "none")

    // Add selected answers to array
    let selectedAnswers = []
    const answers = document.getElementsByName('answer')
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked === true) {
            selectedAnswers.push(Number(answers[i].value))
        }
    }

    // Prevent form submission without selection
    if (!selectedAnswers) {
        redText.textContent = "Please select an answer to continue"
        redText.style.display = "block"
        return
    }

    // Confirm if answer is correct
    const currentQuestion = game.playerData.question
    const questionAnswer = game.data[currentQuestion].answer

    // Check Answers
    let answerCorrect = true
    for (let i = 0; i < questionAnswer.length; i++) {
        if (!selectedAnswers.includes(questionAnswer[i])) answerCorrect = false
    }

    // Add Points
    answerCorrect && game.playerData.score++
    console.log("score", game.playerData.score)

    // Check if end of quiz or proceed to next question
    if (game.playerData.question + 1 === Object.keys(game.data).length) {
        // End of Quiz
        console.log("END OF QUIZ")
    } else {
        // Next Question
        game.playerData.question++
        clearScreen()
        nextQuestion()
    }
}

function setupQuizInfo() {
    const redText = createElement("p", "Red Text", "self-centered", quizInfo)
    redText.classList.add("red-text")
    redText.style.display = "none"
}

function createElement(element, text, classList, parent) {
    const el = document.createElement(element)
    text && (el.textContent = text)
    classList && (el.classList.add(classList))
    parent.appendChild(el)
    return el
}

function createRadioButton(id, text, parent) {
    const option = document.createElement("div")
    const radio = document.createElement("input")
    const label = document.createElement("label")

    radio.setAttribute("type", "radio")
    radio.setAttribute("id", id)
    radio.setAttribute("value", id)
    radio.setAttribute("name", "answer")
    radio.classList.add('question-answer')

    label.setAttribute("for", id)
    label.innerText = text

    option.appendChild(radio)
    option.appendChild(label)
    option.classList.add('question-option')

    parent.appendChild(option)
    return
}

function nextQuestion() {

    // Add Question Details
    createElement("h2", `Question ${game.playerData.question + 1}`, "self-centered", quizWrapper)
    createElement("h3", `${game.data[game.playerData.question].question}`, "self-centered", quizWrapper)

    // Create Form
    const questionForm = document.createElement('form')
    questionForm.addEventListener('submit', submitAnswer)

    // Create Form Submit Button
    const submitButton = document.createElement('input')
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('value', 'Submit')
    submitButton.setAttribute('id', 'submit-answer-button')
    submitButton.classList.add('app-button')
    submitButton.classList.add('secondary-button')

    // Create Answer Buttons
    switch (game.data.type) {
        case 'Checkbox':
            break;
        default:
            // Multiple Choice
            const options = Object.values(game.data[game.playerData.question].options)
            options.forEach((option, index) => createRadioButton(index + 1, option, questionForm))
            break;
    }

    // Add Submit Button, Append Form
    questionForm.appendChild(submitButton)
    questionForm.classList.add('quiz-form')
    quizWrapper.appendChild(questionForm)

}

// LAUNCH CODE ================================================================

generateQuiz()
startQuizButton.addEventListener('click', startQuiz)
