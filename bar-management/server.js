require('./util/directories');
require('./util/environment');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var MongoUtil = require(FILE_DB);

const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const { Log } = require('./tools/dev-tools');
const { validateUserSession } = require('./util/middleware');

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// database
(async function start() {
  await MongoUtil.connect();
  
  app.use(cors({credentials: true}));
  app.use(express.json())
  app.use(express.urlencoded({extended:true}));
  app.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
  }));
  app.use(cookieParser("secretCode"));
  app.use(passport.initialize());
  app.use(passport.session());
  require('./util/passportConfig')(passport);
  app.use(validateUserSession);
  app.use(require(DIR_ROUTES + 'router.js'));
 
})();



