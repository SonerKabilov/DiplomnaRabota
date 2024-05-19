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
        nextButton.disabled = false;
    } else if (index === flashcards.length - 1) {
        nextButton.disabled = true;
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
        <form action="/flashcards/add/${flashcard.flashcard_categories_id}/flashcard/${flashcard.id}/score" method="POST">
            <input type="hidden" name="score" value="${i}">
            <button class="scoreButton${i}">${i}</button>
        </form>`;
        scores.insertAdjacentHTML('beforeend', formHTML);
    };
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