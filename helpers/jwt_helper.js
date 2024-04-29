const createError = require('http-errors')
const JWT = require('jsonwebtoken')
const client = require('./init_redis')



module.exports = {
    //middleware to generate the access token
    signAccessToken: (userId) => {
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
    },

    //middleware to create refresh token
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'example.com',
                audience: userId,
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.error(err.message);
                    reject(createError.InternalServerError());
                } else {
                    client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            console.error(err.message);
                            reject(createError.InternalServerError());
                        } else {
                            resolve(token);
                        }
                    });
                }
            });
        });
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    console.error(err.message);
                    reject(createError.Unauthorized());
                } else {
                    const userId = payload.aud;
                    client.GET(userId, (err, result) => {
                        if (err) {
                            console.error(err.message);
                            reject(createError.InternalServerError());
                        } else {
                            if (refreshToken === result) {
                                resolve(userId);
                            } else {
                                reject(createError.Unauthorized());
                            }
                        }
                    });
                }
            });
        });
    }
}