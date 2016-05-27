(function () {

    'use strict';

    // Main router for the socket connections.
    module.exports = function (io) {

        // Require the declaration of lobby socket connections. 
        require('./lobby')(io);

    };

} ());