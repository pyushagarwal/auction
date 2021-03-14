const mongoose = require('mongoose');
const logger = require('./logger').getLogger();
mongoConnectionOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const create_connection = async function(mongoUrl){
    try{
        logger.info("Connecting to mongo .....")
        connection = mongoose.connection = await mongoose.createConnection(mongoUrl, mongoConnectionOptions) 
        logger.info("MONGO CONNECTION Established");
        connection.on('error', ()=>{
            logger.info("Mongo connection error")
        })
    
        connection.on('open', ()=>{
            logger.info("Mongo connection started")
        })
    }catch(err){
        logger.info("MONGO CONNECTION Failed ", err);
        throw err
    };
};     

module.exports.create_connection = create_connection
