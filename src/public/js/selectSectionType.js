const sectionTypes = document.querySelector("#sectionTypes");
const freeSectionDescriptionDiv = document.querySelector("#freeSectionDescriptionDiv");
const premiumSectionsDiv = document.querySelector("#premiumSectionsDiv");
const form = document.querySelector("#addForm");

createFreeExerciseDescriptionDivContent();

sectionTypes.addEventListener("change", function() {
    let labelForPremiumSections = document.querySelector("#labelForPremiumSections");
    let storymodeButton = document.querySelector("#storymode");
    let testButton = document.querySelector("#test");
    let inputHidden = document.querySelector("#inputHidden");

    if(sectionTypes.value === "free") {
        if(storymodeButton && testButton) {
            premiumSectionsDiv.removeChild(labelForPremiumSections);
            premiumSectionsDiv.removeChild(storymodeButton);
            premiumSectionsDiv.removeChild(testButton);
            premiumSectionsDiv.removeChild(inputHidden);
        }
    } else if (sectionTypes.value === "premium") {
        if (!storymodeButton && !testButton && !inputHidden) {
            createPremiumSectionsDivContent();
        }
    }
});

form.addEventListener("click", function(event) {
    const premiumSectionsButtons = document.querySelectorAll(".premiumSectionsButton");
    const target = event.target.closest('.premiumSectionsButton');

    if (target) {
        // Check if the clicked button is already selected
        const isSelected = target.classList.contains('selected');

        // If it's not selected, remove 'selected' class from all flagButtons and add it to the clicked button
        if (!isSelected) {
            for (const btn of premiumSectionsButtons) {
                btn.classList.remove('selected');
            }

            // addButton.classList.remove('disabled');
            target.classList.add('selected');
        } else {
            // If it's already selected, toggle 'selected' class off
            // addButton.classList.add('disabled');
            target.classList.remove('selected');
        }

        const targetId = target.id;
        document.querySelector('#inputHidden').value = isSelected ? "" : targetId;
    }
});


function createFreeExerciseDescriptionDivContent() {
    labelForDescription = document.createElement("label");
    labelForDescription.htmlFor = "description";
    labelForDescription.textContent = "Описание";
    labelForDescription.id = "labelForDescription";
    freeSectionDescriptionDiv.appendChild(labelForDescription);

    inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "description";
    inputDescription.id = "description";

    freeSectionDescriptionDiv.appendChild(inputDescription);
}

function createPremiumSectionsDivContent() {
    labelForPremiumSections = document.createElement("span");
    labelForPremiumSections.textContent = "Платени раздели:";
    labelForPremiumSections.id = "labelForPremiumSections";
    premiumSectionsDiv.appendChild(labelForPremiumSections);

    storymodeButton = document.createElement("button");
    storymodeButton.id = "storymode";
    storymodeButton.type = "button";
    storymodeButton.textContent = "Истории";
    storymodeButton.classList.add("premiumSectionsButton");
    premiumSectionsDiv.appendChild(storymodeButton);
    
    testButton = document.createElement("button");
    testButton.id = "test";
    testButton.type = "button";
    testButton.textContent = "testButton";
    testButton.classList.add("premiumSectionsButton");
    premiumSectionsDiv.appendChild(testButton);

    inputHidden = document.createElement("input");
    inputHidden.id = "inputHidden";
    inputHidden.type = "hidden";
    inputHidden.name = "premiumSection";
    premiumSectionsDiv.appendChild(inputHidden);
}