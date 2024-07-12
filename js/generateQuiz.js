import { getQuizData, quizData } from '../js/getQuizData.js'

// VARIABLE BLOCK =============================================================
const loaded = false
const loader = document.getElementById('loader')
const quizWrapper = document.getElementById('quiz-wrapper')
const quizName = document.getElementById('quiz-name')
const quizPass = document.getElementById('quiz-pass')
const startQuizButton = document.getElementById('start-quiz-button')
const quizInfo = document.getElementById('quiz-info')
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

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

function toggleLoader(toggle) {
    if (toggle) {
        loader.style.display = "none"
        quizWrapper.style.display = "flex"
    } else {
        loader.style.display = "block"
        quizWrapper.style.display = "none"
    }
}

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
            toggleLoader(true)
            if (game.data.length > 0) {
                game.name = quiz.name
                game.pass = quiz.pass
                quizName.textContent = game.name
                quizPass.textContent = `The passing grade on this quiz is ${game.pass}%`
                // convert answers to string array
                for (let i = 0; i < Object.keys(game.data).length; i++) {
                    // Validate points
                    if (!game.data[i].points) {
                        game.data[i].points = 1
                    } else {
                        game.data[i].points = Number(game.data[i].points)
                    }
                    // Build Answers Array
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
    if (selectedAnswers.length === 0) {
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
    if (answerCorrect) game.playerData.score += game.data[currentQuestion].points

    // Check if end of quiz or proceed to next question
    if (game.playerData.question + 1 === Object.keys(game.data).length && selectedAnswers) {
        // End of Quiz
        endQuiz()
    } else {
        // Next Question
        game.playerData.question++
        nextQuestion()
    }
    return
}

function endQuiz() {
    clearScreen()
    let maxScore = 0
    for (let i = 0; i < Object.keys(game.data).length; i++) {
        maxScore += game.data[i].points
    }

    createElement(
        'h3',
        `Final Score: ${game.playerData.score}/${maxScore}`,
        'self-centered',
        quizWrapper
    )
    const outcomeMessage = createElement(
        'h2',
        "Quiz Outcome Text",
        "self-centered",
        quizWrapper
    )
    if (game.playerData.score === maxScore) {
        outcomeMessage.textContent = "Congratulations!"
        outcomeMessage.classList.add('rainbow')
    } else {
        outcomeMessage.textContent = "Better luck next time."
    }

    // Add Exit/Retry Buttons
    const exitButtons = createElement("div", "", "button-group", quizWrapper)

    const exit = createElement("a", "Return to List", "app-button", exitButtons)
    exit.classList.add('primary-button')
    exit.setAttribute('href', 'quizList.html')

    const retry = createElement("a", "Try Again", "app-button", exitButtons)
    retry.classList.add('secondary-button')
    retry.setAttribute('href', parent.document.URL)

    return
}

function setupQuizInfo() {
    const redText = createElement("p", "Red Text", "self-centered", quizInfo)
    redText.classList.add("red-text")
    redText.style.display = "none"
    return
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

    option.addEventListener('click', () => {
        radio.checked = true;
    })

    parent.appendChild(option)
    return option
}
function createCheckbox(id, text, parent) {
    const option = document.createElement("div")
    const checkbox = document.createElement("input")
    const label = document.createElement("label")

    checkbox.setAttribute("type", "checkbox")
    checkbox.setAttribute("id", id)
    checkbox.setAttribute("value", id)
    checkbox.setAttribute("name", "answer")
    checkbox.classList.add('question-answer')

    label.setAttribute("for", id)
    label.innerText = text

    option.appendChild(checkbox)
    option.appendChild(label)
    option.classList.add('question-option')

    option.addEventListener('click', () => {
        checkbox.checked = true;
    })

    parent.appendChild(option)
    return option
}

async function loadImageAndToggleLoader() {
    if (game.data[game.playerData.question].image) {
        toggleLoader(false);
        const img = document.createElement('img');
        img.alt = "quiz image";
        img.width = 250;
        img.classList.add('self-centered');

        try {
            const response = await fetch(
                game.data[game.playerData.question].image
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const imgURL = response.url;
            img.src = imgURL;

            img.onload = () => {
                console.log("Image loaded successfully.");
                toggleLoader(true);
                quizWrapper.insertBefore(img, quizWrapper.children[1].nextSibling)
            };

            img.onerror = () => {
                console.error("Image failed to load.");
                toggleLoader(true);
            };

            // Append the image to the quiz wrapper
        } catch (error) {
            console.error("Image Error: ", error);
            toggleLoader(true);
        }
    }
}

function nextQuestion() {
    clearScreen()

    // Add Question Details
    createElement("h2", `Question ${game.playerData.question + 1}`, "self-centered", quizWrapper)
    createElement("h3", `${game.data[game.playerData.question].question}`, "self-centered", quizWrapper)

    // handle image loading
    if (game.data[game.playerData.question].image) loadImageAndToggleLoader();

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

    // Get Question Options Array
    const options = Object.values(game.data[game.playerData.question].options)

    // Create Answer Buttons
    switch (game.data[game.playerData.question].type) {
        case 'Checkbox':
            options.forEach((option, index) => createCheckbox(index + 1, option, questionForm))
            break;
        default:
            // Multiple Choice
            options.forEach((option, index) => createRadioButton(index + 1, option, questionForm))
            break;
    }

    // Add Submit Button, Append Form
    questionForm.appendChild(submitButton)
    questionForm.classList.add('quiz-form')
    quizWrapper.appendChild(questionForm)

    return
}

// LAUNCH CODE ================================================================

generateQuiz()
startQuizButton.addEventListener('click', startQuiz)
