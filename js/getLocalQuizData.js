export default function getLocalQuizData() {
    const quizData = []

    // Loop through local storage to get new quiz data. 
    // Starting at index 1 to get past weird header data
    for (let i = 0; i < localStorage.length; i++) {
        quizData.push(JSON.parse(localStorage.getItem(i)))
    }

    if (quizData[0] === null) quizData.splice(0,1)

    if (quizData.length < 1) {
        let demo = {}
        demo.id = "1"
        demo.name = "Demo Quiz"
        demo.link = "https://script.google.com/macros/s/AKfycbz9K0GOxVoz25ZkqnZLUF-GMRuodYvSlJYHOk7U2GczDeoda3UsFxoWcFGAL454gvQi/exec"
        demo.pass = 100
        quizData.push(demo)
    }
    return quizData
}
