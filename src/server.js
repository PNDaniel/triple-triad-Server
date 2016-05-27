(function () {

    'use strict';

    var express = require('express'),
        server = express(),
        http = require('http').createServer(server),
        morgan = require('morgan'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        session = require('express-session'),
        db = require('./database/db'),
        env = require('../secrets/environment');

    // Create a connection to the users' database
    db.connect()
        .then(function (uri) {
            // Sending the success to the log file
            console.log('@server.js: Connected to database.');
            server.set('db', true);
        })
        .catch(function (err) {
            // Sending the error to the log file
            console.log('@server.js: Can\'t connect to database.');
            console.log(err);
            server.set('db', false);
        });

    server.all('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        // Pass to next layer of middleware
        next();
    });

    // Outputs simple log information to the console.
    server.use(morgan('dev'));

    // Allows the server to read JSON files
    server.use(bodyParser.urlencoded({
        extended: false
    }));
    server.use(bodyParser.json());

    // Cookie Parser middleware to set cookie from server side
    server.use(cookieParser());

    // Enable Session for PassportJS
    server.use(session({
        secret: env.token,
        resave: false,
        saveUninitialized: true
    }));

    // Calls the router where all routes are called. This is done so the 'server.js' file is cleaner and more maintainable.
    require('./routes/router')(server, http);

    // Starts the server using received as input
    http.listen(process.argv[2], function () {
        console.log('Server listening on port ' + http.address().port);
    });

} ());