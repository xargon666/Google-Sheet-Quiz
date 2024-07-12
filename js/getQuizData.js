export let quizData = []
export function getQuizData() {
    // Clear Quiz Data
    quizData = []
    // Loop through local storage to get new quiz data
    for (let i = 1; i < localStorage.length; i++) {
        quizData.push(JSON.parse(localStorage.getItem(i)))
    }
    if (quizData.length < 1) {
        let demo = {}
        demo.id = 1
        demo.name = "Demo Quiz"
        demo.link = "https://script.google.com/macros/s/AKfycbz9K0GOxVoz25ZkqnZLUF-GMRuodYvSlJYHOk7U2GczDeoda3UsFxoWcFGAL454gvQi/exec"
        demo.pass = 100
        console.log(demo)
        quizData.push(demo)
    }
}
