var express = require('express');
var glob = require('glob');

//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');

var MongoClient = require('mongodb').MongoClient;

module.exports = function(app, config) {

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  app.use(session({
    secret: 'nagu.cc sessionkey',
    resave: true,
    saveUninitialized: true
  }));

  MongoClient.connect(config.db, config.mongoClentConfig, function(err,db){
    if(err) console.log(err);
    
    db.on('close', function () {
        console.log('db closed');
        db.open(function () {});
    });
    db.on('reconnect', function () {
        console.log('db event:reconnect');
    })
    var controllers = glob.sync(config.root + '/app/controllers/*.js');
    controllers.forEach(function (controller) {
      require(controller)(app, config, db);
    });
  });
};