import getLocalQuizData from "./getLocalQuizData.js";

// VARIABLE BLOCK =============================================================

const quizList = document.getElementById("quiz-list");

// FUNCTION BLOCK =============================================================

function createQuizList() {
    const quizData = getLocalQuizData();
    if (!quizData || quizData.length < 1)
        throw new Error("No Quiz Data");
    try {
        // Sort data
        quizData.sort((a,b)=>b.name.localeCompare(a.name))
        // Create link elements from data
        quizData.map((quiz) => {
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
