let process = require('process')
module.exports = {
    PORT : process.argv.PORT | 3000,
    MONGOURL: "mongodb://localhost:27017/sellerone",
    SECRET: "RANDOMSTRING",
    AUCTION_SERVICE_URL: "http://localhost:4000",
    ADMIN_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNlMTIzOGU1OTk2OWJhYzFmZjBmNSIsInJvbGUiOlsiYWRtaW4iXSwiaWF0IjoxNjE1NjUxMTA3fQ.Qjm5XSmfu7A7xvSFB-tgSXAUeTZe5D92Zgl2OrQ8RBo"

}