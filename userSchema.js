const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type:String, required:true,unique: true},
    password: {
        type: String,
        required: true,
        validate:
        {
            validator: function(value)
            {
                return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
        }
    },
    age: {type: Number, required:false},
    city: {type: String, required:false},
    createdAt: {type:Date,default: Date.now}

}

);

const user = mangoose.model('User', userSchema)
Module.exports = User;