const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function loginValidation(data) {
    const errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is not valid';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is requird!';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password Must be required';
    }
    return {
        errors,
        isVaild: isEmpty(errors),
    };
};
