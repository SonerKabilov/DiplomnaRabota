const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const sectionsService = require('../services/sectionsService');
const coursesService = require('../services/coursesService');

module.exports = {
    showLessonDetails: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        const checkIfLessonExists = await lessonsService.getLessonId(lessonSequence, sectionId);

        if (!checkIfLessonExists) {
            req.flash("error", "Не съществува такъв урок");

            return res.redirect("/admin");
        }

        const exercises = await exercisesService.getAllLessonExercises(sectionId, lessonSequence);
        const lessonPreview = await lessonsService.getLessonPreview(lessonSequence, sectionId);
        const freeLessonTaskTypes = await exercisesService.getFreeLessonTaskTypes();
        const freeLessonOptionTypes = await exercisesService.getFreeLessonOptionTypes();

        const lessonDetails = {
            language,
            sectionId,
            lessonSequence,
            exercises,
            lessonPreview,
            freeLessonTaskTypes,
            freeLessonOptionTypes
        }

        res.render("admin/showLessonDetails", { lessonDetails });
    },
    showPremiumLessonDetails: async (req, res) => {
        const { language, type, sectionId, lessonSequence } = req.params;

        try {
            const exercises = await exercisesService.getAllPremiumLessonExercises(sectionId, type, lessonSequence);

            const lessonDetails = {
                language,
                type,
                sectionId,
                lessonSequence,
                exercises,
                lessonPreview: ""
            }

            console.log(exercises);

            res.render("admin/showPremiumLessonDetails", { lessonDetails });
        } catch (err) {
            console.log(err);

            req.flash("error", "Урокът не съществува!");

            return res.redirect(`/admin`);
        }
    },
    addLesson: async (req, res) => {
        const { language, sectionSequence } = req.params;

        try {
            const courseId = await coursesService.getCourseId(language);

            const sectionDetails = {
                courseId,
                sectionSequence
            }

            const sectionId = await sectionsService.getSectionId(sectionDetails);

            await lessonsService.addLesson(courseId, sectionId);

            req.flash("success", "Успешно добавен урок!");

            res.redirect(`/admin/show/${language}/section/${sectionSequence}/lessons`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Грешка при добавяне на урок!");

            return res.redirect(`/admin/show/${language}/${sectionSequence}/lessons`);
        }
    },
    addPremiumLesson: async (req, res) => {
        const { language, type } = req.params;

        try {
            const courseId = await coursesService.getCourseId(language);

            const sectionDetails = {
                courseId,
                type
            }

            const sectionId = await sectionsService.getPremiumSectionId(sectionDetails);

            await lessonsService.addPremiumLesson(courseId, sectionId, type);

            req.flash("success", "Успешно добавен урок!");

            res.redirect(`/admin/show/${language}/${type}/lessons`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Грешка при добавяне на урок!");

            return res.redirect(`/admin/show/${language}/${type}/lessons`);
        }
    },
    updateLessonPreview: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;
        const { lessonPreview } = req.body;

        const lessonToUpdate = {
            sectionId,
            lessonSequence,
            lessonPreview
        }

        try {
            await lessonsService.updateLessonPreview(lessonToUpdate);

            req.flash("success", "Успешно редактирано описание на урок!");

            res.redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Грешка при редактиране на описание на урок!");

            return res.redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        }
    },
    deleteFreeLesson: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        try {
            await lessonsService.deleteFreeLesson(sectionId, lessonSequence);

            req.flash("success", "Успешно изтриване на урок!");

            res
                .status(200)
                .redirect(`/admin/show/${language}/section/${sectionId}/lessons`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Неуспешно изтриване на урок!");

            res
                .status(404)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        }
    }
}