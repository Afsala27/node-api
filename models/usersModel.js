const mongoose = require('mongoose');
const bcrpt = require('bcrypt')

const usersSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter your name"]
        },
        email: {
            type: String,
            required:[true, "Enter your email"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Enter your password"]
        }
    },
    {
        timestamps: true
    }
)

//hashing password and saving
usersSchema.pre('save', async function (next) {
    try {
        const salt = await bcrpt.genSalt(10);
        const hashPassword = await bcrpt.hash(this.password, salt)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error)
    }
})

//unhashing the password
usersSchema.methods.passwordIsvalid = async function(password){
    try {
        return await bcrpt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;