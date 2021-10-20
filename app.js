'use strict'

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieSession = require('cookie-session'),
    indexRoute = require('./routes/index'),
    ejs = require('ejs'),
    faviconURL = __dirname + '/public/images/favicon-32x32.png',
    publicDir = express.static(__dirname + '/public'),
    viewDir = __dirname + '/views',
    //cors = require('cors'),
    port = (process.env.PORT || 80),
    app = express()

app
   .set('views', viewDir)
   .set('port', port)
   .set('view engine', 'ejs')
   //.use(cors())
   .use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))
   .use(favicon(faviconURL))
   .use(publicDir)
   .use('/', indexRoute)


module.exports = app