/* OPEN FLASHCARD CATEGORY MODAL */
function createModalWithInput(header, formAction, buttonTxt, buttonClass, categoryTitle) {
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

/* OPEN DELETE CONFIRMATION MODAL */
function createDeleteModal(categoryId) {
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
    deleteForm.action = (`/flashcards/delete/category/${categoryId}?_method=DELETE`);
    deleteForm.method = ("POST");
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


// Create add modal when add category button is clicked
const addCategoryBtn = document.querySelector("#openFlashcardCategoryModalBtn");
addCategoryBtn.addEventListener('click', function () {
    createModalWithInput("Добавяне на категория", `/flashcards/add/category`, "Добавяне", "add", "");
});


const updateModalBtns = document.querySelectorAll(".updateModalBtn");
for (const updateModalBtn of updateModalBtns) {
    updateModalBtn.addEventListener('click', function () {
        const categoryId = updateModalBtn.getAttribute("data-category-id");
        const categoryTitle = updateModalBtn.getAttribute("data-category-title");
        createModalWithInput("Редактиране на категория", `/flashcards/update/category/${categoryId}?_method=PATCH`, "Редактиране", "update", categoryTitle);
    }
    )
};


// Create delete modal when delete category button is clicked
const deleteModalBtns = document.querySelectorAll(".deleteModalBtn");
for (const deleteModalBtn of deleteModalBtns) {
    deleteModalBtn.addEventListener('click', function () {
        const categoryId = deleteModalBtn.getAttribute("data-category-id");
        createDeleteModal(categoryId);
    }
    )
};