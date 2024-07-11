const quizList = document.getElementById("quiz-list")

const getQuizzes = () => {
    // Get Data
    // ================================

    // Clear Quiz Data
    quizData = []

    // Loop through local storage to get new quiz data
    for (let i = 0; i < localStorage.length; i++) {
        quizData.push(JSON.parse(localStorage.getItem(i)))
    }
    
    // Create Button for each quiz
    // ================================

    // Safety: Exit function if no data
    if (quizData.length < 1) return
    
    // Create the buttons
    quizData.map((quiz)=>{
        const el = document.createElement('a')
        el.classList.add('app-button')
        el.classList.add('primary-button')
        if (quiz.name.length > 100) {
            el.textContent = quiz.name.slice(0,108) + "..."
        } else {
            el.textContent = quiz.name
        }
        // el.addEventListener('click',createQuiz)
        quizList.insertBefore(el,quizList.firstChild)
    })

}
getQuizzes()
