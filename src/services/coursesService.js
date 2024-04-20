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

        for (addedLanguage of addedLanguages) {
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
    },
    addCourse: async (languageData) => {
        const addedLanguages = await coursesRepository.queryCourses();

        let isAdded = false;

        for (const language of addedLanguages) {
            if (language === languageData.language) {
                isAdded = true;
                break;
            }
        }

        if (!isAdded) {
            await coursesRepository.addCourse(languageData);
        }
    },
    addCourseForUser: async (addCourseData) => {
        const addedCourses = await coursesRepository.getUserCourses(addCourseData.userId);

        let isAdded = false;

        for (const course of addedCourses) {
            if (addCourseData.courseId === course.id) {
                isAdded = true;
                break;
            }
        }

        if (!isAdded) {
            await coursesRepository.addCourseForUser(addCourseData);
        }
    }
}