const bcrypt = require('bcrypt');
const { addDays, format } = require('date-fns');

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
    getCurrentUserCourse: async (userId, language) => {
        return await accountRepository.getCurrentUserCourse(userId, language);
    },
    updateUserDataForCompletedLesson: async (userData) => {
        const onLesson = await accountRepository.getUserProgress(userData.userId, userData.language);

        await accountRepository.updateUserCurrency(25, userData.userId);

        if (onLesson == userData.lessonSequence) {
            await accountRepository.updateUserProgress(onLesson + 1, userData.userId, userData.language);
        }
    },
    updateUserDataForCompletedPremiumLesson: async (userData) => {
        if(userData.sectionType === "storymode") {
            const onStorymodeLesson = await accountRepository.getUserStorymodeProgress(userData.userId, userData.language);

            if (onStorymodeLesson == userData.lessonSequence) {
                await accountRepository.updateUserCurrency(50, userData.userId);

                await accountRepository.updateUserStorymodeProgress(onStorymodeLesson + 1, userData.userId, userData.language);
            }
        }
    },
    getUserCurrency: async (userId) => {
        return await accountRepository.getUserCurrency(userId);
    },
    updateCurrency: async (currency, userId) => {
        return await accountRepository.updateCurrency(currency, userId);
    },
    updateMembership: async (userId, quantity, cost) => {
        const currentMembership = await accountRepository.getUserMembership(userId);
        const currentMembershipDate = new Date(currentMembership);
        const formattedCurrentMembershipDate = format(currentMembershipDate, 'yyyy-MM-dd HH:mm:ss');

        const now = new Date();
        const formattedCurrentDate = format(now, 'yyyy-MM-dd HH:mm:ss');

        const newMembershipDate = addDays(now, quantity);
        const formattedNewMembershipDate = format(newMembershipDate, 'yyyy-MM-dd HH:mm:ss');

        if (formattedCurrentMembershipDate < formattedCurrentDate) {
            console.log("No active membership");
            const userCurrency = await accountRepository.getUserCurrency(userId);

            if(cost !== '' && userCurrency >= cost) {
                try {
                    await accountRepository.updateMembership(formattedNewMembershipDate, userId);
                    await accountRepository.reduceCurrency(cost, userId);
                } catch (error) {
                    console.log(error);
                    return false;
                }

                return true;
            } else if (cost === '') {
                try {
                    await accountRepository.updateMembership(formattedNewMembershipDate, userId);
                } catch (error) {
                    console.log(error);
                    return false;
                }

                return true;
            } else {
                console.log("Not enough coins");
                return false;
            }
        } else {
            console.log("Active membership");
            return false;
        }
    },
    checkIfUserHasMembership: async (userId) => {
        const currentMembership = await accountRepository.getUserMembership(userId);
        const currentMembershipDate = new Date(currentMembership);
        const formattedCurrentMembershipDate = format(currentMembershipDate, 'yyyy-MM-dd HH:mm:ss');

        const now = new Date();
        const formattedCurrentDate = format(now, 'yyyy-MM-dd HH:mm:ss');

        if (formattedCurrentMembershipDate > formattedCurrentDate) {
            return true;
        }

        return false;
    }
}