const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const _ = require('underscore')
const config = require('./config')
const mongoUtils = require('../common/mongoUtils')
const logger = require('../common/logger')



mongo_connection_created = mongoUtils.create_connection(config.MONGOURL)
mongo_connection_created.then(function(){
    app = new express()
    app.use(morgan('combined'))
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    // registerRoutes(app)
    app.listen(config.PORT, ()=>{
        logger.info(`Auction app started on port=3000`)
    })
})

