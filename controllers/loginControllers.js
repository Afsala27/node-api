const { loginSchema } = require('../helpers/validation_schema');
const Users = require('../models/usersModel');
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');
const {signAccessTocken} = require('../helpers/jwt_helper');


const login = asyncHandler( async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const user = await Users.findOne({ email: result.email  })

        if(!user) {
            throw createError.NotFound('User not registered')
        }
        const isMatch = await user.passwordIsvalid(result.password)

        if(!isMatch) {
            throw createError.Unauthorized('Username/password not valid')
        }

        const accessToken = await signAccessTocken(user.id)
        console.log(result)
        //res.send(user)
        res.status(200).json({accessToken})

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }
})

module.exports = {
    login
}