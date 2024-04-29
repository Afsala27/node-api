require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoute');
//const errorMiddleware = require('./middleware/errorMiddleware');
//var cors = require('cors')
const userRoutes = require('./routes/usersRoute');
const loginRoute = require('./routes/loginRoute');
const morgan = require('morgan');
const { verifyAccesToken } = require('./helpers/jwt_helper');
const createError = require('http-errors');
require('./helpers/init_redis')


const app = express();
app.use(morgan('dev'))

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

//const frontend_url = process.env.FRONTEND_URL


// //cors defenision
// var corsOptions = {
//     origin: frontend_url, // host link
//     optionsSuccessStatus: 200
//   }
// // cors
// app.use(cors(corsOptions))

//using middleware
app.use(express.json());

//changing to formdata or formurl encoded
app.use(express.urlencoded({extended : true}));

// using product routes for controllers
app.use('/api/products', verifyAccesToken, productRoutes);


app.use('/api/users', userRoutes);

app.use('/api/auth', loginRoute);

// app.get('/', (req, res) => {
//     //throw new Error ('fake error');
// })

//Using errormiddleware
//app.use(errorMiddleware)

app.use(async (req, res, next) => {
    next(createError.NotFound())
  })
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })


//Database connection
mongoose.set('strictQuery', false)
mongoose.
connect(mongoUrl)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, ()=> {
        console.log(`node is running on port ${port}`);
    })
}).catch((error) => {
    console.log(error)
});