export default function getLocalQuizData() {
    const quizData = [];

    // Loop through local storage to get new quiz data
    // This loop will only execute when localStorage is not empty
    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        // Ignore Init Item
        if (item?.lastHeard) {
            continue;
        // Remove Demo Quiz
        } else if (item?.id === "demo") {
            localStorage.removeItem(localStorage.key(i))
        } else {
            quizData.push(item);
        }
    }

    // Add Demo Quiz if nothing in list
    if (quizData.length < 1 && !localStorage.getItem("demo")) {
        const demo = {
            id: "demo",
            name: "Demo Quiz",
            link: "https://script.google.com/macros/s/AKfycbz9K0GOxVoz25ZkqnZLUF-GMRuodYvSlJYHOk7U2GczDeoda3UsFxoWcFGAL454gvQi/exec",
            pass: 75
        };
        localStorage.setItem("demo", JSON.stringify(demo));
        quizData.push(demo);
    }
    return quizData;
}
