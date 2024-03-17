const sectionsRepository = require('../database/repositories/sectionsRepository');

module.exports = {
    getAllSections: async () => {
        const sections = await sectionsRepository.queryAllSections();
        return sections;
    }
}