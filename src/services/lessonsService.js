const coursesRepository = require('../database/repositories/coursesRepository');
const lessonsRepository = require('../database/repositories/lessonsRepository');

module.exports = {
    getAllLessons: async (language) => {
        return await lessonsRepository.queryLessonsForUser(language);
    },
    getAllPremiumLessons: async (language) => {
        return await lessonsRepository.queryPremiumLessonsForUser(language);
    },
    getAllLessonsForAdmin: async (language, sectionSequence) => {
        return lessons = await lessonsRepository.queryLessons(language, sectionSequence);
    },
    getAllPremiumLessonsForAdmin: async (language, type) => {
        return lessons = await lessonsRepository.queryPremiumLessons(language, type);
    },
    addLesson: async (courseId, sectionId) => {
        const lastSectionId = await coursesRepository.queryLastSectionForCourse(courseId);

        if (lastSectionId === sectionId) {
            const lessonSequence = await lessonsRepository.queryLastLessonSequence(courseId);
        
            const lessonToInsert = {
                preview: "",
                sequence: lessonSequence + 1,
                section_id: sectionId
            }
    
            await lessonsRepository.insertLesson(lessonToInsert);
            return true;
        } else {
            return false;
        }
    },
    addPremiumLesson: async (courseId, sectionId, type) => {
        const lessonSequence = await lessonsRepository.queryLastPremiumLessonSequence(courseId, type);
        
        const lessonToInsert = {
            sequence: lessonSequence + 1,
            section_id: sectionId
        }

        await lessonsRepository.insertPremiumLesson(lessonToInsert);
    },
    getLessonId: async (lessonSequence, sectionId) => {
        return await lessonsRepository.getLessonId(lessonSequence, sectionId);
    },
    getPremiumLessonId: async (lessonSequence, sectionId) => {
        return await lessonsRepository.getPremiumLessonId(lessonSequence, sectionId);
    },
    getLessonPreview: async (lessonSequence, sectionId) => {
        return await lessonsRepository.getLessonPreview(lessonSequence, sectionId);
    },
    updateLessonPreview: async (lessonToUpdate) => {
        return await lessonsRepository.updateLessonPreview(lessonToUpdate);
    },
    deleteFreeLesson: async (sectionId, lessonSequence, language) => {
        return await lessonsRepository.updateFreeLessonDeleteStatus(sectionId, lessonSequence, language);
    }
}