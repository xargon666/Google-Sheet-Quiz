const instructions = document.getElementById("instructions");
instructions.addEventListener("click", toggleBalloon);

export function toggleBalloon() {
    if (instructions.className.includes("mini")) {
        instructions.classList.remove("mini");
        instructions.classList.add("maxi");
    } else {
        instructions.classList.remove("maxi");
        instructions.classList.add("mini");
    }
}
