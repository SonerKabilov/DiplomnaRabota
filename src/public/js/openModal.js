/* OPEN FLASHCARD CATEGORY MODAL */
function createModalForFlashcardCategories(header, formAction, buttonTxt, buttonClass, categoryTitle) {
    const addModalDiv = document.createElement("div");
    addModalDiv.classList.add("modal");

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    addModalDiv.appendChild(modalContentDiv);

    const closeSpan = document.createElement("span");
    closeSpan.classList.add("close");
    modalContentDiv.appendChild(closeSpan);
    closeSpan.textContent = "×";

    const addForm = document.createElement("form");
    addForm.action = formAction;
    addForm.method = "POST";
    modalContentDiv.appendChild(addForm);

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = header;
    modalHeader.classList.add("modalHeader");
    addForm.appendChild(modalHeader);

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("modalInputDiv");
    addForm.appendChild(inputDiv);

    const txt = document.createElement("p");
    txt.textContent = "Заглавие на категория:";
    inputDiv.appendChild(txt);

    const input = document.createElement("input");
    input.type = "text";
    input.name = "categoryTitle";
    input.value = categoryTitle;
    input.classList.add("modalInput");
    inputDiv.appendChild(input);

    const modalBtnsDiv = document.createElement("div");
    modalBtnsDiv.classList.add("modalBtnsDiv");
    addForm.appendChild(modalBtnsDiv);

    const addBtn = document.createElement("button");
    addBtn.textContent = buttonTxt;
    addBtn.classList.add(buttonClass);
    modalBtnsDiv.appendChild(addBtn);

    document.body.appendChild(addModalDiv);

    addModalDiv.style.display = "block";
    addModalDiv.classList.add("fade-in");

    closeSpan.addEventListener("click", function () {
        addModalDiv.remove(); // Remove modal when close button is clicked
    });

    window.addEventListener('click', function (event) {
        if (event.target == addModalDiv) {
            addModalDiv.style.display = "none";
            addModalDiv.classList.remove("fade-in");
        }
    });
}

function createModalForFlashcards(header, formAction, buttonTxt, buttonClass, question, answer) {
    const addModalDiv = document.createElement("div");
    addModalDiv.classList.add("modal");

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    addModalDiv.appendChild(modalContentDiv);

    const closeSpan = document.createElement("span");
    closeSpan.classList.add("close");
    modalContentDiv.appendChild(closeSpan);
    closeSpan.textContent = "×";

    const addForm = document.createElement("form");
    addForm.action = formAction;
    addForm.method = "POST";
    modalContentDiv.appendChild(addForm);

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = header;
    modalHeader.classList.add("modalHeader");
    addForm.appendChild(modalHeader);

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("modalInputDiv");
    addForm.appendChild(inputDiv);

    const txtQuestion = document.createElement("p");
    txtQuestion.textContent = "Въпрос:";
    inputDiv.appendChild(txtQuestion);

    const inputQuestion = document.createElement("input");
    inputQuestion.type = "text";
    inputQuestion.name = "question";
    inputQuestion.value = question;
    inputQuestion.classList.add("modalInput");
    inputDiv.appendChild(inputQuestion);

    const txtAnswer = document.createElement("p");
    txtAnswer.textContent = "Отговор:";
    inputDiv.appendChild(txtAnswer);

    const inputAnswer = document.createElement("input");
    inputAnswer.type = "text";
    inputAnswer.name = "answer";
    inputAnswer.value = answer;
    inputAnswer.classList.add("modalInput");
    inputDiv.appendChild(inputAnswer);

    const modalBtnsDiv = document.createElement("div");
    modalBtnsDiv.classList.add("modalBtnsDiv");
    addForm.appendChild(modalBtnsDiv);

    const addBtn = document.createElement("button");
    addBtn.textContent = buttonTxt;
    addBtn.classList.add(buttonClass);
    modalBtnsDiv.appendChild(addBtn);

    document.body.appendChild(addModalDiv);

    addModalDiv.style.display = "block";
    addModalDiv.classList.add("fade-in");

    closeSpan.addEventListener("click", function () {
        addModalDiv.remove(); // Remove modal when close button is clicked
    });

    window.addEventListener('click', function (event) {
        if (event.target == addModalDiv) {
            addModalDiv.style.display = "none";
            addModalDiv.classList.remove("fade-in");
        }
    });
}

