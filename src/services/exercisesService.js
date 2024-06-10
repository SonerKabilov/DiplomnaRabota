const exercisesRepository = require('../database/repositories/exercisesRepository');

module.exports = {
    getAllLessonExercises: async (sectionId, lessonSequence) => {
        return await exercisesRepository.queryLessonExercises(sectionId, lessonSequence);
    },
    getAllPremiumLessonExercises: async (sectionId, type, lessonSequence) => {
        if (type === "storymode") {
            const storymodeExercise = await exercisesRepository.queryStorymodeExercise(sectionId, lessonSequence);

            if (storymodeExercise.length > 0) {
                const storymodeImages = await exercisesRepository.queryStorymodeImages(storymodeExercise[0].id);

                return {
                    storymodeExercise,
                    storymodeImages
                };
            }
        }

        return [];
    },
    addExercise: async (newExercise) => {
        // Removes blank option inputs
        for (let option of newExercise.options) {
            if (option == "") {
                const index = newExercise.options.indexOf(option);
                newExercise.options.splice(index, 1);
            }
        }

        newExercise.options = JSON.stringify(newExercise.options);

        const isValidCorrectAnswer = checkCorrectAnswer(exercise);

        if (isValidCorrectAnswer) {
            await exercisesRepository.insertExercise(newExercise);

            return true;
        }

        return false;
    },
    addStorymodeExercise: async (exerciseDetails) => {
        const sequences = exerciseDetails.img.sequence;
        const urls = exerciseDetails.img.url;
        const images = new Map();

        if (sequences.length === urls.length) {
            for (let i = 0; i < sequences.length; i++) {
                if (sequences[i] == i + 1) {
                    images.set(sequences[i], urls[i])
                } else {
                    return false;
                }
            }

            try {
                const lastInsertedId = await exercisesRepository.insertStorymodeExercise(exerciseDetails);

                for (const [sequence, url] of images) {
                    await exercisesRepository.insertStorymodeImages(url, sequence, lastInsertedId);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Different Length");
            return false;
        }
    },
    checkUserAnswer: async (userAnswerData) => {
        const exercise = await exercisesRepository.queryCorrectAnswer(userAnswerData.exerciseId);

        if (exercise === userAnswerData.userAnswer) {
            return true;
        }

        return false;
    },
    getFreeLessonTaskTypes: async () => {
        return await exercisesRepository.queryFreeLessonTaskTypes();
    },
    getFreeLessonOptionTypes: async () => {
        return await exercisesRepository.queryFreeLessonOptionTypes();
    },
    updateFreeExercise: async (exercise) => {
        // Removes blank option inputs
        for (let option of exercise.options) {
            if (option == "") {
                const index = exercise.options.indexOf(option);
                exercise.options.splice(index, 1);
            }
        }

        exercise.options = JSON.stringify(exercise.options);

        const isValidCorrectAnswer = checkCorrectAnswer(exercise);

        if (isValidCorrectAnswer) {
            await exercisesRepository.updateFreeExercise(exercise);
            
            return true;
        }

        return false;
    },
    deleteFreeExercise: async (id) => {
        return await exercisesRepository.updateExerciseDeletedStatus(id);
    }
}

function checkCorrectAnswer(exercise) { 
    let isValidCorrectAnswer = false;

    const options = JSON.parse(exercise.options);

    // Checks if the correct answer is in the options
    if (exercise.optionTypesId == 1) {
        // For multiple_choice answer
        isValidCorrectAnswer = options.includes(exercise.correctAnswer);
    } else if (exercise.optionTypesId == 2) {
        // For make_sentece answer
        const splitAnswer = exercise.correctAnswer.split(" ");

        isValidCorrectAnswer = splitAnswer.every(answer => options.includes(answer));
    } else if (exercise.optionTypesId == 3) {
        // For text answer
        isValidCorrectAnswer = true;
    }

    return isValidCorrectAnswer;
}