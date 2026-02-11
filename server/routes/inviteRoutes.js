const express= require('express');
const inviteRouter= express.Router();

const {sendRequestToMakeFriend, getMyInvitations, respondToFriendRequest, cancelSentFriendRequest, unfriendUser, allFriends}= require('../controllers/inviteController.js');

const {authMiddleware}= require('../midllewares/authMiddleware.js');

inviteRouter.post('/send-request', authMiddleware, sendRequestToMakeFriend);
inviteRouter.get('/friend-requests', authMiddleware, getMyInvitations);
inviteRouter.post('/respond-request/:inviteId', authMiddleware, respondToFriendRequest);
inviteRouter.delete('/cancel-invitation/:inviteId', authMiddleware, cancelSentFriendRequest);
inviteRouter.delete('/unfriend/:friendId', authMiddleware, unfriendUser);
inviteRouter.get('/all-friends', authMiddleware, allFriends);

module.exports= inviteRouter;
