const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const sanitize = require('express-mongo-sanitize');
const config = require('./config');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');
const flash = require('connect-flash');
const fs = require('fs');
const path = require('path');
const spdy = require('spdy');
const helmet = require('helmet');
const compression = require('compression');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, config.db.options);

const app = express();
const db = mongoose.connection;
const certificates = {
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/certificate.pem')),
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.pem')),
};

require('./config/passport')(passport);

app.use(flash());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(sanitize());
app.use(helmet());
app.use(compression());

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, './views'));

app.use(session({
  secret: '5c276b3a6a01834e4fMa308bed49874e9e066c9b6567548a422e9b96f4bcea4',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, '../dist/')));

require('./routes')(app, passport);

db.on('error', console.error.bind(console, 'Connection error: '));

db.once('open', () => {
  User.find({})
    .then((users) => {
      if (!users.length) {
        const admin = new User({
          email: 'demo@example.com',
          password: '12345',
          role: 'Administrator',
        });
        admin.save();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  app.listen(config.port);
  spdy.createServer(certificates, app).listen(8181);
});
