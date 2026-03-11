const express= require('express');
const pullRequestRouter= express.Router();

const {createPullRequest, reviewPullRequest, getTeamPullRequests, getMyPullRequests}= require('../controllers/pullRequestController.js');

const {authMiddleware}= require('../midllewares/authMiddleware.js');

pullRequestRouter.post('/:taskId/create', authMiddleware, createPullRequest);
pullRequestRouter.put('/:prId/review', authMiddleware, reviewPullRequest);
pullRequestRouter.get('/team/:teamId', authMiddleware, getTeamPullRequests);
pullRequestRouter.get('/my-prs', authMiddleware, getMyPullRequests);

module.exports= pullRequestRouter;
