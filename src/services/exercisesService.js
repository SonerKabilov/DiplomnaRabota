const exercisesRepository = require('../database/repositories/exercisesRepository');

module.exports = {
    getAllLessonExercises: async (sectionId, lessonSequence) => {
        return await exercisesRepository.queryLessonExercises(sectionId, lessonSequence);
    },
    getAllPremiumLessonExercises: async (sectionId, type, lessonSequence) => {
        if (type === "storymode") {
            const storymodeExerciseId = await exercisesRepository.queryStorymodeExerciseId(sectionId, lessonSequence);

            if (storymodeExerciseId) {
                return await exercisesRepository.queryStorymodeExercises(storymodeExerciseId);
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

        let isValidCorrectAnswer = false;

        // Checks if the correct answer is in the options
        if (newExercise.optionTypesId == 1) {
            // For multiple_choice answer
            for (let option of newExercise.options) {
                if (option == newExercise.correctAnswer) {
                    isValidCorrectAnswer = true;
                    break;
                }
            }
        } else if (newExercise.optionTypesId == 2) {
            // For make_sentece answer
            const correctAnswer = newExercise.correctAnswer;
            const splitAnswer = correctAnswer.split(" ");

            for (let answer of splitAnswer) {
                isValidCorrectAnswer = false;

                for (let option of newExercise.options) {
                    if (answer == option) {
                        isValidCorrectAnswer = true;
                    }
                }

                if (!isValidCorrectAnswer) {
                    break;
                }
            }
        } else if (newExercise.optionTypesId == 3) {
            // For text answer
            isValidCorrectAnswer = true;
        }

        if (!isValidCorrectAnswer) {
            return false;
        }

        newExercise.options = JSON.stringify(newExercise.options);

        await exercisesRepository.insertExercise(newExercise);

        return true;
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
    }
}