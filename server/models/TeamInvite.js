const mongoose= require('mongoose');

const teamInvitationSchema= new mongoose.Schema({
    team: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    message: {
        type: String,
        default: '',    
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports= mongoose.model('TeamInvitation', teamInvitationSchema);