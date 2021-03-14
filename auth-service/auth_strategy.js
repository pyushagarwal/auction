const passport = require('passport')
const {JwtStrategy} = require('passport-jwt')
const userModel = require('./models/user')

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    userModel.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));