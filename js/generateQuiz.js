import {
    createButton,
    createCheckbox,
    createNewElement,
    createRadioButton,
    createSubmitButton,
    createLink,
} from "./createElements.js";
import getLocalQuizData from "./getLocalQuizData.js";

// VARIABLE BLOCK =============================================================
const loader = document.getElementById("loader-section");
const quizSection = document.getElementById("quiz-section");

const quizHead = document.getElementById("quiz-head");
const quizName = document.getElementById("quiz-name");
const quizPass = document.getElementById("quiz-pass");

const quizBody = document.getElementById("quiz-body");

// BUTTONS
const startQuizButton = document.getElementById("start-quiz-button");
const editQuizButton = document.getElementById("edit-quiz-button");
const deleteQuizButton = document.getElementById("delete-quiz-button");

// GAME
const game = {
    name: "",
    link: "",
    pass: "",
    data: {},
    playerData: {
        question: 0,
        score: 0,
        questionData: {
            question: 0,
            playerAnswer: [],
            correctAnswer: [],
            correct: Boolean,
        },
    },
};

// FUNCTION BLOCK =============================================================

function clearScreen() {
    while (quizHead.firstChild) {
        quizHead.removeChild(quizHead.firstChild);
    }
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    return;
}

function startQuiz() {
    quizSection.classList.remove("middle-screen");
    clearScreen();
    resetPlayerData();
    nextQuestion();
    return;
}

function handleReload() {
    alert("test1")
    location.reload();
    return 
}

function handleEditQuizSubmit(e) {
    e.preventDefault;
    alert("test2")
    return
}

function editQuiz() {
    quizSection.classList.remove("middle-screen");
    clearScreen();

    // Create Form
    const form = document.createElement("form");

    form.appendChild(
        createFormField(
            "text",
            "quiz-name",
            "quiz-name",
            "form-field",
            "Enter Name...",
            true
        )
    );
    form.appendChild(
        createFormField(
            "text",
            "quiz-link",
            "quiz-link",
            "form-field",
            "Enter Google Sheets Link...",
            true
        )
    );
    form.appendChild(
        createFormField(
            "number",
            "quiz-pass",
            "quiz-pass",
            "form-field",
            "Enter Google Sheets Link...",
            true,
            "85"
        )
    );

    const buttonGroup = createNewElement("div", "", "button-group");
    const submit = createSubmitButton(
        "submit",
        "Submit",
        "secondary-button",
        handleEditQuizSubmit
    );
    buttonGroup.appendChild(submit);
    const cancel = createButton("Cancel", "primary-button", handleReload);
    buttonGroup.appendChild(cancel);
    form.appendChild(buttonGroup);

    quizBody.appendChild(form);

    // Update Form Values
    console.log("updating form...");
    const formName = document.getElementById("quiz-name");
    const formLink = document.getElementById("quiz-link");
    const formPass = document.getElementById("quiz-pass");

    formName.value = game.name;
    formLink.value = game.link;
    formPass.value = game.pass;

    return;
}

function deleteQuiz() {
    clearScreen();
}

// CREATE FORM CREATE FORM CREATE FORM CREATE FORM CREATE FORM CREATE FORM
function createFormField(
    type,
    name,
    id,
    className,
    placeholder,
    required,
    value
) {
    // LABEL
    const label = document.createElement("label");
    label.setAttribute("for", name);
    let labelText = "";
    switch (name) {
        case "quiz-name":
            labelText = "Quiz Name";
            break;
        case "quiz-link":
            labelText = "Quiz Link";
            break;
        case "quiz-pass":
            labelText = "Pass";
            break;
    }
    label.innerText = labelText;

    // INPUT
    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("id", id);
    input.setAttribute("placeholder", placeholder);
    required && input.setAttribute("required", required);
    value && input.setAttribute("value", value);

    // COMBINE
    const field = document.createElement("div");
    field.classList.add(className);
    field.appendChild(label);
    field.appendChild(input);

    return field;
}

function lookupSelectedQuizData(quizID) {
    const localQuizData = getLocalQuizData();
    const targetQuizData = localQuizData.find((quiz) => quiz.id === quizID);
    return targetQuizData;
}

function resetPlayerData() {
    game.playerData = {
        question: 0,
        score: 0,
        questionData: {
            question: 0,
            playerAnswer: [],
            correctAnswer: [],
            correct: Boolean,
        },
    };
    return;
}

function toggleLoader(toggle) {
    if (toggle) {
        loader.style.display = "none";
        quizSection.style.display = "flex";
    } else {
        loader.style.display = "flex";
        quizSection.style.display = "none";
    }
}

