const Joi = require('joi');

const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required() // need to give the password validation in details
})

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
})

module.exports = {
    authSchema,
    loginSchema
}