const { expect } = require('chai');
const sinon = require('sinon');
const accountController = require('../controllers/accountController');
const accountService = require('../services/accountService');
const coursesService = require('../services/coursesService');

describe('Account Controller - loginUser', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                username: 'testuser',
                password: 'testpassword',
                selectedLanguage: 'English'
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

    it('should redirect to lessons if user login is successful and user type is 2', async () => {
        const mockUser = { id: 1, user_types_id: 2, currency: '1000' };
        const mockCourses = [{ id: 1, language: 'English' }];

        sandbox.stub(accountService, 'loginUser').resolves(mockUser);
        sandbox.stub(coursesService, 'getUserCourses').resolves(mockCourses);

        await accountController.loginUser(req, res);

        expect(req.session.user_id).to.equal(1);
        expect(req.session.user_type).to.equal(2);
        expect(req.session.user_currency).to.equal('1000');
        expect(req.session.user_courses).to.deep.equal(mockCourses);
        expect(res.redirect.calledOnceWith('/English/free/lessons')).to.be.true;
    });

    it('should redirect to login with error flash if user login fails', async () => {
        sandbox.stub(accountService, 'loginUser').rejects(new Error('User login fails'));

        await accountController.loginUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Грешно потребителско име или парола')).to.be.true;
        expect(res.redirect.calledOnceWith('/login')).to.be.true;
    });

    it('should redirect to login with error flash if there is an exception', async () => {
        sandbox.stub(accountService, 'loginUser').rejects(new Error('Something went wrong'));

        await accountController.loginUser(req, res);

        expect(req.flash.calledOnceWith('error', 'Грешно потребителско име или парола')).to.be.true;
        expect(res.redirect.calledOnceWith('/login')).to.be.true;
    });
});