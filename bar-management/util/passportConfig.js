const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const User = require('../class/user.class')
const {Log} = require('../tools/dev-tools');

module.exports = async function (passport) {
    /**DEBUG */Log.print().titled("passportConfig: passport parameter:  ", passport ? "true" : "false") ;
    passport.use(
        new localStrategy((username, password, done) => {
            Log.print("PassportConfig.js:11: ",username, password)
          User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) throw err;
              if (result === true) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          });
        })
      );

    passport.serializeUser((user,done) => {
        done(null, user._id)
    });
    passport.deserializeUser((id, done) => {
        User.findOne({_id: id}, (err, user) => {
            done(err, user)
        })
    })
};
