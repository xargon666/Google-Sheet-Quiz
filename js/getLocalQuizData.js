export default function getLocalQuizData() {
    const quizData = [];
    // Loop through local storage to get new quiz data
    // This loop will only execute when localStorage is not empty
    let demoDataSaved = false
    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        
        switch (true) {
            case (item?.lastHeard):
                break;
            case (item?.id === "demo"):
                demoDataSaved = true
                break;
            default:
                quizData.push(item);
        }
    }
    // Remove Demo
    if (demoDataSaved) {
        localStorage.removeItem(localStorage.key("demo"))
    }
    // If nothing in list, add demo back
    if (quizData.length < 1 && !localStorage.getItem("demo")) {
        const demoData = {
            id: "demo",
            name: "Demo Quiz",
            link: "https://script.google.com/macros/s/AKfycbz9K0GOxVoz25ZkqnZLUF-GMRuodYvSlJYHOk7U2GczDeoda3UsFxoWcFGAL454gvQi/exec",
            pass: 75
        };
        localStorage.setItem("demo", JSON.stringify(demoData));
        demoDataSaved = true
        quizData.push(demoData);
    }
    return quizData;
}
