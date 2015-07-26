var generatePassword = require('password-generator');

module.exports = {
    generatePW: function() {
        return generatePassword(12, false, /[0-9a-zA-Z!@#$%]/);
    }
};