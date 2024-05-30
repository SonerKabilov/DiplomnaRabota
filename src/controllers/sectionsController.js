const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');

module.exports = {
    getFreeSections: async (req, res) => {
        try {
            const { language } = req.params;

            req.session.language = language;

            const userCurrency = req.session.user_currency;
            const coursesTaken = req.session.user_courses;

            const userData = {
                userCurrency,
                coursesTaken
            }

            const sections = await sectionsService.getAllSectionsForCourse(language);
            const lessons = await lessonsService.getAllLessons(language);

            res
                .status(200)
                .render("user/freeSections", { userData, language, sections, lessons });
        } catch (error) {
            console.error(error);

            res
                .status(404)
                .send("Not found");
        }
    },
    getPremiumSections: async (req, res) => {
        try {
            const { language } = req.params;

            req.session.language = language;

            const userCurrency = req.session.user_currency;
            const coursesTaken = req.session.user_courses;

            const userData = {
                userCurrency,
                coursesTaken
            }

            const sections = await sectionsService.getAllPremiumSectionsForCourse(language);
            const lessons = await lessonsService.getAllPremiumLessons(language);

            res
                .status(200)
                .render("user/premiumSections", { userData, language, sections, lessons });
        } catch (error) {
            console.error(error);

            res
                .status(404)
                .send("Not found");
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
    }
}