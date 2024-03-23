const optionTypes = document.querySelector("#optionTypes");

optionTypes.addEventListener("change", function() {
    if(optionTypes.value === "1" || optionTypes.value === "2") {
        optionsDiv.classList.remove("hidden");
    } else {
        optionsDiv.classList.add("hidden");
    }
})