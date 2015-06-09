
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nagusq-wx'
    },
    port: 18080,
    mongoClientConfig: {
        server: {
            poolSize: 5,
            socketOptions: { autoReconnect: true }
        }
    },
    db: 'mongodb://127.0.0.1/ynu'
  },

  production: {
    mongoClientConfig: {
        server: {
            poolSize: 10,
            socketOptions: { autoReconnect: true }
        }
    },
    port: 18080,
    db: 'db connection string',
    wxqyh: {
      token: 'token',
      encodingAESKey: 'key',
      corpId: 'corpId',
      secret: 'secret',
      agentId: -1 // Correct Agent Id
    }
  }
};

module.exports = config[env];
