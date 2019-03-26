const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function postValidation(data) {
    const errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (validator.isEmpty(data.text)) {
        errors.text = 'Text field is requird!';
    }
    if (!validator.isLength(data.text, { min: 6, max: 960 })) {
        errors.text = 'Post Length must be 10 to 960 Chracter';
    }
    return {
        errors,
        isVaild: isEmpty(errors),
    };
};
