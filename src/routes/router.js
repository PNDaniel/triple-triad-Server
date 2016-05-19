(function () {

    'use strict';

    module.exports = function (server) {

        require('./auth.js')(server);

        // Status route
        server.route({
            method: 'GET',
            path: '/api/status',
            handler: function (request, reply) {
                reply({
                    'ip': server.info.ip,
                    'port': server.info.port,
                    'conn_db': false,
                    'conn_fb': false,
                    'conn_tw': false
                });
            }
        });

    };

} ());