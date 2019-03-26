const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validExperience(data) {
    const errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (validator.isEmpty(data.school)) {
        errors.school = 'school field is requird!';
    }
    if (validator.isEmpty(data.degree)) {
        errors.degree = 'degree Must be required';
    }
    if (validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'fieldofstudy  Fiels Must be required';
    }
    if (validator.isEmpty(data.from)) {
        errors.from = 'From date Fiels Must be required';
    }
    return {
        errors,
        isVaild: isEmpty(errors),
    };
};
