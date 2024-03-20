const addOptionButton = document.querySelector("#addOptionButton");
const addOptionDiv = document.querySelector(".addOption");
const form = document.querySelector("#addForm");
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
    console.log(addOptionDiv)
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("formInput", "option");

    const label = document.createElement("label");
    const optionText = document.createTextNode("Вариант " + optionNumber);
    label.appendChild(optionText);
    optionDiv.appendChild(label);

    const input = document.createElement("input");
    input.type="text";
    input.name="option";
    input.id ="option" + optionNumber;
    optionDiv.appendChild(input);

    const removeOption = document.createElement("button");
    removeOption.classList.add("remove");
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
