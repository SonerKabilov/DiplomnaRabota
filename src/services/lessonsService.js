const {v4: uuid} = require("uuid");

const lessonsRepository = require('../database/repositories/lessonsRepository');

module.exports = {
    getAllLessons: async (sectionSequence) => {
        const lessons = await lessonsRepository.queryLessons(sectionSequence);
        return lessons;
    },
    addLesson: async (sectionSequence) => {
        const lessonSequence = await lessonsRepository.queryLastLessonSequence();
        
        const lessonToInsert = {
            preview: "",
            sequence: lessonSequence + 1,
            section_id: sectionSequence
        }

        await lessonsRepository.insertLesson(lessonToInsert);
    },
    getLessonId: async (lessonSequence) => {
        const lessonId = await lessonsRepository.getLessonId(lessonSequence);
        return lessonId;
    }
}