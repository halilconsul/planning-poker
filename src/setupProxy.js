const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: 'http://localhost:3100',
        }),
    );
    app.use(
        proxy('/socket.io', {
            target: 'ws://localhost:3100',
            ws: true,
        }),
    );
};
