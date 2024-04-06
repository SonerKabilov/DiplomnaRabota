const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');

module.exports = {
    getLessons: async (req, res) => {
        try {
            const { courseId, sectionSequence } = req.params;
            const userId = req.session.user_id;
            const userType = req.session.user_type;

            const sections = await sectionsService.getAllSections();
            const lessons = await lessonsService.getAllLessons(courseId, sectionSequence);

            res.status(200).render("user/lessons", { userId, userType, sections, lessons });
        } catch(error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showSectionDetails: async (req, res) => {
        const { language, sectionSequence } = req.params;
        
        const lessons = await lessonsService.getAllLessons(language, sectionSequence);
        const sectionData = await sectionsService.getSectionDescription(language, sectionSequence);

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

        res.status(201).redirect("/admin")
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

        res.status(200).redirect(`/admin/show/${language}/section/${sectionSequence}/lessons`);
    }
}