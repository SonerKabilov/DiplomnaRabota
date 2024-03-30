const lessonsRepository = require('../database/repositories/lessonsRepository');

module.exports = {
    getAllLessons: async (language, sectionSequence) => {
        const lessons = await lessonsRepository.queryLessons(language, sectionSequence);
        
        return lessons;
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