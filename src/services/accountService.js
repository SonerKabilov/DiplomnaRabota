const bcrypt = require('bcrypt');

const accountRepository = require('../database/repositories/accountRepository');

module.exports = {
    createUser: async (userInformation) => {
        const checkIfUserExists = await accountRepository.checkIfUserExists(userInformation.username, userInformation.email);

        if(!checkIfUserExists && userInformation.password == userInformation.passwordRepeat) {
            userInformation.password = await bcrypt.hash(userInformation.password, 12);

            if(userInformation.userTypesId && userInformation.userTypesId === 1) {
                await accountRepository.createAdminProfile(userInformation);

                return true;
            } else {
                await accountRepository.createUserProfile(userInformation);

                return true;
            }
        }

        return false;
    },
    loginUser: async (userCredentials) => {
        const user = await accountRepository.findUser(userCredentials.username);

        if(user) {
            const checkPassword = await bcrypt.compare(userCredentials.password, user.password);
// return checkPassword;
            if(checkPassword) {
                return user;
            }
        }

        return false;
    }
}