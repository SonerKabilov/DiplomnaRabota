const coursesRepository = require('../database/repositories/coursesRepository');

module.exports = {
    getCourses: async () => {
        const courses = await coursesRepository.queryCourses();

        return courses;
    },
    getCourseId: async (language) => {
        const id = await coursesRepository.getCourseId(language);

        return id;
    }
}