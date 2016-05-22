(function () {

    'use strict';

    var express = require('express'),
        server = express(),
        http = require('http').Server(server),
        morgan = require('morgan'),
        cookieParser = require('cookie-parser');

    // Outputs simple log information to the console.
    server.use(morgan('dev'));

    // Cookie Parser middleware to set cookie from server side
    server.use(cookieParser());

    // Calls the router where all routes are called. This is done so the 'server.js' file is cleaner and more maintainable.
    require('./routes/router')(server, http);

    // Starts the server using received as input
    http.listen(process.argv[2], function () {
        console.log('Server listening on port ' + http.address().port);
    });

} ());