const Router = require('express').Router;
const _ = require('underscore');
const auctionModel = require('../models/auction')

const logger = require('../../common/logger').getLogger();


const createAuction = async function(req, res, next){
    try {
        let payload = req.body;
        let auction = new auctionModel(payload)
        await auction.save()
        logger.info(`Created auction with ${auction.id}`)
        res.status(201).send(auction)
    }catch(err){
        logger.error(err)
        next(err)
    }
}

const updateAuctionById = async function(req, res, next){
    try {
        let headers = req.headers
        let auctionId = req.params.auctionId
        auctions = await auctionModel.findById({_id:auctionId})
        console.log(auctions)
        if(!auctions)
            return res.status(404).json();
        
        let payload = req.body;
        if (!_.isNull(auctions.winner)) {
            // bids have been placed
            return res.status(400).json({
                "error": "Auction cannot be updated as bids have been placed"
            })
        }
        if (payload.winner && !headers.isadmin)
            return res.status(400).json({
                "error": "field cannot be updated"
            });
        auctions = _.extend(auctions, payload);
        await auctions.save();
        logger.info(`Updated auction with ${auctions.id}`)
        res.status(201).send(auctions);
    }catch(err){
        logger.error(err)
        next(err)
    }
}

const getAuctions = async function(req, res, next){
    logger.info("BEGIN getAuctions()")
    try {
        let query = req.query
        if (_.isUndefined(query))
            query = {}
        let auctions = await auctionModel.find(query)
        res.status(200).send(auctions)
    }catch(err){
        logger.error(err)
        next(err)
    }
}

const getAuctionsById = async function(req, res, next) {
    try {
        let auctions = await auctionModel.findById({_id: req.params.auctionId})
        if (!auctions){
            return res.status(404).json()
        }
        res.status(200).send(auctions)
    }catch(err){
        logger.error(err)
        next(err)
    }
}

const getLiveAuctions = async function(req, res, next) {
    currTime = new Date();
    req.query = {
        startTime : {
            $lt : currTime
        },
        endTime: {
            $gt: currTime
        }
    }
    getAuctions(req, res, next);
}

const deleteAuctions = async function(req, res, next) {
    try {
        let condition = {}
        if (req.params.auctionId) {
            condition = {_id : req.params.auctionId}
        }
        logger.info(condition)
        let response = await auctionModel.deleteMany(condition);
        res.status(202).json({
            deletedCount : response.deletedCount
        });
    }catch(err){
        logger.error(err)
        next(err)
    }
}

module.exports = {
    createAuction: createAuction,
    getAuctions: getAuctions,
    updateAuctionById: updateAuctionById,
    getAuctionsById: getAuctionsById,
    deleteAuctions: deleteAuctions,
    getLiveAuctions: getLiveAuctions
}