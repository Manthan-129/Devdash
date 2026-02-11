const User= require('../models/User.js');
const Invite= require('../models/Invite.js');

// Send Friend Request
const sendRequestToMakeFriend= async (req, res)=>{
    try{
        const sendId= req.userId;
        const {username}= req.body;
        if(!username){
            return res.status(400).json({success: false, message: "Username of the receiver is required"});
        }

        // receiver exists or not
        const receiver= await User.findOne({username});
        if(!receiver){
            return res.status(404).json({success: false, message: "Receiver does not exist"});
        }

        // Same user cannot send request to himself
        if(sendId.toString() === receiver._id.toString()){
            return res.status(400).json({success: false, message: "You cannot send a friend request to yourself"});
        }

        // is Already a friend
        if(receiver.friends.includes(sendId)){
            return res.status(400).json({success: false, message: "User is already your friend"});
        }

        // already sent a friend request and is pending
        const existingInvite= await Invite.findOne({sender: sendId, receiver: receiver._id, status: 'pending'});
        if(existingInvite){
            return res.status(400).json({success: false, message: "A friend request has already been sent to this user"});
        }
        
        // check if receiver has sent a friend request to sender and is pending, if yes then accept that request instead of sending a new request

        const pendingRequestFromReciever= await Invite.findOne({sender: receiver._id, receiver: sendId, status: 'pending'});

        if(pendingRequestFromReciever){
            pendingRequestFromReciever.status= 'accepted';
            await pendingRequestFromReciever.save();

            // add each other as friends
            await User.findByIdAndUpdate(sendId, {$addToSet: {friends: receiver._id}});
            await User.findByIdAndUpdate(receiver._id, {$addToSet: {friends: sendId}});

            return res.status(200).json({success: true, message: "Friend request accepted successfully", invite: pendingRequestFromReciever});
        }
        
        // Recent Rejection Check
        const recentRejection= await Invite.findOne({sender: sendId, receiver: receiver._id, status: 'rejected', updatedAt: {$gte: new Date(Date.now() - 7*24*60*60*1000)}}); // 7 days

        if(recentRejection){
            return res.status(400).json({success: false, message: "Please wait before sending another request to this user"});
        }
        
        const invite= {
            sender: sendId,
            receiver: receiver._id,
            status: 'pending',
        }
        const sendingInvite= await Invite.create(invite);
        return res.status(200).json({success: true, message: "Friend request sent successfully", invite: sendingInvite});
        }catch(error){
            console.log("Error sending friend request:", error.message);
            return res.status(500).json({success: false, message: "Error sending friend request"});
        }
}

//  Get my invitation recieve and sent
const getMyInvitations= async (req, res)=>{
    try{
        const userId= req.userId;

        const requestsRecieve = await Invite.find({receiver: userId, status: 'pending'}).populate('sender', 'firstName lastName username email profilePicture').sort({createdAt: -1});

        const requestsSent= await Invite.find({sender: userId, status: 'pending'}).populate('receiver', 'firstName lastName username email profilePicture').sort({createdAt: -1});

        return res.status(200).json({success: true, requestsRecieve: requestsRecieve, requestsSent: requestsSent});

    }catch(error){
        console.log("Error fetching friend requests:", error.message);
        return res.status(500).json({success: false, message: "Error fetching friend requests"});
    }
}

// Respond to Friend Request
const respondToFriendRequest= async (req, res)=>{
    try{
        const receiverId= req.userId;
        const {inviteId}= req.params;
        const {status}= req.body;

        if(!inviteId || !status){
            return res.status(400).json({success: false, message: "Invitation ID and status are required"});
        }
        
        if(!['accepted', 'rejected'].includes(status)){
            return res.status(400).json({success: false, message: "Invalid status value"});
        }
        const invitation= await Invite.findOne({_id: inviteId, receiver: receiverId, status: 'pending'});
        if(!invitation){
            return res.status(404).json({success: false, message: "Friend request not found"});
        }
        invitation.status= status;
        await invitation.save();

        if(status === 'accepted'){
            await User.findByIdAndUpdate(receiverId, {$addToSet: {friends: invitation.sender}});
            await User.findByIdAndUpdate(invitation.sender, {$addToSet: {friends: receiverId}});
        }

        return res.status(200).json({
            success: true,
            message: `Friend request ${status}`,
            invitation
        });
    }catch(error){
        console.log("Error responding to friend request:", error.message);
        return res.status(500).json({success: false, message: "Error responding to friend request"});
    }
}

// Cancel Sent Friend Request (sender Only)
const cancelSentFriendRequest= async (req, res)=>{
    try{
        const userId= req.userId;
        const {inviteId}= req.params;
        if(!inviteId){
            return res.status(400).json({success: false, message: "Invitation ID is required"});
        }
        const invitation= await Invite.findOne({sender: userId, _id: inviteId, status: 'pending'});

        if(!invitation){
            return res.status(404).json({success: false, message: "Sent friend request not found"});
        }

        await invitation.deleteOne();

        return res.status(200).json({success: true, message: "Friend request cancelled successfully"});
    }catch(error){
        console.log("Error cancelling friend request:", error.message);
        return res.status(500).json({success: false, message: "Error cancelling friend request"});
    }
}

// all Friends
const allFriends= async (req, res)=>{
    try{
        const userId= req.userId;
        const user= await User.findById(userId).populate('friends', 'firstName lastName username email profilePicture');
        return res.status(200).json({success: true, friends: user.friends});
    }catch(error){
        console.log("Error fetching friends:", error.message);
        return res.status(500).json({success: false, message: "Error fetching friends"});
    }
}

// Unfriend (Both sender and receiver can unfriend)
const unfriendUser= async (req, res)=>{
    try{
        const userId= req.userId;
        const {friendId}= req.params;

        if(!friendId){
            return res.status(400).json({success: false, message: "Friend ID is required"});
        }

        const user= await User.findById(userId);
        const friend= await User.findById(friendId);

        if(!friend){
            return res.status(404).json({success: false, message: "User not found"});
        }

        if(!user.friends.includes(friendId)){
            return res.status(400).json({success: false, message: "This user is not your friend"});
        }

        await User.findByIdAndUpdate(userId, {$pull: {friends: friendId}});
        await User.findByIdAndUpdate(friendId, {$pull: {friends: userId}});

        return res.status(200).json({success: true, message: "Unfriended successfully"});
    }catch(error){
        console.log("Error unfriending user:", error.message);
        return res.status(500).json({success: false, message: "Error unfriending user"});
    }
}

module.exports= {sendRequestToMakeFriend, getMyInvitations, respondToFriendRequest, cancelSentFriendRequest, unfriendUser, allFriends};
