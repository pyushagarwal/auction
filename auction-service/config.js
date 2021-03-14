let process = require('process')
module.exports = {
    PORT : process.argv.PORT | 4000,
    MONGOURL: "mongodb://localhost:27017/sellerone"
}