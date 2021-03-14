const router = require('express').Router();
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const config = require('../config')
const userModel = require('../models/user')
const logger = require('../../common/logger');

const getUsers = async function(req, res, next){
    try{
        let users = await userModel.find()
        res.json(users)
    } catch(err){
        logger.error(err)
        next(err)
    }
}

const getUserById = async function(req, res, next){
    try{
        let userId = req.params.userId
        let user = await userModel.findById({_id: userId})
        if(_.isNull(user)) {
            res.status(404).json()
        } else{
            res.json(user);
        }
    } catch(err){
        logger.error(err)
        next(err)
    }
};

const createUser = async (req, res, next)=>{
    try {
        let body = req.body;
        let user = await userModel(body).save();
        jwt_token = jwt.sign({id: user._id, role: user.role}, config.SECRET, { algorithm: 'HS256'})
        user = user.toObject()
        user['jwt_token'] = jwt_token
        res.status(201).json(user)
    } catch(e){
        // if (_.isEqual(e.code, "11000")){
        logger.error(e)
        next(e);
    }
}

const deleteUser = async (req, res, next)=>{
    try{
        let userId = req.params.userId
        let result = await userModel.deleteOne({_id: userId});
        if (result.deletedCount == 0) {
            res.status(404).json()
        } else{
            res.status(202).json({"deleted": true})
        }
    } catch(e){
        // if (_.isEqual(e.code, "11000")){
        logger.error(e)
        next(e);
    }
}

const updateById = async(req, res, next) => {
    try{
        let body = req.body;
        let userId = req.params.userId;
        let user = await userModel.findById({_id: userId})
        if(_.isNull(user)) {
            return res.status(404).json()
        }
        result = await userModel.updateOne({_id: userId}, body)
        res.status(202).json(user);
    } catch(e){
        logger.error(e)
        next(e)
    }
};

router.get("/", getUsers);
router.post('/', createUser);
router.get("/:userId", getUserById);
router.delete('/:userId', deleteUser);
router.put('/:userId', updateById);


// module.exports = router;
module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    getUserById: getUserById,
    deleteUser: deleteUser,
    updateById: updateById
}