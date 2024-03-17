const exercisesJson = document.currentScript.getAttribute("exercises");
const nextExerciseDiv = document.querySelector(".nextExercise");
const showNextButton = document.querySelector("#showNext");
const progressBar = document.querySelector("#myBar");
const currentDiv = document.querySelector(".exercise");
const audio = new Audio();

const checkAnswerButton = document.createElement("button");
const checkAnswerText = document.createTextNode("Проверка");
checkAnswerButton.classList.add("checkAnswer");
checkAnswerButton.appendChild(checkAnswerText);

let speech = new SpeechSynthesisUtterance();
let currentExerciseIndex = 0;
let progressBarCounter = 1;

const exercises = JSON.parse(exercisesJson);

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(exercises);

const showExercise = () => {
    currentDiv.innerHTML = '';

    const exercise = exercises[currentExerciseIndex];

    if (exercise) {
        showTask(exercise);

        showOptions(exercise);
    } else {
        audio.src = "/sounds/goodresult-82807.mp3";
        audio.play();
        currentDiv.innerHTML = '<p>All exercises completed!</p><a href="/section/1/lessons">Обратно</a>';
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
    const correctAnswer = exercise.correct_answer;
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
        checkMultipleChoiceAnswer(correctAnswer);
    } else if (exercise.option_type === "make_sentence") {
        checkMakeSentenceAnswer(correctAnswer);
    }
}

const checkMakeSentenceAnswer = (correctAnswer) => {
    currentDiv.appendChild(checkAnswerButton);
    const makeSentenceDiv = document.querySelector('.makeSentenceDiv');
    const optionsDiv = document.querySelector(".optionsDiv");
    let userAnswer = [];

    optionsDiv.addEventListener('click', function (event) {
        const button = event.target.closest('button');

        if (button) {
            userAnswer.push(button.textContent);
            makeSentenceDiv.appendChild(button);
        }
    });

    makeSentenceDiv.addEventListener('click', function (event) {
        const button = event.target.closest('button');

        if (button) {
            let index = userAnswer.indexOf(button.textContent);
            userAnswer.splice(index, 1);
            optionsDiv.appendChild(button);
        }
    });

    const handleCheckAnswerButtonClick = () => {
        userAnswer = userAnswer.join(" ");
        if (isAnswerCorrect(userAnswer, correctAnswer)) {
            audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
            progressBarCounter += 100 / exercises.length;
            progressBar.style.width = progressBarCounter + "%";
        } else {
            audio.src = "/sounds/wrong-answer-126515.mp3";
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
        handleButtonClick(userAnswer, correctAnswer);
        showNextButton.removeEventListener("click", handleShowNextButtonClick);
    };

    showNextButton.addEventListener("click", handleShowNextButtonClick);
}

const checkMultipleChoiceAnswer = async (correctAnswer) => {
    currentDiv.appendChild(checkAnswerButton);

    const buttons = document.querySelectorAll(".optionButton");
    let userAnswer;

    let prevClickedButton = null;

    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (prevClickedButton !== null) {
                prevClickedButton.classList.remove('clicked');
            }

            if(!button.classList.contains("optionButton clicked")) {
                console.log(button);
                const buttonText = button.textContent;

                textToSpeach(buttonText);
                userAnswer = buttonText;
                button.classList.add("clicked");
                prevClickedButton = button;
            }
        })
    }

    const handleCheckAnswerButtonClick = () => {
        if (isAnswerCorrect(userAnswer, correctAnswer)) {
            audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
            progressBarCounter += 100 / exercises.length;
            progressBar.style.width = progressBarCounter + "%";
        } else {
            audio.src = "/sounds/wrong-answer-126515.mp3";
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
        handleButtonClick(userAnswer, correctAnswer);
        showNextButton.removeEventListener("click", handleShowNextButtonClick);
    };

    showNextButton.addEventListener("click", handleShowNextButtonClick);
}

const handleButtonClick = (userAnswer, correctAnswer) => {
    nextExerciseDiv.classList.add("displayNone");

    if (isAnswerCorrect(userAnswer, correctAnswer)) {
        currentExerciseIndex++;
    } else {
        console.log("greshka");
    }

    showExercise();
};

const isAnswerCorrect = (userAnswer, correctAnswer) => {
    if (userAnswer === correctAnswer) {
        return true;
    }

    return false;
}

const textToSpeach = (text) => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    speech.text = text;
    window.speechSynthesis.speak(speech);
}

showExercise();