function generateQuiz() {
    const quiz = lookupSelectedQuizData(quizID);
    console.log("quiz lookup", quiz);
    if (!quiz) return;

    fetch(`${quiz.link}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Network response was not ok " + response.statusText
                );
            }
            return response.json();
        })
        .then((data) => {
            game.data = data;
            toggleLoader(true);
            if (game.data.length > 0) {
                game.name = quiz.name;
                game.link = quiz.link;
                game.pass = quiz.pass;
                quizName.textContent = game.name;
                quizPass.textContent = `The passing grade on this quiz is ${game.pass}%`;
                // convert answers to string array
                for (let i = 0; i < Object.keys(game.data).length; i++) {
                    // Validate points
                    if (!game.data[i].points) {
                        game.data[i].points = 1;
                    } else {
                        game.data[i].points = Number(game.data[i].points);
                    }
                    // Build Answers Array
                    let newAnswer = [];
                    let string = String(game.data[i].answer);
                    string.includes(",")
                        ? (newAnswer = string.split(","))
                        : newAnswer.push(string);
                    game.data[i].answer = newAnswer.map(Number);
                }
            }
        })
        .catch((error) => {
            // Handle the error here
            console.error("Error fetching the quiz data:", error);
            return;
        });
}

function submitAnswer(e) {
    e.preventDefault();

    // Remove Error Text
    const redText = document.getElementById("red-text");
    if (redText) redText.innerText = "";

    // Add selected answers to array
    let selectedAnswers = [];
    const answers = document.getElementsByName("answer");
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked === true) {
            selectedAnswers.push(Number(answers[i].value));
        }
    }

    // Prevent form submission without selection
    if (selectedAnswers.length === 0) {
        redText.textContent = "Please select an answer to continue";
        return;
    }

    // Confirm if answer is correct
    const currentQuestion = game.playerData.question;
    const questionAnswer = game.data[currentQuestion].answer;

    // Check Answers
    let answerCorrect = true;
    for (let i = 0; i < questionAnswer.length; i++) {
        if (!selectedAnswers.includes(questionAnswer[i])) answerCorrect = false;
    }

    // Add Points
    if (answerCorrect)
        game.playerData.score += game.data[currentQuestion].points;

    // Check if end of quiz or proceed to next question
    if (
        game.playerData.question + 1 === Object.keys(game.data).length &&
        selectedAnswers
    ) {
        // End of Quiz
        endQuiz();
    } else {
        // Next Question
        game.playerData.question++;
        nextQuestion();
    }
    return;
}

function endQuiz() {
    // clear quiz elements
    clearScreen();

    // position elements in middle of screen
    quizSection.classList.add("middle-screen");

    // Clear Question Count
    const quizProgress = document.getElementById("question-number");
    if (quizProgress) quizProgress.innerText = "";

    // Calc Max Score
    let maxScore = 0;
    for (let i = 0; i < Object.keys(game.data).length; i++) {
        maxScore += game.data[i].points;
    }

    // Create Elements
    quizHead.appendChild(
        createNewElement(
            "h3",
            `Final Score: ${game.playerData.score}/${maxScore}`,
            "self-centered"
        )
    );

    const outcomeMessage = createNewElement(
        "h2",
        "Quiz Outcome Text",
        "self-centered"
    );
    quizHead.appendChild(outcomeMessage);

    // Determine Quiz Result
    if (game.playerData.score === maxScore) {
        outcomeMessage.textContent = "Congratulations!";
        outcomeMessage.classList.add("rainbow");
    } else {
        outcomeMessage.textContent = "Better luck next time";
    }

    // Add Exit/Retry Buttons
    const exitButtons = createNewElement("div", "", "button-group");
    quizBody.appendChild(exitButtons);

    exitButtons.appendChild(
        createButton("Try Again", "secondary-button", startQuiz)
    );

    const exit = createNewElement("a", "Return to List", "app-button");
    exit.classList.add("primary-button");
    exit.setAttribute("href", "quizList.html");
    exitButtons.appendChild(exit);

    return;
}

// HANDLE IMAGE LOAD

async function loadImageAndToggleLoader(parent) {
    if (game.data[game.playerData.question].image) {
        toggleLoader(false);
        const img = document.createElement("img");
        img.alt = "quiz image";
        img.width = 200;
        img.classList.add("self-centered");

        try {
            const response = await fetch(
                game.data[game.playerData.question].image
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const imgURL = response.url;
            img.src = imgURL;

            img.onload = () => {
                console.log("Image loaded successfully.");
                toggleLoader(true);
                parent.insertBefore(img, parent.children[1].nextSibling);
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
    clearScreen();

    const currentQuestionNumber = game.playerData.question + 1;
    const totalQuestionCount = Object.keys(game.data).length;

    // Add Question Details
    quizHead.appendChild(
        createNewElement(
            "h2",
            `Question ${currentQuestionNumber}`,
            "self-centered"
        )
    );
    quizHead.appendChild(
        createNewElement(
            "h3",
            `${game.data[game.playerData.question].question}`,
            "self-centered",
            quizHead
        )
    );
    // Update Quiz Progress Counter
    const quizProgress = document.getElementById("question-number");
    if (quizProgress)
        quizProgress.innerText = `${currentQuestionNumber}/${totalQuestionCount}`;

    // handle image loading
    if (game.data[game.playerData.question].image)
        loadImageAndToggleLoader(quizHead);

    // Create Form
    const questionForm = document.createElement("form");
    questionForm.addEventListener("submit", submitAnswer);

    // Create Form Submit Button
    const submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "Submit");
    submitButton.setAttribute("id", "submit-answer-button");
    submitButton.classList.add("app-button");
    submitButton.classList.add("secondary-button");

    // Get Question Options Array
    const options = Object.values(game.data[game.playerData.question].options);

    // Create Answer Buttons
    switch (game.data[game.playerData.question].type) {
        case "Checkbox":
            options.forEach((option, index) =>
                questionForm.appendChild(createCheckbox(index + 1, option))
            );
            break;
        case "Multiple Choice":
            options.forEach((option, index) =>
                questionForm.appendChild(createRadioButton(index + 1, option))
            );
            break;
    }

    // Add Submit Button, Append Form
    questionForm.appendChild(submitButton);
    questionForm.classList.add("quiz-form");
    quizBody.appendChild(questionForm);

    return;
}

// ADD EVENT LISTENERS
startQuizButton.addEventListener("click", startQuiz);
editQuizButton.addEventListener("click", editQuiz);
deleteQuizButton.addEventListener("click", deleteQuiz);

// LAUNCH CODE ================================================================

const idIndex = parent.document.URL.indexOf("?");
const idLen = parent.document.URL.length;
const quizID = parent.document.URL.substring(idIndex + 1, idLen);

generateQuiz();
