const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function profileValidation(data) {
    const errors = {};
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!validator.isLength(data.handle, { max: 40, min: 2 })) {
        errors.handle = 'Handle needs between 2 or 40 Chracter';
    }
    if (validator.isEmpty(data.handle)) {
        errors.handle = 'Profile Handle is Required!';
    }
    if (validator.isEmpty(data.status)) {
        errors.status = 'Status is required!';
    }
    if (validator.isEmpty(data.skills)) {
        errors.skills = 'Skills is required!';
    }
    if (!isEmpty(data.website)) {
        if (!validator.isURL(data.website)) {
            errors.website = 'Not a valid url';
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid url';
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid url';
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid url';
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid url';
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid url';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
