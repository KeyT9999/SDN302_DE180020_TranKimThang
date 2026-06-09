const session = require('express-session');
const MongoStore = require('connect-mongo');

function configSession(app) {
  app.use(
    session({
      secret: 'my-session-secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/node_session'
      }),
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true
      }
    })
  );
}

module.exports = configSession;
