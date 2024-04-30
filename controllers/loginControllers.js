const { loginSchema } = require('../helpers/validation_schema');
const Users = require('../models/usersModel');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');
const client = require('../helpers/init_redis')

const login = async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const user = await Users.findOne({ email: result.email })
        if (!user) throw createError.NotFound('User not registered')
  
        const isMatch = await user.passwordIsvalid(result.password)
        if (!isMatch)
          throw createError.Unauthorized('Username/password not valid')
  
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({ accessToken, refreshToken })
      } catch (error) {
        if (error.isJoi === true)
          return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
      }
}

const refreshToken = asyncHandler( async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)

        res.send({accessToken: accessToken, refreshToken: refToken})

    } catch (error) {
        next(error);
    }
})

const logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.body
        if(!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        client.DEL(userId, (err, value)=> {
            if(err) {
                console.log(err.message)
                throw createError.InternalServerError()
            }
            console.log(value)
            res.sendStatus(204)
        })

        res.sendStatus(204)
        //resolve(userId)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    refreshToken,
    logout
}