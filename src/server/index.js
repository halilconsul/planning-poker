const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path');
require('dotenv').config();

const appConfig = require('./config/config');

//Databases configuration
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(appConfig.DB.URL);

//App configuration
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(
    session({
        secret: 'freeplanningpoker',
        resave: true,
        saveUninitialized: true,
    }),
);
app.use(flash());

//Passport Initialization
app.use(passport.initialize());
app.use(passport.session());
require('./controllers/auth')(passport);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, PATCH, HEAD, OPTIONS, TRACE');
    next();
});

//Routes
require('./routes/games')(app);
require('./routes')(app, passport);

const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.resolve(__dirname, '../../build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
    });
}
const withSocketsController = require('./controllers/sockets');

withSocketsController(
    socketIO.listen(
        app.listen(port, () => {
            console.log(`App is listening on ${port}`);
        }),
    ),
);
