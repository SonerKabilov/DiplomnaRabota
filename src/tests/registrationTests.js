const { expect } = require('chai');
const sinon = require('sinon');
const accountController = require('../controllers/accountController');
const accountService = require('../services/accountService');
const coursesService = require('../services/coursesService');

describe('Account Controller - createUser', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                passwordRepeat: 'password123',
                languageData: JSON.stringify({ id: 1, language: 'English' })
            },
            session: {},
            flash: sandbox.stub()
        };
        res = {
            redirect: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should redirect to lessons if user registration is successful', async () => {
        const mockUser = [{ id: 1, user_types_id: 2 }];
        const mockCourses = [{ id: 1, language: 'English' }];

        sandbox.stub(accountService, 'createUser').resolves(mockUser);
        sandbox.stub(coursesService, 'getUserCourses').resolves(mockCourses);

        await accountController.createUser(req, res);

        expect(req.session.user_id).to.equal(1);
        expect(req.session.user_type).to.equal(2);
        expect(req.session.user_courses).to.deep.equal(mockCourses);
        expect(res.redirect.calledOnceWith('/English/free/lessons')).to.be.true;
    });

    it('should redirect to register with error flash if username or email is taken', async () => {
        sandbox.stub(accountService, 'createUser').resolves("Username and password taken");

        await accountController.createUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Потребителското име или имейл са вече заети')).to.be.true;
        expect(res.redirect.calledOnceWith('/register')).to.be.true;
    });

    it('should redirect to register with error flash if username or password validation fails', async () => {
        sandbox.stub(accountService, 'createUser').resolves("False regex");

        await accountController.createUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Невалидни потребителски данни')).to.be.true;
        expect(res.redirect.calledOnceWith('/register')).to.be.true;
    });

    it('should redirect to register with error flash if passwords do not match', async () => {
        sandbox.stub(accountService, 'createUser').resolves("Password does not match");

        await accountController.createUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Невалидни потребителски данни')).to.be.true;
        expect(res.redirect.calledOnceWith('/register')).to.be.true;
    });

    it('should redirect to register with error flash if there is an exception', async () => {
        sandbox.stub(accountService, 'createUser').rejects(new Error('Something went wrong'));

        await accountController.createUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Неуспешно създаване на потребител')).to.be.true;
        expect(res.redirect.calledOnceWith('/register')).to.be.true;
    });
});
