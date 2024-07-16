const hamburgerContainer = document.getElementsByClassName(
    "hamburger-container"
)[0];
const nav = document.getElementById("top-nav");

hamburgerContainer.addEventListener("click", hamburgerClick);

function hamburgerClick() {
    hamburgerContainer.classList.toggle("change");
    nav.classList.toggle("hide");
    nav.classList.toggle("hamburger-menu");
}
