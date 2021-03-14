const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport')
const passportBearer = require('passport-http-bearer')
const passportJwt = require('passport-jwt')
const _ = require('underscore')
const axios = require('axios');
const logger = require('../common/logger').intializeLogger("AUTH-SERVICE")
const config = require('./config')
const mongoUtils = require('../common/mongoUtils')


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

const proxyRequest = async function(req, res, next) {
    let params = {
        method: req.method,
        url: targetUrl = `${config.AUCTION_SERVICE_URL}${req.url}`,
        headers: {
            userId: req.user.id
        },
        data: req.body,
        validateStatus: false
    }
    console.log(params);
    try {
        apiRes = await axios(params);
        res.status(apiRes.status).json(apiRes.data);
    } catch(e){
        logger.error(e);
        next(e)
    }
}

const registerRoutes = async function(app){
    isAuthenticated = passport.authenticate('jwt', {session:false})
    const userRouter = require("./routes/user")
    app.post("/user", userRouter.createUser);
    
    // -----------------authenitcated
    app.use(isAuthenticated);
    
    //ONLY ADMIN
    app.get("/user", isAdmin, userRouter.getUsers);
    app.delete("/user/:userId", isAdmin, userRouter.deleteUser);
    
    //SIGNEDINUSERS
    app.put("/user/:userId", userRouter.updateById);
    app.get("/user/:userId", userRouter.getUserById);

    //proxy requests
    //ONLY ADMIN
    app.post('/auction', isAdmin, proxyRequest);
    app.get('/auction', isAdmin, proxyRequest);
    app.put('/auction/:auctionId', isAdmin, proxyRequest);
    app.delete('/auction', isAdmin, proxyRequest);
    app.delete('/auction/:auctionId', isAdmin, proxyRequest);

    //SIGNEDINUSERS
    app.get('/auction/live', proxyRequest);
    app.get('/auction/:auctionId', proxyRequest);
    app.post('/auction/:auctionId/bid', proxyRequest);

    app.use(async (err, req, res, next)=>{
        res.status(500).json({
            "error": err.message
        })
    });
    
}


const setPassportStrategies = function(){
    const userModel = require('./models/user');
    opts = {}
    opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.SECRET;
    passport.use(new passportJwt.Strategy(opts, async function(jwt_payload, done) {
        // console.log(jwt_payload)
        if (_.isEqual(jwt_payload.role, ["admin"])) {
            user = await userModel.findOne({username: 'admin'});
            // console.log(user);
            if(user) { 
                done(null, user);
            } else {
                done(null, false);
            }
        } else {
            user = await userModel.findById({_id: jwt_payload.id});
            if(user) { 
                done(null, user);
            } else {
                done(null, false);
            };
        }
        
        //     function(err, user) {
        //     console.log(err,user, {_id: jwt_payload.id})
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, jwt_payload);
        //     } else {
        //         return done(null, false);
        //     }
        // });
    }));


}

mongo_connection_created = mongoUtils.create_connection(config.MONGOURL)

mongo_connection_created.then(async function(){
    app = new express()
    app.use(morgan('combined'))
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    setPassportStrategies()
    app.use(passport.initialize());
    registerRoutes(app)
    await createAdmin();
    app.listen(config.PORT, ()=>{
        logger.info(`Auth-service app started on port=${config.PORT}`)
    })
})


const createAdmin = async function() { 
    const userModel = require('./models/user');
    const admin = userModel({
        name: "admin",
        username: "admin",
        role: ['admin']
    });
    try {
        resp = await userModel.findOne({username: admin.username});
        if(resp){
            logger.info("Admin user already exists. Skipping creation");
        } else {
            await admin.save()
            logger.info("Admin user has been created");
        }
    } catch(err){
        logger.error("Failed to created admin user", err)
    }
}
// saveAdmin();


