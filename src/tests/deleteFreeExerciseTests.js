const { expect } = require('chai');
const sinon = require('sinon');
const lessonsController = require('../controllers/lessonsController');
const lessonsService = require('../services/lessonsService');

describe('Lessons Controller - deleteFreeLesson', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {
                language: 'English',
                sectionId: '1',
                lessonSequence: '1'
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

    it('should delete a lesson and redirect with success message', async () => {
        sandbox.stub(lessonsService, 'deleteFreeLesson').resolves();

        await lessonsController.deleteFreeLesson(req, res);

        expect(req.flash.calledOnceWith('success', 'Успешно изтриване на урок!')).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.redirect.calledOnceWith('/admin')).to.be.true;
    });

    it('should handle exceptions and redirect with error message', async () => {
        sandbox.stub(lessonsService, 'deleteFreeLesson').resolves();

        await lessonsController.deleteFreeLesson(req, res);

        expect(req.flash.calledOnceWith('error', 'Неуспешно изтриване на урок!')).to.be.true;
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.redirect.calledOnceWith('/admin')).to.be.true;
    });
});
