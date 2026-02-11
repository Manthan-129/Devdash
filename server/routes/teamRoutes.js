const express= require('express');
const teamRouter= express.Router();

const {createTeam, getMyTeams, getTeamDetails, sendTeamInvitation, getTeamInvitations, respondToTeamInvitation, makeUserAdminOrMember, allMembersOfTeam, removeTeamMember, leaveTeam, deleteTeam}= require('../controllers/teamController.js');

const {authMiddleware}= require('../midllewares/authMiddleware.js');

teamRouter.post('/create', authMiddleware, createTeam);
teamRouter.get('/my-teams', authMiddleware, getMyTeams);
teamRouter.get('/:teamId', authMiddleware, getTeamDetails);
teamRouter.post('/invite/:teamId', authMiddleware, sendTeamInvitation);
teamRouter.get('/invitations/all', authMiddleware, getTeamInvitations);
teamRouter.put('/invitations/respond/:invitationId', authMiddleware, respondToTeamInvitation);
teamRouter.put('/:teamId/change-role/:memberId', authMiddleware, makeUserAdminOrMember);
teamRouter.get('/all-members/:teamId', authMiddleware, allMembersOfTeam);
teamRouter.delete('/:teamId/remove/:memberId', authMiddleware, removeTeamMember);
teamRouter.delete('/:teamId/leave', authMiddleware, leaveTeam);
teamRouter.delete('/:teamId', authMiddleware, deleteTeam);

module.exports= teamRouter;