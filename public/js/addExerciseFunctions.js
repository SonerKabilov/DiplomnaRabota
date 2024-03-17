const addOptionButton = document.querySelector("#addOptionButton");
const addOptionDiv = document.querySelector(".addOption");
const form = document.querySelector("#addLessonForm");
const optionTypes = document.querySelector("#optionTypes");
let optionNumber = document.currentScript.getAttribute("optionNumber");

optionTypes.addEventListener("change", function() {
    const options = document.querySelectorAll(".option");
    
    if(optionTypes.value === "multiple_choice" || optionTypes.value === "make_sentence") {
        for (let option of options) {
            option.classList.remove("hidden");
            addOptionDiv.classList.remove("hidden");
        }
    } else {
        for (let option of options) {
            option.classList.add("hidden");
            addOptionDiv.classList.add("hidden");
        }
    }
})

addOptionButton.addEventListener("click", function () { 
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("formInput");

    const label = document.createElement("label");
    const optionText = document.createTextNode("Вариант " + optionNumber);
    label.appendChild(optionText);
    optionDiv.appendChild(label);

    const input = document.createElement("input");
    optionDiv.appendChild(input);

    const removeOption = document.createElement("button");
    removeOption.classList.add("removeOptionButton");
    removeOption.type = "button";
    const removeOptionButtonText = document.createTextNode("Премахване");
    removeOption.appendChild(removeOptionButtonText);
    optionDiv.appendChild(removeOption);

    form.insertBefore(optionDiv, addOptionDiv);

    removeOption.addEventListener("click", function() {
        optionDiv.remove();
        optionNumber--;
    });

    optionNumber++;
});
