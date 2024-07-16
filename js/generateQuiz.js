import {
    createButton,
    createCheckbox,
    createLink,
    createNewElement,
    createRadioButton,
    createSubmitButton,
} from "./createElements.js";
import getLocalQuizData from "./getLocalQuizData.js";

// *****************************************************************************
// VARIABLE BLOCK 
// *****************************************************************************
const loader = document.getElementById("loader-section");
const quizSection = document.getElementById("quiz-section");

const quizHead = document.getElementById("quiz-head");
const quizBody = document.getElementById("quiz-body");

const idIndex = parent.document.URL.indexOf("?");
const idLen = parent.document.URL.length;
const quizID = parent.document.URL.substring(idIndex + 1, idLen);

// GAME DATA
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

// *****************************************************************************
// FUNCTION BLOCK 
// *****************************************************************************
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
    location.reload();
    return;
}

// RESET PLAYER DATA
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
// ============================================================================== 
// CRUD FUNCTIONS
// ============================================================================== 
// HANDLE EDIT QUIZ
function handleEditQuizSubmit(e) {
    e.preventDefault();
    const formName = document.getElementById("quiz-name").value;
    const formLink = document.getElementById("quiz-link").value;
    const formPass = document.getElementById("quiz-pass").value;

    const updatedQuizData = {
        id: quizID,
        name: formName,
        link: formLink,
        pass: formPass,
    };

    // Find Target
    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(i));
        if (item === null) continue;
        if (item.id === quizID)
            localStorage.setItem(i, JSON.stringify(updatedQuizData));
    }
    handleReload();
    return;
}

// LOAD EDIT QUIZ SCREEN
function editQuizScreen() {
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

    const cancel = createButton("Cancel", "primary-button", createStartScreen);
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

// HANDLE DELETE
function handleDelete() {
    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (!item) continue;
        if (item.id === "demo") alert("The demo quiz can never be deleted!");
        if (item.id === quizID) {
            localStorage.removeItem(localStorage.key(i));
            location.href = "quizList.html";
            break;
        }
    }
    return;
}

// LOAD DELETE QUIZ SCREEN
function deleteQuizScreen() {
    clearScreen();
    quizHead.appendChild(
        createNewElement("h2", `Delete ${game.name}`, "red-text")
    );
    quizHead.appendChild(createNewElement("h3", "Are you sure?", ""));
    const buttonGroup = createNewElement("div", "", "button-group");
    buttonGroup.appendChild(
        createButton("Delete", "primary-button", handleDelete)
    );
    buttonGroup.appendChild(
        createButton("Cancel", "secondary-button", createStartScreen)
    );
    quizBody.appendChild(buttonGroup);
}

// CREATE FORM FIELD 
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

// LOADING SCREEN
function toggleLoader(toggle) {
    if (toggle) {
        loader.style.display = "none";
        quizSection.style.display = "flex";
    } else {
        loader.style.display = "flex";
        quizSection.style.display = "none";
    }
    return
}


// FETCH QUIZ DATA
async function generateQuiz() {
    const localQuizData = getLocalQuizData();
    const quiz = localQuizData.find((quiz) => quiz.id === quizID);
    if (!quiz) return;
    game.name = quiz.name;
    game.link = quiz.link;
    game.pass = quiz.pass;

    const response = await fetch(`${quiz.link}`)
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Bad Response: ${response.statusText}\n Response Code: ${response.status}`
                );
            return response.json();
        })
        .then((data) => data)
        .catch((error) => {
            console.error("Fetch Error", error);
            return {};
        });

    if (response) {
        game.data = response;
        toggleLoader(true);
        if (game.data.length > 0) {
            // convert answers to string array
            for (let i = 0; i < Object.keys(game.data).length; i++) {
                // Update points
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
    }
    return
}

// CREATE START SCREEN
function createStartScreen() {
    clearScreen();
    const quizDataMissing = Object.keys(game.data).length === 0;
    quizSection.classList.add("middle-screen");
    // QUIZ HEAD
    quizHead.appendChild(
        createNewElement(
            "h2",
            quizDataMissing ? `Quiz Data Missing!\n ${game.name}` : game.name,
            quizDataMissing ? "red-text" : ""
        )
    );
    quizHead.appendChild(
        createNewElement(
            "p",
            quizDataMissing
                ? "Select Edit Quiz to fix the quiz link or select Delete Quiz to remove this entry."
                : `The passing grade on this quiz is ${game.pass}%`,
            ""
        )
    );

    // QUIZ BODY
    const buttonGroup = createNewElement("div", "", "button-group");
    !quizDataMissing &&
        buttonGroup.appendChild(
            createButton("Start Quiz", "secondary-button", startQuiz)
        );
    buttonGroup.appendChild(
        createButton(
            "Edit Quiz",
            quizDataMissing ? "secondary-button" : "primary-button",
            editQuizScreen
        )
    );
    buttonGroup.appendChild(
        createButton("Delete Quiz", "primary-button", deleteQuizScreen)
    );
    buttonGroup.appendChild(
        createLink("Cancel", "quizList.html", "primary-button")
    );

    quizBody.appendChild(buttonGroup);
    return;
}

// ============================================================================*
// QUIZ LOGIC
// ============================================================================*
// SUBMIT QUESTION ANSWER
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

// END QUIZ
function endQuiz() {
    // clear quiz elements
    clearScreen();

    // position elements in middle of screen
    quizSection.classList.add("middle-screen");

    // Clear Question Count
    const quizProgress = document.getElementById("question-number");
    if (quizProgress) quizProgress.innerText = "";

    // Calc Max Score & Passing Score
    let maxScore = 0;
    for (let i = 0; i < Object.keys(game.data).length; i++)
        maxScore += game.data[i].points;
    const passingScore = Math.floor(maxScore * (game.pass / 100));

    // Final Score Text
    quizHead.appendChild(
        createNewElement(
            "h3",
            `Final Score: ${game.playerData.score}/${maxScore}`,
            "self-centered"
        )
    );

    // Passing Grade Text
    quizHead.appendChild(
        createNewElement(
            "h3",
            `Passing Score: ${passingScore} (${game.pass}%)`,
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
        outcomeMessage.textContent = "Incredible!\nMaximum Score!";
        outcomeMessage.classList.add("rainbow");
    } else if (game.playerData.score >= passingScore) {
        outcomeMessage.textContent = "Congratulations!";
        outcomeMessage.classList.add("green-text");
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
    // Brutal code to engage loader while loading large images
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
    return;
}

// NEXT QUESTION
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
    questionForm.classList.add("quiz-form");
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
// *****************************************************************************
// LAUNCH CODE 
// *****************************************************************************
await generateQuiz();
createStartScreen();
