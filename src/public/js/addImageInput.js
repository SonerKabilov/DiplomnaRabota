const addOptionButton = document.querySelector("#addOptionButton");
const addOptionDiv = document.querySelector(".addOption");
const imagesDiv = document.querySelector(".images");
const img = document.querySelectorAll(".img");
let imgLength = img.length;

addOptionButton.addEventListener("click", function () {
    imgLength++;
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("formInput", "img");

    const imageInputsDiv = document.createElement("div");
    imageInputsDiv.classList.add("imageInputsDiv");
    imageDiv.appendChild(imageInputsDiv);

    const inputSequence = document.createElement("input");
    inputSequence.classList.add("imageSequence");
    inputSequence.type = "text";
    inputSequence.name = "img[sequence]";
    inputSequence.disabled = true;
    inputSequence.value = imgLength;
    imageInputsDiv.appendChild(inputSequence);

    const inputUrl = document.createElement("input");
    inputUrl.classList.add("border-none");
    inputUrl.type = "file";
    inputUrl.name = "img[url]";
    inputUrl.accept = "image/*";
    imageInputsDiv.appendChild(inputUrl);

    const removeOption = document.createElement("button");
    removeOption.classList.add("remove");
    removeOption.type = "button";
    const removeOptionButtonText = document.createTextNode("Премахване");
    removeOption.appendChild(removeOptionButtonText);
    imageDiv.appendChild(removeOption);

    imagesDiv.insertBefore(imageDiv, addOptionDiv);

    removeOption.addEventListener("click", function () {
        imageDiv.remove();
        imgLength--;

        const sequenceInputs = document.querySelectorAll(".imageSequence");
        for (let i = 0; i < sequenceInputs.length; i++) {
            if (sequenceInputs[i].value != i + 1) {
                sequenceInputs[i].value = i + 1;
            }
        }
    });
});