require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoute');
const errorMiddleware = require('./middleware/errorMiddleware');
var cors = require('cors')

const app = express();

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

const frontend_url = process.env.FRONTEND_URL


//cors defenision
var corsOptions = {
    origin: frontend_url, // host link
    optionsSuccessStatus: 200
  }
// cors
app.use(cors(corsOptions))

//using middleware
app.use(express.json());

//changing to formdata or fomurl encoded
app.use(express.urlencoded({extended : false}));

// using product routes for controllers
app.use('/api/products', productRoutes);

// app.get('/', (req, res) => {
//     //throw new Error ('fake error');
// })

//Using errormiddleware
app.use(errorMiddleware)
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