// VARIABLE BLOCK =============================================================

const quizForm = document.getElementById("add-quiz-form")

// FUNCTION BLOCK =============================================================

export function getFormData() {
    const formName = document.getElementById("quiz-name")
    const formLink = document.getElementById("quiz-link")
    const formPass = document.getElementById("quiz-pass")
    let formData = {}
    if (
        formName.value
        && formLink.value
        && formPass.value
    ) {
        formData = {
            name: formName.value,
            link: formLink.value,
            pass: formPass.value
        }
    }
    return formData
}

function submitQuiz(e) {
    e.preventDefault()
    const newQuizData = getFormData()
    // Generate Unique ID
    const UUID = crypto.randomUUID();
    newQuizData.id = UUID

    // QC Data
    // Need to fetch data from link and check it isn't garbage here

    // Submit Data to Local Storage
    localStorage.setItem(localStorage.length, JSON.stringify(newQuizData))
    console.log(localStorage)

    // Return to Quiz List page
    window.location.href = "./quizList.html"

    return
}

// LAUNCH CODE ================================================================

quizForm.addEventListener("submit", submitQuiz)
