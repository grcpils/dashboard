var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mainRoute = require('./routes/root');
var weatherRoute = require('./routes/weather');
var steamRoute = require('./routes/steam');
var exchangeRoute = require('./routes/exchange');
var rssRoute = require('./routes/rss');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/', mainRoute);
app.use('/weather', weatherRoute);
app.use('/steam', steamRoute);
app.use('/exchange', exchangeRoute);
app.use('/rss', rssRoute);

app.listen(3546, "0.0.0.0", () =>
    console.log(`API listening on port 3546!`),
);

module.exports = app;