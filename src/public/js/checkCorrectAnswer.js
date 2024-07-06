const sectionId = document.currentScript.getAttribute("sectionId");
const lessonSequence = document.currentScript.getAttribute("lessonSequence");
const sectionSequence = document.currentScript.getAttribute("sectionSequence");
const language = document.currentScript.getAttribute("lang");

const exerciseSectionDiv = document.querySelector(".exerciseSection");
const nextExerciseDiv = document.querySelector(".nextExercise");
const showNextButton = document.querySelector("#showNext");
const progressBar = document.querySelector("#myBar");
const currentDiv = document.querySelector(".exercise");
const checkAnswerButton = document.querySelector("#checkAnswerButton");
const checkAnswerDiv = document.querySelector(".checkAnswer");
const nextExerciseHeading = document.querySelector(".nextExerciseHeading");
const nextExerciseParagraph = document.querySelector(".nextExerciseParagraph");
const nextExerciceIcon = document.querySelector(".nextExerciseIcon");
const topDiv = document.querySelector(".top");
const audio = new Audio();

let speech = new SpeechSynthesisUtterance();

let efficiency = 100;

const setSpeechLanguage = (text) => {
    const langDetector = new RegExp("[\u0400-\u04FF]+"); // Cyrillic script

    if (langDetector.test(text)) {
        speech.lang = "bg-BG";
    } else {
        if (language == "French") {
            speech.lang = "fr-FR";
        }else if (language == "English") {
            speech.lang = "en-EN";
        }
    } 
};

let currentExerciseIndex = 0;
let progressBarCounter = 1;
let exercises = [];
let completedExercises = [];

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const getExercises = async () => {
    try {
        const response = await fetch(`/exercises/section/${sectionId}/lesson/${lessonSequence}/get-exercises`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

const initializeExercises = async () => {
    exercises = await getExercises();
    shuffleArray(exercises);

    if (exercises && exercises.length > 0) {
        showExercise();
    } else {
        console.error('No exercises found');
    }
};

document.addEventListener('DOMContentLoaded', initializeExercises);

const showExercise = () => {
    currentDiv.innerHTML = '';

    const exercise = exercises[currentExerciseIndex];

    if (exercise) {
        showTask(exercise);
        showOptions(exercise);
    } else {
        checkAnswerDiv.classList.add("displayNone");
        topDiv.classList.add("displayNone");

        lessonCompleted();

        audio.src = "/sounds/goodresult-82807.mp3";
        audio.play();
    }
};

const showTask = (exercise) => {
    let task;

    if (exercise.task_type == "listening") {
        taskIcon = document.createElement("i");
        taskIcon.classList.add("fa-solid", "fa-ear-listen");

        taskIcon.addEventListener("click", function () {
            textToSpeach(exercise.task);
        });

        task = document.createElement("div");
        task.appendChild(taskIcon);
    } else if (exercise.task_type == "reading") {
        task = document.createElement("h2");
        const taskText = document.createTextNode(exercise.task);
        task.appendChild(taskText);
    }

    currentDiv.appendChild(task);

    textToSpeach(exercise.task);
};

const showOptions = (exercise) => {
    const task = exercise.task;
    const correctAnswer = exercise.correct_answer;
    const exerciseId = exercise.id;
    const options = exercise.options;
    shuffleArray(options);

    if (exercise.option_type === "make_sentence") {
        const sentenceDiv = document.createElement("div");
        sentenceDiv.classList.add("makeSentenceDiv");
        currentDiv.appendChild(sentenceDiv);
    }

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("optionsDiv");

    for (let option of options) {
        const optionBtn = document.createElement("button");
        const optionText = document.createTextNode(option);
        optionBtn.classList.add("optionButton");
        optionBtn.appendChild(optionText);
        optionsDiv.appendChild(optionBtn);
        currentDiv.appendChild(optionsDiv);
    }

    if (exercise.option_type === "multiple_choice") {
        checkMultipleChoiceAnswer(exerciseId, correctAnswer, task);
    } else if (exercise.option_type === "make_sentence") {
        checkMakeSentenceAnswer(exerciseId, correctAnswer, task);
    }
}

const checkMakeSentenceAnswer = (exerciseId, correctAnswer, task) => {
    const makeSentenceDiv = document.querySelector('.makeSentenceDiv');
    const optionsDiv = document.querySelector(".optionsDiv");

    let userAnswer = [];

    checkAnswerButton.classList.add("disabled");

    optionsDiv.addEventListener('click', function (event) {
        const button = event.target.closest('button');

        if (button) {
            userAnswer.push(button.textContent);
            makeSentenceDiv.appendChild(button);

            if (userAnswer.length > 0) {
                checkAnswerButton.classList.remove("disabled");
            }
        }
    });

    makeSentenceDiv.addEventListener('click', function (event) {
        const button = event.target.closest('button');

        if (button) {
            let index = userAnswer.indexOf(button.textContent);
            userAnswer.splice(index, 1);
            optionsDiv.appendChild(button);

            if (userAnswer.length === 0) {
                checkAnswerButton.classList.add("disabled");
            }
        }
    });

    const handleCheckAnswerButtonClick = async () => {
        userAnswer = userAnswer.join(" ");

        if (await isAnswerCorrect(exerciseId, userAnswer)) {
            audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";

            progressBarCounter += 100 / exercises.length;
            progressBar.style.width = progressBarCounter + "%";

            nextExerciseDiv.classList.add("correctAnswer");
            nextExerciceIcon.classList.add("fa-check");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Правилно!"
        } else {
            await fetch(`/flashcards/recommendation`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: task,
                    answer: correctAnswer
                })
            });

            audio.src = "/sounds/wrong-answer-126515.mp3";

            nextExerciseDiv.classList.add("wrongAnswer");
            nextExerciceIcon.classList.add("fa-xmark");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Правилният отговор е:"
            nextExerciseParagraph.textContent = correctAnswer;
        }

        audio.play();
        nextExerciseDiv.classList.remove("displayNone");

        const buttons = document.querySelectorAll(".optionButton");

        for (let button of buttons) {
            button.disabled = true;
        }

        checkAnswerButton.removeEventListener("click", handleCheckAnswerButtonClick);
    };

    checkAnswerButton.addEventListener("click", handleCheckAnswerButtonClick);

    const handleShowNextButtonClick = () => {
        handleButtonClick(exerciseId, userAnswer);
        showNextButton.removeEventListener("click", handleShowNextButtonClick);
    };

    showNextButton.addEventListener("click", handleShowNextButtonClick);
}

