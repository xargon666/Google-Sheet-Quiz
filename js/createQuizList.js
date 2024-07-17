import getLocalQuizData from "./getLocalQuizData.js";

// VARIABLE BLOCK =============================================================

const quizList = document.getElementById("quiz-list");

// FUNCTION BLOCK =============================================================

function createQuizList() {
    console.log("Pulling Quiz Data...")
    const quizData = getLocalQuizData();
    console.log("Quiz Data Pulled: ",quizData)
    if (!quizData || quizData.length < 1)
        throw new Error("Error", "No Quiz Data");
    try {
        quizData.map((quiz) => {
            console.log("Creating quiz list...")
            // Create Buttons
            const el = document.createElement("a");
            el.classList.add("app-button");
            el.classList.add("primary-button");
            if (quiz.name.length > 100) {
                el.textContent = quiz.name.slice(0, 108) + "...";
            } else {
                el.textContent = quiz.name;
            }
            el.addEventListener("click", () => goToQuiz(quiz.id));
            quizList.insertBefore(el, quizList.firstChild);
        });
    } catch (e) {
        console.error(e)
    }
    return
}

function goToQuiz(id) {
    return window.location.href = `./quiz.html?${id}`;
}

// EXECUTE CODE

createQuizList();
