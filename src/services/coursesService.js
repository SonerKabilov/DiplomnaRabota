const coursesRepository = require('../database/repositories/coursesRepository');

module.exports = {
    getCourses: async () => {
        const courses = await coursesRepository.queryCourses();

        return courses;
    },
    getCourseId: async (language) => {
        const id = await coursesRepository.getCourseId(language);

        return id;
    },
    checkIfCourseIsAdded: async (languages) => {
        const addedLanguages = await coursesRepository.queryCourses();

        for(addedLanguage of addedLanguages) {
            const index = languages.findIndex(language => language.language.toLowerCase() === addedLanguage.language.toLowerCase());

            if (index !== -1) {
                languages.splice(index, 1);
            }
        }

        return languages;
    },
    getUserCourses: async (userId) => {
        const userCourses = await coursesRepository.getUserCourses(userId);

        return userCourses;
    }
}