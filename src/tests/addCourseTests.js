const { expect } = require('chai');
const sinon = require('sinon');
const coursesController = require('../controllers/coursesController');
const coursesService = require('../services/coursesService');

describe('Courses Controller - addCourse', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                language: 'English',
                cyrillicName: 'Английски език'
            },
            flash: sandbox.stub(),
            redirect: sandbox.stub()
        };
        res = {
            redirect: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should successfully add a course and redirect with success message', async () => {
        req.body.iso2 = 'US';

        sandbox.stub(coursesService, 'addCourse').resolves();

        await coursesController.addCourse(req, res);

        expect(req.flash.calledOnceWith('success', 'Успешно добавяне на курс!')).to.be.true;
        expect(res.redirect.calledOnceWith('/admin')).to.be.true;
    });

    it('should be a none existing course', async () => {
        sandbox.stub(coursesService, 'addCourse').resolves(true);

        await coursesController.addCourse(req, res);
    });

    it('should handle error when ISO2 code is invalid', async () => {
        req.body.iso2 = 'INVALID';

        sandbox.stub(coursesService, 'addCourse').throws(new Error('Invalid ISO2 code'));

        await coursesController.addCourse(req, res);

        expect(req.flash.calledOnceWith('error', 'Грешка в ISO2 код!')).to.be.true;
        expect(res.redirect.calledOnceWith('/admin/add/course')).to.be.true;
    });

    it('should handle general error during course addition', async () => {
        req.body.iso2 = 'US';
        
        sandbox.stub(coursesService, 'addCourse').throws(new Error('Something went wrong'));

        await coursesController.addCourse(req, res);

        expect(req.flash.calledOnceWith('error', 'Неуспешно добавяне на курс!')).to.be.true;
        expect(res.redirect.calledOnceWith('/admin/add/course')).to.be.true;
    });
});
