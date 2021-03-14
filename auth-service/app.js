const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const _ = require('underscore')
const config = require('./config')
const mongoUtils = require('../common/mongoUtils')
const logger = require('../common/logger')


const isAdmin = function(req, res, next) {
    try{
        if(_.contains(req.user.role, 'admin')){
            return next()
        }
        res.status(403).json()
    } catch(e) {
        logger.error(e)
        next(e)
    }
}

const registerRoutes = async function(app){
    isAuthenticated = passport.authenticate('jwt', {session:false})
    const userRouter = require("./routes/user")
    app.post("/user", userRouter.createUser);
    
    // -----------------authenitcated
    app.get("/user", isAuthenticated, isAdmin, userRouter.getUsers);
    app.delete("/user/:userId", isAuthenticated, isAdmin, userRouter.deleteUser);
    app.put("/user/:userId", isAuthenticated, userRouter.updateById);
    app.get("/user/:userId", isAuthenticated, userRouter.getUserById);


    app.use(async (err, req, res, next)=>{
        res.status(500).json({
            "error": err.message
        })
    });
    
}


const setPassportStrategies = function(){
    opts = {}
    opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.SECRET;
    passport.use(new passportJwt.Strategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload)
        done(null, jwt_payload)
        // const userModel = require('./models/user');
        // userModel.findOne({id: jwt_payload.sub}, function(err, user) {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //     }
        // });
    }));
}

mongo_connection_created = mongoUtils.create_connection(config.MONGOURL)

mongo_connection_created.then(function(){
    app = new express()
    app.use(morgan('combined'))
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    setPassportStrategies()
    app.use(passport.initialize());
    registerRoutes(app)
    app.listen(config.PORT, ()=>{
        logger.info(`Auction app started on port=3000`)
    })
})


const saveAdmin = async function() { 
    const userModel = require('./models/user');
    a = new userModel({
        name: "Piyush Agarwal",
        username: "pyush"
    })
    try{
        doc = await a.save()
        logger.info(doc)
    } catch(err){
        logger.info("Cannot store user in db",err)
    }
}
// saveAdmin();


