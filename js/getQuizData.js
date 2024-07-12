export let quizData = []
export function getQuizData() {
    // Clear Quiz Data
    quizData = []
    // Loop through local storage to get new quiz data
    for (let i = 1; i < localStorage.length; i++) {
        quizData.push(JSON.parse(localStorage.getItem(i)))
    }
}
