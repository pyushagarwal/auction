let process = require('process')
module.exports = {
    PORT : process.argv.PORT | 3000,
    MONGOURL: "mongodb://localhost:27017/auction",
    SECRET: "RANDOMSTRING",
    ADMIN_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGNlMTIzOGU1OTk2OWJhYzFmZjBmNSIsInJvbGUiOlsiYWRtaW4iXSwiaWF0IjoxNjE1NjUxMTA3fQ.Qjm5XSmfu7A7xvSFB-tgSXAUeTZe5D92Zgl2OrQ8RBo"
}