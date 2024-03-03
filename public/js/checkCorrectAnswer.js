const exercisesJson = document.currentScript.getAttribute("exercises");
const lessonId = document.currentScript.getAttribute("id");
const nextExerciseDiv = document.querySelector(".nextExercise");
const showNextButton = document.querySelector("#showNext");
const audio = new Audio();

let speech = new SpeechSynthesisUtterance();

const exercises = JSON.parse(exercisesJson);

let currentExerciseIndex = 0;

const currentDiv = document.querySelector(".exercise");

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(exercises);

const showExercise = async () => {
    currentDiv.innerHTML = '';

    const exercise = exercises[currentExerciseIndex];
    console.log(exercise);
    if (exercise) {
        console.log(currentExerciseIndex);
        const correctAnswer = exercise.correct_answer;

        const task = document.createElement("h2");
        const taskText = document.createTextNode(exercise.task);
        task.appendChild(taskText);
        currentDiv.appendChild(task);

        speech.text = exercise.task;
        window.speechSynthesis.speak(speech);

        const options = exercise.options;
        shuffleArray(options);
    
        for (let option of options) {
            const optionBtn = document.createElement("button");
            const optionText = document.createTextNode(option);
            optionBtn.classList.add("optionButton");
            optionBtn.appendChild(optionText);
            currentDiv.appendChild(optionBtn);
        }

        const checkAnswerButton = document.createElement("button");
        const checkAnswerText = document.createTextNode("Проверка");
        checkAnswerButton.classList.add("checkAnswer");
        checkAnswerButton.appendChild(checkAnswerText);
        currentDiv.appendChild(checkAnswerButton);

        const buttons = document.querySelectorAll(".optionButton");
        let userAnswer;

        let prevClickedButton = null;

        for(let button of buttons) {
            button.addEventListener("click", function() {
                if (prevClickedButton !== null) {
                    prevClickedButton.classList.remove('clicked');
                }

                userAnswer = button.textContent;
                button.classList.add("clicked");
                prevClickedButton = button;
            })
        }

        const handleCheckAnswerButtonClick = () => {
            if(isAnswerCorrect(userAnswer, correctAnswer)) {
                audio.src = "/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
            } else {
                audio.src = "/sounds/wrong-answer-126515.mp3";
            }
            
            audio.play();
            nextExerciseDiv.classList.remove("displayNone");

            for(let button of buttons) {
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
    } else {
        audio.src = "/sounds/goodresult-82807.mp3";
        audio.play();
        currentDiv.innerHTML = '<p>All exercises completed!</p><a href="/home">Обратно</a>';
    }
};

const handleButtonClick = (userAnswer, correctAnswer) => {
    nextExerciseDiv.classList.add("displayNone");

    if(isAnswerCorrect(userAnswer, correctAnswer)) {
        currentExerciseIndex++;
    } else {
        console.log("greshka");
    }
    
    showExercise();
};

const isAnswerCorrect = (userAnswer, correctAnswer) => {
    if(userAnswer === correctAnswer) {
        return true;
    }

    return false;
}

showExercise();

