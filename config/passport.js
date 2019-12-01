var passport = require("passport");
var User = require("../models/User");
var LocalStrategy = require("passport-local").Strategy;
var bcryptjs = require("bcryptjs")

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      console.log(email, password);
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Email is already in use" });
        }

        var newUser = new User();

        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser
          .save()
          .then(result => {
            done(null, newUser);
          })
          .catch(err => {
            console.log("err: " + err);
            done(err);
          });
      });
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      console.log(email, password);
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "No user with this email Id" });
        }
        bcryptjs.compare(password, user.password).then(isCorrect=>{
          if (! isCorrect )
          return done(null,false , {message:"Wrong Password"})
          else
          return done(null ,user)
        }).catch();

      });
    }
  )
);
