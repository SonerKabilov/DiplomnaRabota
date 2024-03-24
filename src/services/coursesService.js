const coursesRepository = require('../database/repositories/coursesRepository');

module.exports = {
    getCourses: async () => {
        const courses = await coursesRepository.queryCourses();

        return courses;
    }
}