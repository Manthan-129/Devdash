const mongoose= require('mongoose');

const teamSchema= new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true,
    },
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports= mongoose.model('Team', teamSchema);