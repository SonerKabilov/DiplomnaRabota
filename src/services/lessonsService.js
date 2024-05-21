const lessonsRepository = require('../database/repositories/lessonsRepository');

module.exports = {
    getAllLessons: async (language) => {
        const lessons = await lessonsRepository.queryLessonsForUser(language);
        
        return lessons;
    },
    getAllLessonsForAdmin: async (language, sectionSequence) => {
        return lessons = await lessonsRepository.queryLessons(language, sectionSequence);
    },
    addLesson: async (courseId, sectionSequence) => {
        const lessonSequence = await lessonsRepository.queryLastLessonSequence(courseId);
        
        const lessonToInsert = {
            preview: "",
            sequence: lessonSequence + 1,
            section_id: sectionSequence
        }

        await lessonsRepository.insertLesson(lessonToInsert);
    },
    getLessonId: async (lessonSequence, sectionId) => {
        const lessonId = await lessonsRepository.getLessonId(lessonSequence, sectionId);

        return lessonId;
    },
    getLessonPreview: async (lessonSequence, sectionId) => {
        const lessonPreview = await lessonsRepository.getLessonPreview(lessonSequence, sectionId);

        return lessonPreview;
    },
    updateLessonPreview: async (lessonToUpdate) => {
        const updatedPreview = await lessonsRepository.updateLessonPreview(lessonToUpdate);

        return updatedPreview;
    }
}