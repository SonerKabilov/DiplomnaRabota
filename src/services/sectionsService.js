const sectionsRepository = require('../database/repositories/sectionsRepository');

module.exports = {
    getAllSections: async () => {
        const sections = await sectionsRepository.queryAllSections();

        return sections;
    },
    getSectionId: async (sectionSequence) => {
        const sectionId = await sectionsRepository.querySectionId(sectionSequence);

        return sectionId;
    },
    getSectionDescription: async (sectionSequence) => {
        const sectionDescription = await sectionsRepository.getSectionDescription(sectionSequence);

        return sectionDescription;
    },
    addSection: async (newSection) => {
        const lastSequence = await sectionsRepository.getLastSectionSequence();

        const sectionToInsert = {
            ...newSection,
            sequence: lastSequence + 1,
        }

        const section = await sectionsRepository.insertSection(sectionToInsert);

        return section;
    }
}