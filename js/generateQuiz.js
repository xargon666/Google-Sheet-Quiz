import { getQuizData, quizData } from '../js/getQuizData.js'

// VARIABLE BLOCK =============================================================
const loader = document.getElementById('loader-section')
const quizWrapper = document.getElementById('quiz-wrapper')
const quizHead = document.getElementById('quiz-head')
const quizSection = document.getElementById('quiz-section')
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

// FUNCTION BLOCK =============================================================

function resetPlayerData() {
    game.playerData = {
        question: 0,
        score: 0,
        questionData: {
            question: 0,
            playerAnswer: [],
            correctAnswer: [],
            correct: Boolean
        }
    }
    return 
}

function toggleLoader(toggle) {
    if (toggle) {
        loader.style.display = "none"
        quizSection.style.display = "flex"
    } else {
        loader.style.display = "flex"
        quizSection.style.display = "none"
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
            console.error('Error fetching the quiz data:', error);
        });
}

function startQuiz() {
    quizSection.classList.remove('middle-screen')
    resetPlayerData()
    nextQuestion()
}

function clearScreen() {
    while (quizHead.firstChild) {
        quizHead.removeChild(quizHead.firstChild)
    }
    quizWrapper.removeChild(quizWrapper.lastChild)
}

function submitAnswer(e) {
    e.preventDefault()

    // Remove Error Text
    const redText = document.getElementById('red-text')
    if (redText) redText.innerText = ""

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
    // clear quiz elements
    clearScreen()

    // position elements in middle of screen
    quizSection.classList.add('middle-screen')

    // Clear Question Count
    const quizProgress = document.getElementById('question-number')
    if (quizProgress) quizProgress.innerText = ""

    // Calc Max Score
    let maxScore = 0
    for (let i = 0; i < Object.keys(game.data).length; i++) {
        maxScore += game.data[i].points
    }

    // Create Elements
    createElement(
        'h3',
        `Final Score: ${game.playerData.score}/${maxScore}`,
        'self-centered',
        quizHead
    )
    const outcomeMessage = createElement(
        'h2',
        "Quiz Outcome Text",
        "self-centered",
        quizHead
    )

    // Determine Quiz Result
    if (game.playerData.score === maxScore) {
        outcomeMessage.textContent = "Congratulations!"
        outcomeMessage.classList.add('rainbow')
    } else {
        outcomeMessage.textContent = "Better luck next time"
    }

    // Add Exit/Retry Buttons
    const exitButtons = createElement("div", "", "button-group", quizWrapper)

    const retry = createElement("button", "Try Again", "app-button", exitButtons)
    retry.classList.add('secondary-button')
    retry.addEventListener('click',startQuiz)

    const exit = createElement("a", "Return to List", "app-button", exitButtons)
    exit.classList.add('primary-button')
    exit.setAttribute('href', 'quizList.html')

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

    radio.addEventListener('click', () => radio.checked = true)
    label.addEventListener('click', () => radio.checked = true)
    option.addEventListener('click', () => radio.checked = true)

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

    checkbox.addEventListener('click', () => {
        checkbox.checked === false
            ? checkbox.checked = true
            : checkbox.checked = false
    })
    label.addEventListener('click', () => {
        checkbox.checked === false
            ? checkbox.checked = true
            : checkbox.checked = false
    })
    option.addEventListener('click', () => {
        checkbox.checked === false
            ? checkbox.checked = true
            : checkbox.checked = false
    })

    parent.appendChild(option)
    return option
}

async function loadImageAndToggleLoader(parent) {
    if (game.data[game.playerData.question].image) {
        toggleLoader(false);
        const img = document.createElement('img');
        img.alt = "quiz image";
        img.width = 200;
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
                parent.insertBefore(img, parent.children[1].nextSibling)
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

    const currentQuestionNumber = game.playerData.question + 1
    const totalQuestionCount = Object.keys(game.data).length

    // Add Question Details
    createElement("h2", `Question ${currentQuestionNumber}`, "self-centered", quizHead)
    createElement("h3", `${game.data[game.playerData.question].question}`, "self-centered", quizHead)

    // Update Quiz Progress Counter
    const quizProgress = document.getElementById('question-number')
    if (quizProgress) quizProgress.innerText = `${currentQuestionNumber}/${totalQuestionCount}`

    // handle image loading
    if (game.data[game.playerData.question].image) loadImageAndToggleLoader(quizHead);

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

startQuizButton.addEventListener('click', startQuiz)

generateQuiz()
