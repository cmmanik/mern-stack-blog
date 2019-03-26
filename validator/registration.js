const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function registration(data) {
    const errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!validator.isLength(data.name, { min: 3, max: 25 })) {
        errors.name = 'Name Must be between 3 to 25';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is requird';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is not valid';
    }
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is requird!';
    }
    if (!validator.isLength(data.password, { max: 20, min: 5 })) {
        errors.password = 'Password Must be between 5 to 20';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password Must be required';
    }
    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password does not Match';
    }
    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password Must be required';
    }
    return {
        errors,
        isVaild: isEmpty(errors),
    };
};
