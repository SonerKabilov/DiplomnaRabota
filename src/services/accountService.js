const bcrypt = require('bcrypt');

const accountRepository = require('../database/repositories/accountRepository');
const coursesRepository = require('../database/repositories/coursesRepository');

module.exports = {
    createUser: async (userInformation) => {
        const checkIfUserExists = await accountRepository.checkIfUserExists(userInformation.username, userInformation.email);

        if (!checkIfUserExists && userInformation.password == userInformation.passwordRepeat) {
            userInformation.password = await bcrypt.hash(userInformation.password, 12);

            if (userInformation.userTypesId && userInformation.userTypesId === 1) {
                const user = await accountRepository.createAdminProfile(userInformation);

                return user;
            } else {
                const courses = await coursesRepository.queryCourses();
                let isAdded = false;

                for (const course of courses) {
                    if (course.id === userInformation.courseId) {
                        isAdded = true;
                    }
                }

                if (isAdded) {
                    const user = await accountRepository.createUserProfile(userInformation);

                    return user;
                }
            }
        }

        return false;
    },
    loginUser: async (userCredentials) => {
        const user = await accountRepository.findUser(userCredentials.username);

        if (user) {
            const checkPassword = await bcrypt.compare(userCredentials.password, user.password);

            if (checkPassword != "") {
                const userCourses = await coursesRepository.getUserCourses(user.id);

                if (userCourses.length != 0) {
                    for (const course of userCourses) {
                        if (course.language === userCredentials.selectedLanguage) {
                            return user;
                        }
                    }

                    userCredentials.selectedLanguage = userCourses[0].language;
                }

                return user;
            }
        }

        return false;
    },
    updateUserDataForCompletedLesson: async (userData) => {
        const onLesson = await accountRepository.getUserProgress(userData.userId);

        await accountRepository.updateUserCurrency(50, userData.userId);

        if (onLesson == userData.lessonSequence) {
            await accountRepository.updateUserProgress(onLesson + 1, userData.userId, userData.language);
        }
    },
    getUserCurrency: async (userId) => {
        const currency = await accountRepository.getUserCurrency(userId);

        return currency;
    }
}