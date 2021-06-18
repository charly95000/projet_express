const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email : {type:String, required:true, unique:true},
    password: {type: String, required: true},
    name:{type:String, required: true},
    age: {type:Number, required: true},
    firstname :{type: String, required: true},
    lastname : {type: String, required:true},
    username: {type: String, required:true, unique:true},
    imageUrl:{type : String,  default:'http://localhost:3000/images/default.png'},
    friends:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    {timestamps: true},
)

userSchema.plugin(uniqueValidator);

module.exports= mongoose.model('User',userSchema)