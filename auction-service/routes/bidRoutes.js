const AuctionModel = require('../models/auction');
const BidsModel = require('../models/bids');
const logger = require('../../common/logger').getLogger();

// const storeBidTransactions = async function(auctionId, userId, price, currTime){
//     try {
//         const filter = {
//             auctionId: auctionId,
//             userId: userId,
//         }
//         const payload = {
//             auctionId: auctionId,
//             userId: userId,
//             bidPrice: price,
//             updateAt: currTime
//         };
//         const bids = await BidsModel.findOneAndUpdate(payload, payload, {upsert: true});
//         logger.info(`Bid=${bids._id} placed by userId=${userId} added to transactionDb`);
//     } catch(e) {
//         logger.error(`Failed to store bid placed by userId=${userId} to transactionDb`);
//         logger.error(e);
//     };
// };

const makeBid = async function(req, res, next){
    try{
        logger.info("BEGIN makeBid()")
        let auctionId = req.params.auctionId;
        let userId = req.headers.userid || req.body.userId;
        let price = req.body.price; 
        let currTime = new Date();
    
        let auctions = await AuctionModel.findById({_id: auctionId});
        if (!auctions) {
            return res.status(404).json()
        }
        if(currTime < auctions.startTime) {
            return res.status(400).json({
                status: "Bidding for this product is not open yet"
            })
        } else if(currTime > auctions.endTime){
            return res.status(400).json({
                status: "Bidding for this product has closed"
            })
        };
        if (price < auctions.startPrice) {
            return res.status(400).json({
                status: `Bid reject. Price must be >= ${auctions.startPrice}`
            })
        };

        // Update maximum price;
        const condition = {
            _id: auctionId,
            "winner.price": {
                $lt: price
            },
            
        }
        
        let response = await AuctionModel.updateOne(condition, {
            $set: {
                "winner" : {
                    userId: userId,
                    price: price,
                    timestamp: currTime
                }   
            }
        });
        let bidTopper = await AuctionModel.findById({_id: auctionId}, {winner: 1});

        if (response.nModified >= 1){
            res.status(201).json({
                "auctionId": auctionId,
                "yourPrice": price,
                "topBid": bidTopper.winner.price,
                "topBidder": bidTopper.winner.userId,
                "status": "accepted"
            });
            logger.info(`userID=${userId} bid on auction with id=${auctionId} success`);
        } else {
            res.status(400).json({
                "auctionId": auctionId,
                "yourPrice": price,
                "topBid": bidTopper.winner.price,
                "topBidder": bidTopper.winner.userId,
                "status": "rejected"
            });
            logger.info(`userID=${userId} bid on auction with id=${auctionId} failed as bid was lower`);
        }
        // if (response.nModified >= 1){
        //     storeBidTransactions(auctionId, userId, price, currTime);
        // }
    } catch(e){
        logger.error(e);
        if (!res.headersSent) {
            next(e);
        }
    }
}


const getAllBids = async function(req, res, next) {
    try {
        let auctionId = req.params.auctionId
        let condition = {
            auctionId : auctionId
        };
        resp = await BidsModel.find(condition).sort({bidPrice : -1}).limit(20).exec();
        res.status(200).json(resp);
    } catch(e){
        logger.error(e)
        next(e);
    }
};

module.exports = {
    makeBid: makeBid,
    getAllBids: getAllBids
}