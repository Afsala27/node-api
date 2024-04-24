const { authSchema } = require('../helpers/validation_schema');
const Users = require('../models/usersModel');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const {signAccessToken, signRefreshToken} = require('../helpers/jwt_helper');

//save users
const saveUsers = asyncHandler( async (req, res) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const doesExist = await Users.findOne({ email: result.email})
        if(doesExist){
            //throw new Error(`${result.email} already exists`);
            throw createError.NotFound(`${result.email} is already exists`)
        }
        //console.log(result);
        const user = await Users.create(req.body)
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        //res.status(200).json(user)
        res.send({accessToken, refreshToken})

    } catch (error) {
        //res.status(500);
        throw createError.BadRequest(error.message)
    }
})

const getUserById = asyncHandler(async (req, res) => {
    try {
        //console.log(req.headers['authorization'])
        const {id} = req.params;
        const user = await Users.findById(id);
        res.status(200).json({name: user.name, email: user.email});
    } catch (error) {
       // res.status(500);
       throw createError.NotFound(`no data is related to this id`)
    }
})


module.exports = {
    saveUsers,
    getUserById,
}