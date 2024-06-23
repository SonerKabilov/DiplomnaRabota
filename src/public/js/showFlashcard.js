const flashcardsJson = document.currentScript.getAttribute("flashcards");
const flashcards = JSON.parse(flashcardsJson);

let currentIndex = 0;
const flashcardElement = document.getElementById('flashcard');
const front = document.querySelector('.front');
const back = document.querySelector('.back');
const nextButton = document.getElementById('nextBtn');
const prevButton = document.querySelector('#prevBtn');
const scores = document.querySelector('#scores');

function showFlashcard(index) {

    if (index < flashcards.length - 1) {
        nextButton.classList.remove("disabled");
    } else if (index === flashcards.length - 1) {
        nextButton.classList.add("disabled");
    }

    if (index === 0) {
        prevButton.classList.add("disabled");
    } else {
        prevButton.classList.remove("disabled");
    }

    const flashcard = flashcards[index];
    front.innerHTML = `
        <h2>Въпрос</h2>
        <p>${flashcard.question}</p>
    `;

    back.innerHTML = `
        <h2>Отговор</h2>
        <p>${flashcard.answer}</p>
    `;

    scores.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const formHTML = `
            <button 
                class="scoreButton${i} scorebuttons"
                data-score="${i}"
                data-category-id="${flashcard.flashcard_categories_id}"
                data-flashcard-id="${flashcard.id}">
                ${i}
            </button>
        `;
        scores.insertAdjacentHTML('beforeend', formHTML);
    };

    const scoreButtons = document.querySelectorAll(".scorebuttons");

    for (const scoreButton of scoreButtons) {
        scoreButton.addEventListener("click", async function () {
            const flashcardId = scoreButton.getAttribute("data-flashcard-id");
            const score = scoreButton.getAttribute("data-score");

            await fetch(`/flashcards/add/flashcard/${flashcardId}/score`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    score: score
                })
            });
        })
    }
}

nextButton.addEventListener('click', () => {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        showFlashcard(currentIndex);
    }
});

prevButton.addEventListener('click', () => {
    if (currentIndex != 0 || currentIndex != "") {
        currentIndex--;
        showFlashcard(currentIndex);
    }
});


showFlashcard(currentIndex);