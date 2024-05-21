const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');

module.exports = {
    getLessons: async (req, res) => {
        try {
            const { language, sectionSequence } = req.params;

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
                .render("user/lessons", { userData, language, sectionSequence, sections, lessons });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send("Internal Server Error");
        }
    },
    showSectionDetails: async (req, res) => {
        const { language, sectionSequence } = req.params;

        const lessons = await lessonsService.getAllLessonsForAdmin(language, sectionSequence);
        const sectionData = await sectionsService.getSectionDescription(language, sectionSequence);

        if (!sectionData) {
            req.flash("error", "Не съществува такъв раздел");

            return res.redirect("/admin");
        }

        const sectionDetails = {
            id: sectionData.id,
            language,
            sectionSequence,
            lessons,
            description: sectionData.description
        }

        res.render("admin/showSectionDetails", { sectionDetails })
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
            sectionType: section.sectionTypes
        }

        await sectionsService.addSection(newSection);

        req.flash("success", "Успешно създаден раздел!");

        res
            .status(201)
            .redirect("/admin");
    },
    updateSectionDescription: async (req, res) => {
        const { language, sectionSequence } = req.params;
        const { description } = req.body;

        const updatedSection = {
            language,
            sequence: sectionSequence,
            description
        }

        await sectionsService.updateSectionDescription(updatedSection);

        req.flash("success", "Успешно редактирано описание на раздел!");

        res
            .status(200)
            .redirect(`/admin/show/${language}/section/${sectionSequence}/lessons`);
    }
}