const checkMultipleChoiceAnswer = async (exerciseId, correctAnswer, task) => {
    const buttons = document.querySelectorAll(".optionButton");

    let userAnswer;
    let prevClickedButton = null;

    checkAnswerButton.classList.add("disabled");

    for (let button of buttons) {
        button.addEventListener("click", function () {
            checkAnswerButton.classList.remove("disabled");

            if (prevClickedButton !== null) {
                prevClickedButton.classList.remove('clicked');
            }

            if (!button.classList.contains("optionButton clicked")) {
                const buttonText = button.textContent;

                textToSpeach(buttonText);
                userAnswer = buttonText;
                button.classList.add("clicked");
                prevClickedButton = button;
            }
        })
    }

    const handleCheckAnswerButtonClick = async () => {
        if (await isAnswerCorrect(exerciseId, userAnswer)) {
            audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";

            progressBarCounter += 100 / exercises.length;
            progressBar.style.width = progressBarCounter + "%";

            nextExerciseDiv.classList.add("correctAnswer");
            nextExerciceIcon.classList.add("fa-check");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Правилно!"
        } else {
            await fetch(`/flashcards/recommendation`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: task,
                    answer: correctAnswer
                })
            });
            
            audio.src = "/sounds/wrong-answer-126515.mp3";

            nextExerciseDiv.classList.add("wrongAnswer");
            nextExerciceIcon.classList.add("fa-xmark");
            checkAnswerDiv.classList.add("displayNone");

            nextExerciseHeading.textContent = "Правилният отговор е:"
            nextExerciseParagraph.textContent = correctAnswer;
        }

        audio.play();
        nextExerciseDiv.classList.remove("displayNone");

        for (let button of buttons) {
            button.disabled = true;
        }

        checkAnswerButton.removeEventListener("click", handleCheckAnswerButtonClick);
    };

    checkAnswerButton.addEventListener("click", handleCheckAnswerButtonClick);

    const handleShowNextButtonClick = () => {
        handleButtonClick(exerciseId, userAnswer);
        showNextButton.removeEventListener("click", handleShowNextButtonClick);
    };

    showNextButton.addEventListener("click", handleShowNextButtonClick);
}

const handleButtonClick = async (exerciseId, userAnswer) => {
    nextExerciseDiv.classList.add("displayNone");
    nextExerciseDiv.classList.remove("wrongAnswer");
    nextExerciseDiv.classList.remove("correctAnswer");
    checkAnswerDiv.classList.remove("displayNone");

    nextExerciseParagraph.textContent = "";

    if (await isAnswerCorrect(exerciseId, userAnswer)) {
        currentExerciseIndex++;
        completedExercises.push(exerciseId);
    } else {
        efficiency = Math.round(efficiency - 100/exercises.length);
    }

    showExercise();
};

const isAnswerCorrect = async (exerciseId, userAnswer) => {
    try {
        const response = await fetch(`/exercises/${exerciseId}/${userAnswer}/check-answer`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

const textToSpeach = (text) => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    setSpeechLanguage(text);
    speech.text = text;
    window.speechSynthesis.speak(speech);
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
        if (completedExercises.length === exercises.length) {
            const response = await fetch(`/exercises/finish-lesson?_method=PATCH`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    lessonSequence: lessonSequence,
                    efficiency: efficiency
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            console.log('Lesson marked as completed');
        } else {
            console.log('All exercises are not completed yet');
        }
    } catch (error) {
        console.error('Error marking lesson as completed:', error);
    }

    btnCompleted.addEventListener("click", function () {
        window.location.href = `/${language}/free/lessons`;
    });
}