/* OPEN DELETE CONFIRMATION MODAL */
function createDeleteModal(formAction) {
    const deleteModalDiv = document.createElement("div");
    deleteModalDiv.classList.add("modal");

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    deleteModalDiv.appendChild(modalContentDiv);

    const closeSpan = document.createElement("span");
    closeSpan.classList.add("close");
    modalContentDiv.appendChild(closeSpan);
    closeSpan.textContent = "×";

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = "Изтриване";
    modalHeader.classList.add("modalHeader");
    modalContentDiv.appendChild(modalHeader);

    const txt = document.createElement("p");
    txt.textContent = "Сигурни ли сте, че искате да изтриете елемента?";
    txt.classList.add("modalText");
    modalContentDiv.appendChild(txt);

    const modalBtnsDiv = document.createElement("div");
    modalBtnsDiv.classList.add("modalBtnsDiv");
    modalContentDiv.appendChild(modalBtnsDiv);

    const deleteForm = document.createElement("form");
    deleteForm.action = formAction;
    deleteForm.method = "POST";
    modalBtnsDiv.appendChild(deleteForm);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Изтриване";
    deleteBtn.classList.add("remove");
    deleteForm.appendChild(deleteBtn);


    document.body.appendChild(deleteModalDiv);

    deleteModalDiv.style.display = "block";
    deleteModalDiv.classList.add("fade-in");

    closeSpan.addEventListener("click", function () {
        deleteModalDiv.remove(); // Remove modal when close button is clicked
    });

    window.addEventListener('click', function (event) {
        if (event.target == deleteModalDiv) {
            deleteModalDiv.style.display = "none";
            deleteModalDiv.classList.remove("fade-in");
        }
    });
}


function createFlashcardRecommendationsModal(flashcards, categoryId) {
    const flashcardsModalDiv = document.createElement("div");
    flashcardsModalDiv.classList.add("modal");

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    flashcardsModalDiv.appendChild(modalContentDiv);

    const closeSpan = document.createElement("span");
    closeSpan.classList.add("close");
    modalContentDiv.appendChild(closeSpan);
    closeSpan.textContent = "×";

    const modalHeader = document.createElement("h2");
    modalHeader.textContent = "Препоръчани флашкарти";
    modalHeader.classList.add("modalHeader");
    modalContentDiv.appendChild(modalHeader);

    const allFlashcardsDiv = document.createElement("div");
    allFlashcardsDiv.classList.add("flashcardsModalDiv");
    modalContentDiv.appendChild(allFlashcardsDiv);

    let currentBatch = 0;
    const batchSize = 2;

    displayFlashcardsBatch(flashcards, allFlashcardsDiv, currentBatch * batchSize, batchSize, categoryId);

    const showMoreBtn = document.createElement("button");
    showMoreBtn.textContent = "Show More";
    showMoreBtn.addEventListener("click", () => {
        currentBatch++;
        displayFlashcardsBatch(flashcards, allFlashcardsDiv, currentBatch * batchSize, batchSize, categoryId);
        if ((currentBatch + 1) * batchSize >= flashcards.length) {
            showMoreBtn.style.display = "none";
        }
    });

    modalContentDiv.appendChild(showMoreBtn);

    document.body.appendChild(flashcardsModalDiv);

    flashcardsModalDiv.style.display = "block";
    flashcardsModalDiv.classList.add("fade-in");

    closeSpan.addEventListener("click", function () {
        flashcardsModalDiv.remove(); // Remove modal when close button is clicked
    });

    window.addEventListener('click', function (event) {
        if (event.target == flashcardsModalDiv) {
            flashcardsModalDiv.style.display = "none";
            flashcardsModalDiv.classList.remove("fade-in");
        }
    });
}

