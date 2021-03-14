const mongoose = require('mongoose')

const auctionDetailsSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    startPrice : {
        type: Number,
        required: true,
        minimum: 0
    },
    winner: {
        default: {
            price: 0
        },
        type: {
            user_id: {
                required: true,
                type: String
            },
            price: {
                required: true,
                type: Number
            },
            timestamp: {
                required: true,
                type: String
            }
        }
    }
    //  must have start time, end time, start price, item name and finally -
    // user_id of the user who won the auction
})

const setBiddingStatus = function(doc){
    let currTime = new Date();
    if(currTime < doc.startTime) {
        doc.bidding = "not_started"
    } else if(currTime > doc.endTime){
        doc.bidding = "closed"
    } else{
        doc.bidding = "open"
    };
}
auctionDetailsSchema.options.toObject = {
    transform: function(doc, ret, options) {
        setBiddingStatus(ret)
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

auctionDetailsSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        setBiddingStatus(ret)
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

auctionDetailsSchema.pre('save', function(done) {
    let currTime = new Date();
    if (this.startTime > this.endTime){
        done("startTime should be less than endTime")
    }
    done(null);
})

module.exports = mongoose.model('auctionDetails', auctionDetailsSchema)