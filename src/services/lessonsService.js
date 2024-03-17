const lessonsRepository = require('../database/repositories/lessonsRepository');

module.exports = {
    getAllLessons: async (sectionSequence) => {
        const lessons = await lessonsRepository.queryLessons(sectionSequence);
        return lessons;
    }
}