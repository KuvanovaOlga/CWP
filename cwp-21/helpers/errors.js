const express = require('express');

express.response.error = function(error) {
    if (!error.code) {
        error = {
            message: error.toString(),
            code: 'server_error',
            status: 500
        };
    }

    this.status(error.status).json(error);
};

module.exports = {
    invalidId: {
        message: 'Invalid id',
        code: 'invalid_id', status: 400 },
    notFound: {
        message: 'Entity not found',
        code: 'entity_not_found', status: 404 },
    wrongCredentials: {
        message: 'Email or password are wrong',
        code: 'wrong_credentials', status: 404 },
    accessDenied: {
        message: 'Access denied',
        code: 'access_denied', status: 403 },
    createError: {
        message: 'Invalid data',
        code: 'invalid_data', status: 400 },
    optionsError: {
        message: 'Invalid options',
        code: 'invalid_options', status: 400 }
};