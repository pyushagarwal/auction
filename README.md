# AuctionManager
This is an application which consists of 2 microservices. It is wriiten in node.js and uses mongodb as backend.
 - auth-service
 - auction-service

Please use the attached postman collection
 The configurations for each service is present in their respective config.js file. Update the mongodb port inside config.js
 - auction-service/config.js
 - auth-service/config.js 

### Steps to Run
 - In a terminal, cd into project directory, run "npm install"
 - In one terminal, cd auth-service and run "node app.js". This starts app on port 3000
 - In other terminal, cd auction-service and run "node app.js". This starts app on port 4000
 - All requests must be sent via port 3000.
 - We have attached a postman collection to assist

### Design
 - Auth service proxies all requests to auction-service.
 - Authentication strategy used is bearer and jwt token is passed in it.
 - In auth-service/config.js, the admin jwt token is specified. This token can be used to perform all api operations
 - Whenever a new user registers, his jwt token is returned in response. This wont be returned again.

### API

Details about all APIs is inside postman collection. Some important ones are listed below

```sh
    Create a user
    POST localhost:3000/user
    Request
    {
        "name": "piyush agarwal",
        "username": "sixth"
    }
    Response
    {
        "role": [],
        "name": "piyush agarwal",
        "username": "sixth",
        "id": "604e5f23d7b53d2610c2e002",
        "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGU1ZjIzZDdiNTNkMjYxMGMyZTAwMiIsInJvbGUiOltdLCJpYXQiOjE2MTU3NDg4OTl9.gOZFKjHh_LJoXg67vzT8CKNtIjE-_bd7Vhv0jcHrm9g"
    }
 ```
 ```sh
    Create an auction
    POST localhost:3000/auction
    Request
    {
        "itemName": "TMobile",
        "startTime": "02-15-2021 14:00:00", 
        "endTime": "03-18-2021 20:33:00",
        "startPrice": 30000
    }

    Response
    {
        "winner": {
            "price": 0
        },
        "itemName": "TMobile",
        "startTime": "2021-02-15T08:30:00.000Z",
        "endTime": "2021-03-18T15:03:00.000Z",
        "startPrice": 30000,
        "bidding": "open",
        "id": "604e5c28b6b688f7ea47fe3b"
    }
 ```

 ```sh
    Post a bid
    POST localhost:3000/auction/:auctionId/bid
    Request
    {
        "price": 30000
    }

    Response
    {
        "auctionId": "604e5c28b6b688f7ea47fe3b",
        "yourPrice": 30000,
        "topBid": 30000,
        "topBidder": "604e5f23d7b53d2610c2e002",
        "status": "rejected"
    }
 ```

 ```sh
    Get the latest bid price
    GET localhost:3000/auction/:auctionId

    Response
    {
    "winner": {
        "userId": "604e5f23d7b53d2610c2e002",
        "price": 30001,
        "timestamp": "2021-03-14T19:38:00.244Z"
    },
    "itemName": "TMobile",
    "startTime": "2021-02-15T08:30:00.000Z",
    "endTime": "2021-03-18T15:03:00.000Z",
    "startPrice": 30000,
    "bidding": "open",
    "id": "604e5c28b6b688f7ea47fe3b"
}
 ```


