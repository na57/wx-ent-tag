var express = require('express'),
  config = require('./config/config'),
  glob = require('glob');


var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

//console.log(process.env.NODE_ENV);
app.listen(config.port);
