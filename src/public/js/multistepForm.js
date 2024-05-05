document.addEventListener("DOMContentLoaded", function() {
    const steps = document.querySelectorAll(".step");
    let currentStep = 0;
    
    const main = document.querySelector(".sign");
    const bottomBackground = document.createElement("div");
    main.appendChild(bottomBackground);

    function showStep(stepIndex) {
        

        for (let i = 0; i < steps.length; i++) {
            if (i === stepIndex) {
                steps[i].style.display = "block";
            } else {
                steps[i].style.display = "none";
            }

            if (currentStep === steps.length - 1) {
                bottomBackground.classList.add("bottomBackground");
                bottomBackground.classList.remove("displayNone");
            }

            if (currentStep !== steps.length - 1) {
                bottomBackground.classList.add("displayNone");
            }
        }
    }

    function handleNext() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function handlePrevious() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function init() {
        showStep(currentStep);
        document.querySelector(".nextBtn").addEventListener("click", handleNext);
        document.querySelector(".prevBtn").addEventListener("click", handlePrevious);
    }

    init();
});