function displayFlashcardsBatch(flashcards, allFlashcardsDiv, startIndex, batchSize, categoryId) {
    const endIndex = Math.min(startIndex + batchSize, flashcards.length);

    for (let i = startIndex; i < endIndex; i++) {
        const flashcardDiv = document.createElement("div");
        flashcardDiv.classList.add("flashcard");
        allFlashcardsDiv.appendChild(flashcardDiv);

        const question = document.createElement("p");
        question.textContent = flashcards[i].question;
        question.classList.add("flashcardParagraphSolidLine");
        flashcardDiv.appendChild(question);

        const answer = document.createElement("p");
        answer.textContent = flashcards[i].answer;
        answer.classList.add("flashcardParagraphDashedLine");
        flashcardDiv.appendChild(answer);

        const acceptBtn = document.createElement("button");
        acceptBtn.classList.add("updateFlashcardModalBtn");
        flashcardDiv.appendChild(acceptBtn);

        acceptBtn.addEventListener("click", async function () {
            await fetch(`/flashcards/accept-recommendation`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: categoryId,
                    flashcardId: flashcards[i].id,
                    question: flashcards[i].question,
                    answer: flashcards[i].answer
                })
            });

            window.location.href="/flashcards";
        });

        const acceptIcon = document.createElement("i");
        acceptIcon.classList.add("fa-solid", "fa-check");
        acceptBtn.appendChild(acceptIcon);

        const declineBtn = document.createElement("button");
        declineBtn.classList.add("updateFlashcardModalBtn");
        flashcardDiv.appendChild(declineBtn);

        declineBtn.addEventListener("click", async function () {
            await fetch("/flashcards/decline-recommendation", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    flashcardId: flashcards[i].id
                })
            });

            window.location.href="/flashcards";
        });

        const declineIcon = document.createElement("i");
        declineIcon.classList.add("fa-solid", "fa-x");
        declineBtn.appendChild(declineIcon);
    }
}


// Create add modal when add category button is clicked
const addCategoryBtn = document.querySelector("#openFlashcardCategoryModalBtn");
addCategoryBtn.addEventListener('click', function () {
    createModalForFlashcardCategories("Добавяне на категория", `/flashcards/add/category`, "Добавяне", "add", "");
});


// Create update modal when update category button is clicked
const updateModalBtns = document.querySelectorAll(".updateModalBtn");
for (const updateModalBtn of updateModalBtns) {
    updateModalBtn.addEventListener('click', function () {
        const categoryId = updateModalBtn.getAttribute("data-category-id");
        const categoryTitle = updateModalBtn.getAttribute("data-category-title");

        createModalForFlashcardCategories("Редактиране на категория", `/flashcards/category/${categoryId}?_method=PATCH`, "Редактиране", "update", categoryTitle);
    }
    )
};


// Create add modal when add flashcard button is clicked
const flashcardModalBtn = document.querySelector("#openAddFlashcardModalBtn");
flashcardModalBtn.addEventListener('click', function () {
    const categoryId = flashcardModalBtn.getAttribute("data-category-id");

    createModalForFlashcards("Добавяне на флашкарта", `/flashcards/add/flashcard/${categoryId}`, "Добавяне", "add", "", "");
});


// Create update modal when update flashcard button is clicked
const updateFlashcardModalBtns = document.querySelectorAll(".updateFlashcardModalBtn");
for (const updateFlashcardModalBtn of updateFlashcardModalBtns) {
    updateFlashcardModalBtn.addEventListener('click', function () {
        const flashcardId = updateFlashcardModalBtn.getAttribute("data-flashcard-id");
        const question = updateFlashcardModalBtn.getAttribute("data-question");
        const answer = updateFlashcardModalBtn.getAttribute("data-answer");

        createModalForFlashcards("Редактиране на флашкарта", `/flashcards/${flashcardId}?_method=PATCH`, "Редактиране", "update", question, answer);
    }
    )
};


// Create delete modal when delete category button is clicked
const deleteModalBtns = document.querySelectorAll(".deleteModalBtn");
for (const deleteModalBtn of deleteModalBtns) {
    deleteModalBtn.addEventListener('click', function () {
        const categoryId = deleteModalBtn.getAttribute("data-category-id");

        createDeleteModal(`/flashcards/category/${categoryId}?_method=DELETE`);
    }
    )
};

// Create delete modal when delete flashcard button is clicked
const deleteFlashcardModalBtns = document.querySelectorAll(".deleteFlashcardModalBtn");
for (const deleteFlashcardModalBtn of deleteFlashcardModalBtns) {
    deleteFlashcardModalBtn.addEventListener('click', function () {
        const flashcardId = deleteFlashcardModalBtn.getAttribute("data-flashcard-id");

        createDeleteModal(`/flashcards/${flashcardId}?_method=DELETE`);
    }
    )
};


const openSuggestedFlashcardsModalBtn = document.querySelector("#openSuggestedFlashcardsModalBtn");
openSuggestedFlashcardsModalBtn.addEventListener("click", async function () {
    try {
        const response = await fetch(`/flashcards/recommendation`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const flashcards = await response.json();

        const categoryId = flashcardModalBtn.getAttribute("data-category-id");

        createFlashcardRecommendationsModal(flashcards, categoryId);
    } catch (error) {
        console.error('Error fetching flashcards:', error);
    }
});