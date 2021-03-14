const router = require('express').Router();
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const config = require('../config')
const userModel = require('../models/user')
const logger = require('../../common/logger').getLogger();

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
        if (!_.isEqual(req.user.role, ['admin']) && userId != req.user.id) {
            return res.status(403).json()
        }
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
        if (body.role) {
            return res.status(400).json({"error": "unsupported field role"});
        }
        let user = await userModel(body).save();
        jwt_token = jwt.sign({id: user._id, role: user.role}, config.SECRET, { algorithm: 'HS256'})
        user = user.toObject()
        user['jwt_token'] = jwt_token
        logger.info(`User created with user_id=${user.id}`)
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
        let result = await userModel.deleteOne({_id: userId, "role.0": {$ne: "admin"}});
        if (result.deletedCount == 0) {
            res.status(404).json()
        } else{
            logger.info(`User deleted with user_id=${userId}`)
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
        if (body.role) {
            return res.status(400).json({"error": "unsupported field role"});
        }
        let userId = req.params.userId;
        if (!_.isEqual(req.user.role, ['admin']) && req.params.userId != req.user.id) {
            return res.status(403).json()
        }
        
        let user = await userModel.findById({_id: userId})
        if(_.isNull(user)) {
            return res.status(404).json()
        }
        result = await userModel.updateOne({_id: userId}, body, {new:true})
        logger.info(`Date updated for user with user_id=${userId}`)
        res.status(202).json({"updated": true});
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