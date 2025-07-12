const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email : {type: String, unique:true},
    password :{type : String, required:true},
    firstname : String,
    lastname : String
})

const adminSchema = new mongoose.Schema({
    email : {type: String, unique:true},
    password :{type : String, required:true},
    firstname : String,
    lastname : String
})

const courseSchema = new mongoose.Schema({
    title : {type: String, required:true},
    description :{type : String, required:true},
    price : Number,
    imageUrl : String,
    creatorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins'
    }
})

const purchaseSchema = new mongoose.Schema({
    courseId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

// Create models
const userModel = mongoose.model('users', userSchema);
const adminModel = mongoose.model('admins', adminSchema);
const courseModel = mongoose.model('courses', courseSchema);
const purchaseModel = mongoose.model('purchases', purchaseSchema);

// Export models
module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
};