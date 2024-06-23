const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const sectionsService = require('../services/sectionsService');
const accountService = require('../services/accountService');
const coursesService = require('../services/coursesService');

module.exports = {
    showLessonExercises: async (req, res) => {
        const userId = req.session.user_id;
        const { language, sectionSequence, lessonSequence } = req.params;

        try {
            const sectionDetails = {
                language,
                sectionSequence
            }

            const onFreeLesson = await accountService.getFreeProgress(userId, language);

            if (onFreeLesson >= lessonSequence) {
                const sectionId = await sectionsService.getSectionIdByLanguage(sectionDetails);

                res.status(200).render("user/exercises", { sectionId, lessonSequence, sectionSequence, language });
            } else {
                res.redirect(`/${language}/free/lessons`);
            }
        } catch (error) {
            console.error(error);
            res.redirect(`/${language}/free/lessons`);
        }
    },
    getFreeExercises: async (req, res) => {
        try {
            const { sectionId, lessonSequence } = req.params;

            const exercises = await exercisesService.getAllLessonExercises(sectionId, lessonSequence);

            res.json(exercises);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showPremiumExercises: async (req, res) => {
        const userId = req.session.user_id;
        const { language, type, lessonSequence } = req.params;

        if (await accountService.checkIfUserHasMembership(userId)) {
            try {
                let sectionDetails = {
                    language,
                    type,
                    lessonSequence
                }

                const id = await sectionsService.getPremiumSectionIdByLanguage(sectionDetails);

                sectionDetails = {
                    ...sectionDetails,
                    id
                }

                if (type === "storymode") {
                    const storymodeProgress = await accountService.getStorymodeProgress(userId, language);

                    if (storymodeProgress >= lessonSequence) {
                        res.render("user/storymodeExercises", { sectionDetails });
                    } else {
                        res.redirect(`/${language}/premium/lessons`);
                    }
                }
            } catch (error) {
                console.error(error);
                res.redirect(`/${language}/premium/lessons`);
            }
        } else {
            res.redirect(`/${language}/free/lessons`);
        }
    },
    getStorymodeImages: async (req, res) => {
        const { id, type, lessonSequence } = req.params;

        try {
            const storymodeExercises = await exercisesService.getAllPremiumLessonExercises(id, type, lessonSequence);

            res.json(storymodeExercises);
        } catch (err) {
            res.json([]);
        }
    },
    showAddExerciseForm: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        const checkIfLessonExists = await lessonsService.getLessonId(lessonSequence, sectionId);

        if (!checkIfLessonExists) {
            req.flash("error", "Не съществува такъв урок");

            return res.redirect("/admin");
        }

        res.render("admin/addExercise", { language, sectionId, lessonSequence });
    },
    addExercise: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;
        const exercise = req.body;

        if (
            exercise.task == "" ||
            exercise.correctAnswer == ""
        ) {
            req.flash("error", "Полетата за 'Задание' и 'Правилен отговор' са задължителни полета!");

            return res
                .status(400)
                .redirect(`/admin/add/${language}/sectionId/${sectionId}/lesson/${lessonSequence}/exercise`);
        }

        const lessonId = await lessonsService.getLessonId(lessonSequence, sectionId);

        const newExercise = {
            task: exercise.task,
            taskTypesId: exercise.taskTypes,
            optionTypesId: exercise.optionTypes,
            options: exercise.options,
            correctAnswer: exercise.correctAnswer,
            lessonId
        }

        const addedExercise = await exercisesService.addExercise(newExercise);

        if (addedExercise) {
            req.flash("success", "Успешно добавено упражнение!");

            res
                .status(201)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } else {
            req.flash("error", "Грешни данни за упражнение!");

            res
                .status(400)
                .redirect(`/admin/add/${language}/sectionId/${sectionId}/lesson/${lessonSequence}/exercise`);
        }
    },
    updateCompletedLesson: async (req, res) => {
        const userId = req.session.user_id;
        const { lessonSequence, language } = req.body;

        const userData = {
            userId,
            lessonSequence,
            language
        }

        try {
            await accountService.updateUserDataForCompletedLesson(userData);

            const currency = await accountService.getUserCurrency(userId);
            req.session.user_currency = currency;

            res.redirect(`/${language}/premium/lessons`);
        } catch (error) {
            console.log(error);

            req.flash("error", "Неуспешно приключване на упражнение!");
            res.redirect(`/${language}/premium/lessons`);
        }
    },
    updatePremiumCompletedLesson: async (req, res) => {
        const userId = req.session.user_id;
        const { lessonSequence, language, sectionType } = req.body;

        const userData = {
            userId,
            lessonSequence,
            language,
            sectionType
        }

        try {
            await accountService.updateUserDataForCompletedPremiumLesson(userData);

            const currency = await accountService.getUserCurrency(userId);
            req.session.user_currency = currency;

            res.redirect(`/${language}/premium/lessons`);
        } catch (error) {
            console.log(error);

            req.flash("error", "Неуспешно приключване на упражнение!");
            res.redirect(`/${language}/premium/lessons`);
        }
    },
    showAddStorymodeExerciseForm: async (req, res) => {
        const { type, lessonSequence, language, sectionId } = req.params;

        res.render("admin/addStorymodeExercise", { type, lessonSequence, language, sectionId });
    },
    addStorymodeExercise: async (req, res) => {
        const { type, lessonSequence, language, sectionId } = req.params;
        const exercise = req.body;

        try {
            const lessonId = await lessonsService.getPremiumLessonId(lessonSequence, sectionId);

            const exerciseDetails = {
                lessonId,
                task: exercise.task,
                img: exercise.img
            }

            await exercisesService.addStorymodeExercise(exerciseDetails);

            res
                .status(201)
                .redirect(`/admin/show/${language}/${type}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } catch (err) {
            req.flash("error", "Грешни данни за упражнение!");

            res
                .status(400)
                .redirect(`/admin/add/${language}/${type}/sectionId/${sectionId}/lesson/${lessonSequence}/exercise`);
        }
    },
    checkUserAnswer: async (req, res) => {
        const { exerciseId, userAnswer } = req.params;

        const userAnswerData = {
            exerciseId,
            userAnswer
        }

        const result = await exercisesService.checkUserAnswer(userAnswerData);

        res.json(result);
    },
    updateFreeExercise: async (req, res) => {
        const { language, sectionId, lessonSequence, id } = req.params;
        const body = req.body;

        const exercise = {
            id: id,
            task: body.task,
            taskTypesId: body.taskTypes,
            optionTypesId: body.optionTypes,
            options: body.options,
            correctAnswer: body.correctAnswer
        }

        try {
            const result = await exercisesService.updateFreeExercise(exercise);

            if (result) {
                req.flash("success", "Успешно редактирано упражнение!");

                res
                    .status(201)
                    .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
            } else {
                req.flash("error", "Грешни данни за упражнение!");

                res
                    .status(400)
                    .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
            }
        } catch (err) {
            req.flash("error", "Грешни данни за упражнение!");

            res
                .status(400)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        }
    },
    deleteFreeExercise: async (req, res) => {
        const { language, sectionId, lessonSequence, id } = req.params;

        try {
            await exercisesService.deleteFreeExercise(id);

            req.flash("success", "Успешно изтрито упражнение!");

            res
                .status(200)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Неуспешно изтриване на упражнение!");

            res
                .status(400)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        }
    }
}