/**
 * @file passport
 * @author luodongyang
 * @date 2015-11-08
 */
var passport = require('passport'),
    // 使用本地登陆逻辑
    LocalStrategy = require('passport-local').Strategy,
    // 使用bcrypt进行密码加密
    bcrypt = require('bcrypt');

passport.serializeUser(function (user, done)  {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    User.findOne({email: email}, function (err, result) {
        done(err, result);
    });
});

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }),
    function (email, password, done) {
        User.findOne({email: email}, function (err, result) {
            if (err) {
                return done(err);
            }

            if (!result) {
                return done(null, false, {message: 'Incorrect email.'});
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (!res) {
                    return done(null, false, {
                         message: 'Invalid Password'
                    });
                }
                var returnUser = {
                    email: result.email,
                    createAt: user.createdAt,
                }
                return done(null, returnUser, {
                    message: 'Logged in successfully'
                });
            });
        });
    }
);