const addOptionButton = document.querySelector("#addOptionButton");
const addOptionDiv = document.querySelector(".addOption");
const form = document.querySelector("#addForm");
const optionsDiv = document.querySelector(".options");

addOptionButton.addEventListener("click", function () {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("formInput", "option");

    const label = document.createElement("label");
    const optionText = document.createTextNode("Вариант ");
    label.appendChild(optionText);
    optionDiv.appendChild(label);

    const input = document.createElement("input");
    input.type="text";
    input.name="options";
    // input.id ="option" + optionNumber;
    optionDiv.appendChild(input);

    const removeOption = document.createElement("button");
    removeOption.classList.add("remove");
    removeOption.type = "button";
    const removeOptionButtonText = document.createTextNode("Премахване");
    removeOption.appendChild(removeOptionButtonText);
    optionDiv.appendChild(removeOption);

    optionsDiv.insertBefore(optionDiv, addOptionDiv);

    removeOption.addEventListener("click", function() {
        optionDiv.remove();
        // optionNumber--;
    });

    // optionNumber++;
});
