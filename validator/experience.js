const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validExperience(data) {
    const errors = {};

    data.tittle = !isEmpty(data.tittle) ? data.tittle : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (validator.isEmpty(data.tittle)) {
        errors.tittle = 'Tittle field is requird!';
    }
    if (validator.isEmpty(data.company)) {
        errors.company = 'Company Must be required';
    }
    if (validator.isEmpty(data.from)) {
        errors.from = 'From date Fiels Must be required';
    }
    return {
        errors,
        isVaild: isEmpty(errors),
    };
};
