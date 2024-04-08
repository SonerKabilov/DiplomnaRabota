const sectionsRepository = require('../database/repositories/sectionsRepository');

module.exports = {
    getAllSections: async () => {
        const sections = await sectionsRepository.queryAllSections();

        return sections;
    },
    getAllSectionsForCourse: async (language) => {
        const sections = await sectionsRepository.querySectionsForCourse(language);

        return sections;
    },
    getSectionId: async (sectionDetails) => {
        const sectionId = await sectionsRepository.querySectionId(sectionDetails);

        return sectionId;
    },
    getSectionIdByLanguage: async (sectionDetails) => {
        const sectionId = await sectionsRepository.querySectionIdByLanguage(sectionDetails);

        return sectionId;
    },
    getSectionDescription: async (language, sectionSequence) => {
        const sectionDescription = await sectionsRepository.getSectionDescription(language, sectionSequence);

        return sectionDescription;
    },
    addSection: async (newSection) => {
        const lastSequence = await sectionsRepository.getLastSectionSequence(newSection.courseId);

        const sectionToInsert = {
            ...newSection,
            sequence: lastSequence + 1,
        }

        const section = await sectionsRepository.insertSection(sectionToInsert);

        return section;
    },
    updateSectionDescription: async (updatedSection) => {
        const section = await sectionsRepository.updateSectionDescription(updatedSection);

        return section;
    }
}