(function () {

    'use strict';

    // Main router where all authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        // Require the routes related to facebook's authentication
        require('./auth-facebook')(server);

        // Require the routes related to twitter's authentication
        require('./auth-twitter')(server);

        // Require the routes related to triple triad's authentication
        require('./auth-triple-triad')(server);

    };

} ());