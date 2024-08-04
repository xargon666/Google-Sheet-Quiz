const demoData = {
    id: "demo",
    name: "Demo Quiz",
    link: "https://script.google.com/macros/s/AKfycbz9K0GOxVoz25ZkqnZLUF-GMRuodYvSlJYHOk7U2GczDeoda3UsFxoWcFGAL454gvQi/exec",
    pass: 75,
};
import config from "./config";
export default function getLocalQuizData() {
    const quizData = [];
    let demoDataSaved = false;
    // Loop through local storage to get new quiz data
    // This loop will only execute when localStorage is not empty

    // Devmode - Caution! This will clear localStorage
    if (config.ENVIRONMENT === 'development') {
        for(let i = 0 ; i < localStorage.length; i++){
            localStorage.removeItem(localStorage.getItem(localStorage.key(i)))
        }
        localStorage.setItem("demo", JSON.stringify(demoData));
        quizData.push(demoData);
        return quizData
    }

    for (let i = 0; i < localStorage.length; i++) {
        const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
        switch (localStorage.key(i)) {
            case "scribe_extension_state":
                break;
            case "demo":
                demoDataSaved = true;
                break;
            default:
                quizData.push(item);
        }
    }
    // Remove Demo
    if (demoDataSaved) localStorage.removeItem("demo");
    // If nothing in list, add demo back
    if (quizData.length < 1 && !localStorage.getItem("demo")) {
        localStorage.setItem("demo", JSON.stringify(demoData));
        demoDataSaved = true;
        quizData.push(demoData);
    }
    return quizData;
}

