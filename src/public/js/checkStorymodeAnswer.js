const id = document.currentScript.getAttribute("id");
const type = document.currentScript.getAttribute("sectionType");
const lessonSequence = document.currentScript.getAttribute("lessonSequence");
const language = document.currentScript.getAttribute("lang");

const exerciseSectionDiv = document.querySelector(".exerciseSection");
const images = document.querySelectorAll(".image-container");
const checkAnswerButton = document.querySelector("#checkAnswerButton");
const exerciseDiv = document.querySelector(".exercise");
const nextExerciseDiv = document.querySelector(".nextExercise");
const checkAnswerDiv = document.querySelector(".checkAnswer");
const showNextButton = document.querySelector("#showNext");
const nextExerciseHeading = document.querySelector(".nextExerciseHeading");
const nextExerciseParagraph = document.querySelector(".nextExerciseParagraph");
const nextExerciseIcon = document.querySelector(".nextExerciseIcon");
const progressBar = document.querySelector("#myBar");
const topDiv = document.querySelector(".top");
const audio = new Audio();

let sequence = 1;
let currentExerciseIndex = 0;
let progressBarCounter = 1;
let exercises = [];
let completedExercises = [];
const answer = new Map();
let imageData = [];

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getImageName(path) {
    return path.substring(path.lastIndexOf('/') + 1);
}

const getStorymodeImages = async () => {
    try {
        const response = await fetch(`/exercises/${id}/${type}/lesson/${lessonSequence}/get-images`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

const initializeExercises = async () => {
    exercises = await getStorymodeImages();

    if (exercises && exercises.length > 0) {
        showExercise();
    } else {
        console.error('No exercises found');
    }
};

document.addEventListener('DOMContentLoaded', initializeExercises);

const showExercise = () => {
    const exercise = exercises[currentExerciseIndex];

    exerciseDiv.innerHTML = "";

    if (exercise) {
        const task = document.createElement("h2");
        task.classList.add("storymode-task");
        task.textContent = exercise.storymodeExercise.task;
        exerciseDiv.appendChild(task);

        const imagesDiv = document.createElement("div");
        imagesDiv.classList.add("images");
        exerciseDiv.appendChild(imagesDiv);

        shuffleArray(exercise.storymodeImages);
        imageData = []; // Reset imageData

        for (let image of exercise.storymodeImages) {
            imageData.push(image);

            const imagesContainer = document.createElement("div");
            imagesContainer.classList.add("image-container");
            imagesDiv.appendChild(imagesContainer);

            const img = document.createElement("img");
            img.classList.add("storymodeImg");
            img.src = `/img/storymode/${image.url}`;
            imagesContainer.appendChild(img);

            const sequenceDiv = document.createElement("div");
            sequenceDiv.classList.add("overlay-text");
            sequenceDiv.id = "overlay-text";
            imagesContainer.appendChild(sequenceDiv);
        }

        checkAnswerButton.classList.add("disabled");

        document.querySelectorAll('.image-container').forEach(imageContainer => {
            imageContainer.addEventListener('click', function () {
                const overlayText = this.querySelector(".overlay-text");
                const imageUrl = getImageName(this.querySelector("img").src);

                checkAnswerButton.classList.remove("disabled");

                if (!this.classList.contains("overlay")) {
                    answer.set(imageUrl, sequence);
                    overlayText.textContent = sequence;
                    sequence++;
                } else {
                    sequence--;
                    const removedSequence = answer.get(imageUrl);
                    answer.delete(imageUrl);

                    if(answer.size === 0) {
                        checkAnswerButton.classList.add("disabled");
                    }

                    for (let [url, seq] of answer) {
                        if (seq > removedSequence) {
                            answer.set(url, seq - 1);
                        }
                    }

                    document.querySelectorAll(".overlay-text").forEach(overlayTextDiv => {
                        if (overlayText !== overlayTextDiv && overlayText.textContent < overlayTextDiv.textContent) {
                            overlayTextDiv.textContent = overlayTextDiv.textContent - 1;
                        }
                    });
                }

                this.classList.toggle('overlay');
            });
        });

        checkAnswer();
    } else {
        checkAnswerDiv.classList.add("displayNone");
        topDiv.classList.add("displayNone");

        lessonCompleted();

        audio.src = "/sounds/goodresult-82807.mp3";
        audio.play();
    }
}

const checkAnswer = () => {
    let isCorrect = true;

    const handleCheckAnswerButton = () => {
        for (let [url, seq] of answer) {
            const image = imageData.find(img => img.url === url);
            if (image && image.sequence != seq) {
                isCorrect = false;
            }
        }

        if (isCorrect) {
            audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
            progressBarCounter += 100 / exercises.length;
            progressBar.style.width = progressBarCounter + "%";

            nextExerciseDiv.classList.add("correctAnswer");
            nextExerciseIcon.classList.add("fa-check");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Правилно!";
        } else {
            audio.src = "/sounds/wrong-answer-126515.mp3";

            nextExerciseDiv.classList.add("wrongAnswer");
            nextExerciseIcon.classList.add("fa-xmark");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Грешно!";
        }

        audio.play();
        nextExerciseDiv.classList.remove("displayNone");

        checkAnswerButton.removeEventListener("click", handleCheckAnswerButton);
    }

    checkAnswerButton.addEventListener("click", handleCheckAnswerButton);

    const handleShowNextButtonClick = () => {
        nextExercise(isCorrect);
        showNextButton.removeEventListener("click", handleShowNextButtonClick);
    };

    showNextButton.addEventListener("click", handleShowNextButtonClick);
}

const nextExercise = (isCorrect) => {
    nextExerciseDiv.classList.add("displayNone");
    nextExerciseDiv.classList.remove("wrongAnswer", "correctAnswer");
    checkAnswerDiv.classList.remove("displayNone");

    nextExerciseParagraph.textContent = "";

    if (isCorrect) {
        currentExerciseIndex++;
        // completedExercises.push(exerciseId);
    } else {
        console.log("greshka");
    }

    sequence = 1; // Reset sequence for the next exercise
    answer.clear(); // Clear previous answers
    showExercise();
}

const lessonCompleted = async () => {
    const lessonCompletedDiv = document.createElement("div");
    lessonCompletedDiv.classList.add("lessonCompleted");
    exerciseSectionDiv.appendChild(lessonCompletedDiv);

    const paragraph = document.createElement("h1");
    paragraph.textContent = "Успешно преминат урок!";
    lessonCompletedDiv.appendChild(paragraph);

    const coinsReward = document.createElement("p");
    coinsReward.classList.add("coins-reward");
    coinsReward.innerHTML = `<i class="fa-solid fa-coins"></i> 25`;
    lessonCompletedDiv.appendChild(coinsReward);

    const btnCompleted = document.createElement("button");
    btnCompleted.textContent = "Обратно";
    lessonCompletedDiv.appendChild(btnCompleted);

    try {
        const response = await fetch(`/exercises/finish-premium-lesson?_method=PATCH`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: language,
                lessonSequence: lessonSequence,
                sectionType: "storymode"
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error marking lesson as completed:', error);
    }

    btnCompleted.addEventListener("click", function () {
        window.location.href = `/${language}/premium/lessons`;
    });
}