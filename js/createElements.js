// CREATE ELEMENT FUNCTIONS ===================================================

export function createLink(text, link, classList) {
    if (!link) return;
    const anchor = document.createElement("a");
    anchor.innerText = text;
    anchor.setAttribute("href", link);
    anchor.classList.add(classList);
    anchor.classList.add("app-button");
    return anchor;
}

export function createNewElement(element, text, classList) {
    if (!element) return;
    const el = document.createElement(element);
    text && (el.innerText = text);
    classList && el.classList.add(classList);
    return el;
}

export function createSubmitButton(type, value, classList, onClick) {
    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.value = value
    input.classList.add(classList);
    input.classList.add("app-button");
    input.addEventListener("click", onClick);
    return input;
}

export function createButton(text, classList, onClick) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    if (!text || !classList || !onClick) return;
    button.innerText = text;
    button.classList.add("app-button");
    button.classList.add(classList);
    button.addEventListener("click", onClick);
    return button;
}

export function createRadioButton(id, text) {
    const option = document.createElement("div");
    const radio = document.createElement("input");
    const label = document.createElement("label");

    radio.setAttribute("type", "radio");
    radio.setAttribute("id", id);
    radio.setAttribute("value", id);
    radio.setAttribute("name", "answer");
    radio.classList.add("question-answer");

    label.setAttribute("for", id);
    label.innerText = text;

    option.appendChild(radio);
    option.appendChild(label);
    option.classList.add("question-option");

    radio.addEventListener("click", () => (radio.checked = true));
    label.addEventListener("click", () => (radio.checked = true));
    option.addEventListener("click", () => (radio.checked = true));

    return option;
}
export function createCheckbox(id, text, isChecked=false, isDisabled=false) {
    const option = document.createElement("div");
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);
    checkbox.setAttribute("value", id);
    checkbox.setAttribute("name", "answer");
    checkbox.classList.add("question-answer");

    label.setAttribute("for", id);
    label.innerText = text;

    option.appendChild(checkbox);
    option.appendChild(label);
    option.classList.add("question-option");

    if (isChecked) checkbox.checked = true
    if (isDisabled) checkbox.disabled = true
    checkbox.addEventListener("click", () => {
        checkbox.checked === false
            ? (checkbox.checked = true)
            : (checkbox.checked = false);
    });
    label.addEventListener("click", () => {
        checkbox.checked === false
            ? (checkbox.checked = true)
            : (checkbox.checked = false);
    });
    option.addEventListener("click", () => {
        checkbox.checked === false
            ? (checkbox.checked = true)
            : (checkbox.checked = false);
    });

    return option;
}
