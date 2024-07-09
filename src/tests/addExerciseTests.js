const { expect } = require('chai');
const sinon = require('sinon');
const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const exercisesController = require('../controllers/exercisesController');

describe('Exercises Controller - addExercise', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {
                language: 'English',
                sectionId: '1',
                lessonSequence: '1'
            },
            body: {
                task: 'Test Task',
                correctAnswer: 'Test Answer',
                taskTypes: 1,
                optionTypes: 1,
                options: ['Option 1', 'Option 2', 'Option 3']
            },
            flash: sandbox.stub()
        };
        res = {
            status: sandbox.stub().returnsThis(),
            redirect: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should add an exercise and redirect to lesson page if successful', async () => {
        sandbox.stub(lessonsService, 'getLessonId').resolves(1);
        sandbox.stub(exercisesService, 'addExercise').resolves(true);

        await exercisesController.addExercise(req, res);

        expect(req.flash.calledOnceWith('success', 'Успешно добавено упражнение!')).to.be.true;
        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.redirect.calledOnceWith('/admin/show/English/sectionId/1/lesson/1')).to.be.true;
    });

    it('should redirect with error if exercise data is invalid', async () => {
        sandbox.stub(lessonsService, 'getLessonId').resolves(1);
        sandbox.stub(exercisesService, 'addExercise').resolves(false);

        await exercisesController.addExercise(req, res);

        expect(req.flash.calledOnceWith('error', 'Грешни данни за упражнение!')).to.be.true;
        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.redirect.calledOnceWith('/admin/add/English/sectionId/1/lesson/1/exercise')).to.be.true;
    });

    it('should handle exceptions and redirect with error', async () => {
        const error = new Error('Something went wrong');
        sandbox.stub(lessonsService, 'getLessonId').resolves(1);
        sandbox.stub(exercisesService, 'addExercise').rejects(error);

        await exercisesController.addExercise(req, res);

        expect(req.flash.calledOnceWith('error', 'Грешка при добавяне на упражнение!')).to.be.true;
        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.redirect.calledOnceWith('/admin/add/English/sectionId/1/lesson/1/exercise')).to.be.true;
    });
});
