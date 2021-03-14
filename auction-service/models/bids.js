const mongoose = require('mongoose');

const bidsSchema = new mongoose.Schema({
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auctionDetails',
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    bidPrice: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true
    }
    //  must have start time, end time, start price, item name and finally -
    // user_id of the user who won the auction
})

bidsSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

bidsSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('bids', bidsSchema)