const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');
const accountService = require('../services/accountService');

module.exports = {
    showFreeSectionsPage: async (req, res) => {
        try {
            const { language } = req.params;

            const userCurrency = req.session.user_currency;
            const coursesTaken = req.session.user_courses;

            let isTaken = false;

            for (course of coursesTaken) {
                if (course.language == language) {
                    isTaken = true;
                    break;
                }
            }

            const userData = {
                userCurrency,
                coursesTaken
            }

            if (isTaken) {
                req.session.language = language;

                res
                    .status(200)
                    .render("user/freeSections", { userData, language });
            } else {
                res.redirect("/courses/add");
            }
        } catch (error) {
            console.error(error);

            res
                .status(404)
                .send("Not found");
        }
    },
    getFreeSectionsAndLessons: async (req, res) => {
        try {
            const { language } = req.params;
            const userId = req.session.user_id;

            const sections = await sectionsService.getAllSectionsForCourse(language);
            const lessons = await lessonsService.getAllLessons(language);
            const courseInformation = await accountService.getCurrentUserCourse(userId, language);
            const onLesson = courseInformation[0].on_lesson;

            res.json({ sections, lessons, onLesson });
        } catch (error) {
            console.error(error);

            res.json([]);
        }
    },
    showPremiumSectionsPage: async (req, res) => {
        try {
            const { language } = req.params;

            const userCurrency = req.session.user_currency;
            const coursesTaken = req.session.user_courses;

            let isTaken = false;

            for (course of coursesTaken) {
                if (course.language == language) {
                    isTaken = true;
                    break;
                }
            }

            const userData = {
                userCurrency,
                coursesTaken
            }

            if (isTaken) {
                req.session.language = language;

                res
                    .status(200)
                    .render("user/premiumSections", { userData, language });
            } else {
                res.redirect("/courses/add");
            }
        } catch (error) {
            console.error(error);

            res
                .status(404)
                .send("Not found");
        }
    },
    getPremiumSectionsAndLessons: async (req, res) => {
        try {
            const { language } = req.params;
            const userId = req.session.user_id;

            const sections = await sectionsService.getAllPremiumSectionsForCourse(language);
            const userHasMembership = await accountService.checkIfUserHasMembership(userId);

            let lessons;

            if (userHasMembership) {
                lessons = await lessonsService.getAllPremiumLessons(language);
            } else {
                lessons = [];
            }

            const courseInformation = await accountService.getCurrentUserCourse(userId, language);

            const onLesson = {
                storymode: courseInformation[0].on_storymode_lesson,
                test: courseInformation[0].on_test_lesson
            }

            res.json({ sections, lessons, onLesson });
        } catch (error) {
            console.error(error);

            res.json([]);
        }
    },
    showSectionDetails: async (req, res) => {
        const { language, sectionSequence } = req.params;

        try {
            const lessons = await lessonsService.getAllLessonsForAdmin(language, sectionSequence);
            const sectionData = await sectionsService.getSectionData(language, sectionSequence);

            const sectionDetails = {
                id: sectionData.id,
                language,
                sectionSequence,
                lessons,
                description: sectionData.description
            }

            res.render("admin/showSectionDetails", { sectionDetails });
        } catch (err) {
            console.log(err);

            req.flash("error", "Не съществува такъв раздел");

            return res.redirect("/admin");
        }

    },
    showPremiumSectionDetails: async (req, res) => {
        const { language, type } = req.params;

        try {
            const lessons = await lessonsService.getAllPremiumLessonsForAdmin(language, type);
            const sectionData = await sectionsService.getPremiumSectionData(language, type);

            const sectionDetails = {
                id: sectionData[0].id,
                language,
                lessons,
                description: sectionData.description,
                type
            }

            res.render("admin/showPremiumSectionDetails", { sectionDetails });
        } catch (err) {
            console.log(err);

            req.flash("error", "Не съществува такъв раздел");

            return res.redirect("/admin");
        }
    },
    showAddSectionForm: (req, res) => {
        const { courseId } = req.params;

        res.render("admin/addSection", { courseId });
    },
    addSection: async (req, res) => {
        const { courseId } = req.params;
        const section = req.body;

        const newSection = {
            courseId,
            description: section.description,
            premiumSection: section.premiumSection,
            sectionType: section.sectionTypes
        }

        try {
            await sectionsService.addSection(newSection);

            req.flash("success", "Успешно създаден раздел!");

            res
                .status(201)
                .redirect("/admin");
        } catch (err) {
            console.log(err);

            req.flash("error", "Неуспешно създаване на раздел!");

            res
                .status(404)
                .redirect("/admin");
        }
    },
    updateSectionDescription: async (req, res) => {
        const { language, sectionSequence } = req.params;
        const { description } = req.body;

        const updatedSection = {
            language,
            sequence: sectionSequence,
            description
        }

        try {
            await sectionsService.updateSectionDescription(updatedSection);

            req.flash("success", "Успешно редактирано описание на раздел!");

            res
                .status(200)
                .redirect(`/admin/show/${language}/section/${sectionSequence}/lessons`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Неуспешно редактиране на описание на раздел!");

            res
                .status(404)
                .redirect("/admin");
        }
    },
    deleteFreeSection: async (req, res) => {
        const { id } = req.params;

        try {
            await sectionsService.deleteFreeSection(id);

            req.flash("success", "Успешно изтриване на раздел!");

            res
                .status(200)
                .redirect(`/admin`);
        } catch (err) {
            console.log(err);

            req.flash("error", "Неуспешно изтриване на раздел!");

            res
                .status(404)
                .redirect("/admin");
        }
    }
}