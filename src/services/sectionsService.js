const sectionsRepository = require('../database/repositories/sectionsRepository');

module.exports = {
    getAllSections: async () => {
        return await sectionsRepository.queryAllSections();
    },
    getAllPremiumSections: async () => {
        return await sectionsRepository.queryAllPremiumSections();
    },
    getAllSectionsForCourse: async (language) => {
        return await sectionsRepository.querySectionsForCourse(language);
    },
    getAllPremiumSectionsForCourse: async (language) => {
        return await sectionsRepository.queryPremiumSectionsForCourse(language);
    },
    getSectionId: async (sectionDetails) => {
        return await sectionsRepository.querySectionId(sectionDetails);
    },
    getPremiumSectionId: async (sectionDetails) => {
        return await sectionsRepository.queryPremiumSectionId(sectionDetails);
    },
    getPremiumSectionIdByLanguage: async (sectionDetails) => {
        return await sectionsRepository.queryPremiumSectionIdByLanguage(sectionDetails);
    },
    getSectionIdByLanguage: async (sectionDetails) => {
        return await sectionsRepository.querySectionIdByLanguage(sectionDetails);
    },
    getSectionData: async (language, sectionSequence) => {
        return await sectionsRepository.getSectionData(language, sectionSequence);
    },
    getPremiumSectionData: async (language, type) => {
        return await sectionsRepository.getPremiumSectionData(language, type);
    },
    addSection: async (newSection) => {
        if (newSection.sectionType === "free") {
            const lastSequence = await sectionsRepository.getLastSectionSequence(newSection.courseId);

            const sectionToInsert = {
                ...newSection,
                sequence: lastSequence + 1
            }
    
            await sectionsRepository.insertSection(sectionToInsert);

            return true;
        } else if (newSection.sectionType === "premium") {
            const premiumSectionTypeId = await sectionsRepository.getPremiumSectionTypeId(newSection.premiumSection);
            const is_added = await sectionsRepository.checkIfPremiumSectionExists(premiumSectionTypeId, newSection.courseId);

            if (!is_added) {
                const sectionToInsert = {
                    ...newSection,
                    premiumSectionTypeId
                }
    
                await sectionsRepository.insertPremiumSection(sectionToInsert);

                return true;
            } else {
                return false;
            }
        }
    },
    updateSectionDescription: async (updatedSection) => {
        return await sectionsRepository.updateSectionDescription(updatedSection);
    },
    deleteFreeSection: async (id) => {
        const has_lessons = await sectionsRepository.checkIfSectionHasLessons(id);

        if(!has_lessons) {
            await sectionsRepository.updateFreeSectionDeleteStatus(id);

            return true;
        } else {
            return false;
        }
    }
}