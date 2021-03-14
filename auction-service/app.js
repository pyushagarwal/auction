const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const _ = require('underscore')
const logger = require('../common/logger').intializeLogger("AUCTION-SERVICE")
const config = require('./config')
const mongoUtils = require('../common/mongoUtils')
const registerRoutes = function(){
    const auctionRouter = require('./routes/auction_route')
    const bidRouter = require('./routes/bidRoutes')
    app.post('/auction', auctionRouter.createAuction);
    app.get('/auction', auctionRouter.getAuctions);
    app.get('/auction/live', auctionRouter.getLiveAuctions);
    app.put('/auction/:auctionId', auctionRouter.updateAuctionById);
    app.get('/auction/:auctionId', auctionRouter.getAuctionsById);
    app.delete('/auction', auctionRouter.deleteAuctions);
    app.delete('/auction/:auctionId', auctionRouter.deleteAuctions);

    app.post('/auction/:auctionId/bid', bidRouter.makeBid);
    // app.get('/auction/:auctionId/bid', bidRouter.getAllBids);
}

mongo_connection_created = mongoUtils.create_connection(config.MONGOURL)
mongo_connection_created.then(function(){
    app = new express()
    app.use(morgan('combined'))
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    registerRoutes(app)

    app.listen(config.PORT, ()=>{
        logger.info(`AUCTION SERVICE started on port=${config.PORT}`)
    })
})

