const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ''},
    username: {type: String, required: true, unique: true},
    bio: {type: String},
    date: {type: Date, default: Date.now},
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true});

module.exports= mongoose.models.User || mongoose.model('User', userSchema);
