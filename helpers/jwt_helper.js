const createError = require('http-errors')
const JWT = require('jsonwebtoken')



module.exports = {
    //middleware to generate the access token
    signAccessTocken: (userId) => {
        return new Promise ((resolve, reject) => {
            const payload = {
            }
            const secret = process.env.ACCES_TOKEN_SECRET
            const options = {
                expiresIn: '1h',
                issuer: 'example.com',
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, tocken) =>  {
                if(err) {
                    //reject(err)
                    console.log(err)
                    reject(createError.InternalServerError())
                    //res.status(500).json(error)
                }
                resolve(tocken)
            })

        })
    },
    //middleware to verify the access token
    verifyAccesToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
          const authHeader = req.headers['authorization']
          const bearerToken = authHeader.split(' ')
          const token = bearerToken[1]
          JWT.verify(token, process.env.ACCES_TOKEN_SECRET, (err, payload) => {
              if(err) {
                if(err.name === 'JsonWebTokenError'){
                    return next(createError.Unauthorized())
                } else {
                    return next(createError.Unauthorized(err.message))
                }
              }
              req.payload = payload
              next()
          })
    }
}