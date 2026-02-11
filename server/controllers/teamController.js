const User= require('../models/User.js');
const Team= require('../models/team.js');
const Task= require('../models/Task.js');
const TeamInvitation= require('../models/teamInvite.js');
const { teamInvitationTemplate } = require('../utils/emailTemplates.js');
const {transporter}= require('../config/nodemailer.js');
// Create a new team
const createTeam= async (req, res)=>{
    try{
        const userId= req.userId;
        const {name,title, description}= req.body;

        if(!name || !title){
            return res.status(404).json({success: false, message: "Name and title are required to create a team"});
        }

        const trimmedName= name.trim();
        if(trimmedName.length < 3){
            return res.status(400).json({success: false, message: "Team name must be at least 3 characters long"}); 
        }

        // check existing name team
        const existingTeam= await Team.findOne({name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if(existingTeam){
            return res.status(400).json({success: false, message: "A team with this name already exists"});
        }

        const team= new Team({
            name: trimmedName,
            title,
            description: description || '',
            leader: userId,
            members: [{user: userId, role: 'admin'}],
        });

        await team.save();
        return res.status(201).json({success: true, message: "Team created successfully", team});
    }catch(error){
        console.error("Error creating team:", error);
        return res.status(500).json({success: false, message: "An error occurred while creating the team"});
    }
}

// Get teams where user is leader or member
const getMyTeams= async (req, res)=>{
    try{
        const userId= req.userId;

        const teams= await Team.find({
            $or: [
                {leader: userId},
                {'members.user': userId},
            ]
        }).populate('leader', 'username firstName lastName profilePicture').populate('members.user', 'username firstName lastName profilePicture').sort({createdAt: -1});

        return res.status(200).json({success: true, teams});
    }catch(error){
        console.error("Error fetching teams:", error);
        return res.status(500).json({success: false, message: "An error occurred while fetching teams"});
    }
}

// Get team details (only for members)
const getTeamDetails= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team= await Team.findById(teamId).populate('leader', 'username firstName lastName profilePicture').populate('members.user', 'username firstName lastName profilePicture');
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }
        // check if user is member of team
        const isMember= team.members.some(member=> member.user._id.toString() === userId) || team.leader._id.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "You are not a member of this team"});
        }

        return res.status(200).json({success: true, team});
    }catch(error){
        console.error("Error fetching team details:", error);
        return res.status(500).json({success: false, message: "An error occurred while fetching team details"});
    }
}

// Send Team Invitation (Only team leader can send invitation)
const sendTeamInvitation= async (req, res)=>{
    try{
        const senderId= req.userId;
        const {teamId}= req.params;
        const {username, message}= req.body;

        const team= await Team.findById(teamId).populate('leader', 'name username')
  .populate('members.user', 'name username');
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }
        const isLeader = team.leader._id.toString() === senderId;
        const isAdmin = team.members.some(
            member => member.user._id.toString() === senderId && member.role === 'admin'
            );

        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admin can send invitations"});
        }

        const receiver= await User.findOne({username});

        if(!receiver){
            return res.status(404).json({success: false, message: "Receiver not found"});
        }

        const sender = await User.findById(senderId);

        const areFriends = sender.friends.some(
            id => id.toString() === receiver._id.toString()
        );
        if(!areFriends){
            return res.status(400).json({success: false, message: "You can only invite your friends to join the team"});
        }

        const isAlreadyMember= team.members.some(member => member.user.toString() === receiver._id.toString());
        if(isAlreadyMember){
            return res.status(404).json({success: false, message: "User is already a member of the team"});
        }

        const existingInvitation= await TeamInvitation.findOne({team: teamId, receiver: receiver._id, status: 'pending'});
        if(existingInvitation){
            return res.status(400).json({success: false, message: "An invitation has already been sent to this user"});
        }

        const invitation= new TeamInvitation({
            team: teamId,
            sender: senderId,
            receiver: receiver._id,
            message: message || '',
        });

        await invitation.save();
        await invitation.populate([
            { path: 'sender', select: 'firstName lastName username profilePicture' },
            { path: 'team', select: 'name description' }
        ]);

        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: receiver.email,
            subject: teamInvitationTemplate({senderName: sender.firstName + ' ' + sender.lastName,senderUsername: sender.username, teamName: team.name, teamDescription: team.description, members: team.members.map(m => m.user), customMessage: message}).subject,
            text: teamInvitationTemplate({senderName: sender.firstName + ' ' + sender.lastName, senderUsername: sender.username, teamName: team.name, teamDescription: team.description, members: team.members.map(m => m.user), customMessage: message}).html.replace(/<[^>]+>/g, ''),
        }
        await transporter.sendMail(mailOptions);
        return res.status(201).json({success: true, message: "Team invitation sent successfully", invitation});
    }catch(error){
        console.log("Error sending team invitation:", error.message);
        return res.status(404).json({status: false, message: "An error occurred while sending team invitation"});
    }
}

// get team invitation
const getTeamInvitations= async(req, res)=>{
    try{
        const userId= req.userId;
        
        const receivedInvitations= await TeamInvitation.find({receiver: userId, status: 'pending'}).populate('sender', 'firstName lastName username email profilePicture').populate('team', 'name title description').sort({createdAt: -1});

        const teams= await Team.find({
            $or: [
                {leader: userId},
                { 'members': { $elemMatch: { user: userId, role: 'admin' } } },
            ]
        });
        const teamIds= teams.map(team => team._id);

        const sentInvitations= await TeamInvitation.find({team: {$in: teamIds}, sender: userId, status: 'pending'}).populate('receiver', 'firstName lastName username email profilePicture').populate('team', 'name title description').sort({createdAt: -1});

        return res.status(200).json({success: true, receivedInvitations, sentInvitations});
    }catch(error){
        console.log("Error fetching team invitations:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while fetching team invitations"});
    }
}

// Respond to team invitation
const respondToTeamInvitation= async (req, res)=>{
    try{
        const receiverId= req.userId;
        const {invitationId}= req.params;
        const {status}= req.body;

        if(!invitationId || !status){
            return res.status(400).json({success: false, message: "Invitation ID and status are required"});
        }

        if(!['accepted', 'rejected'].includes(status)){
            return res.status(400).json({success: false, message: "Invalid status value"});
        }

        const invitation= await TeamInvitation.findOne({_id: invitationId, receiver: receiverId, status: 'pending'});
        if(!invitation){
            return res.status(404).json({success: false, message: "Team invitation not found"});
        }

        invitation.status= status;
        await invitation.save();

        if(status === 'accepted'){
            const team= await Team.findById(invitation.team);
            const alreadyMember = team.members.some(
            m => m.user.toString() === receiverId
            );

            if (!alreadyMember) {
                team.members.push({ user: receiverId, role: 'member' });
                await team.save();
            }
        }

        return res.status(200).json({success: true, message: `Team invitation ${status} successfully`, invitation});
    }catch(error){
        console.log("Error responding to team invitation:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while responding to team invitation"});
    }
}

// Make the User Admin or Member (Only team leader can change member roles)
const makeUserAdminOrMember= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId, memberId}= req.params;
        const {role}=  req.body;

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isLeader= team.leader.toString() === userId;
        if(!isLeader){
            return res.status(404).json({success: false, message: "Only team leader can change member roles"});
        }

        const isReceiverMember= team.members.find(member=> member.user.toString() === memberId);

        if(!isReceiverMember){
            return res.status(404).json({success: false, message: "User is not a member of the team"});
        }
        const isReceiverLeader= team.leader.toString() === memberId;
        if(isReceiverLeader){
            return res.status(400).json({success: false, message: "Cannot change role of the team leader"});
        }

        const memberRole= isReceiverMember.role;
        if(role === memberRole){
            return res.status(400).json({success: false, message: `User is already a ${role}`});
        }

        if(!['admin', 'member'].includes(role)){
            return res.status(400).json({success: false, message: "Invalid role value"});
        }

        await Team.updateOne(
            {_id: teamId, 'members.user': memberId},
            {$set: {'members.$.role': role, 'members.$.updatedAt': Date.now()}}
        );

        return res.status(200).json({success: true, message: `User role updated to ${role} successfully`});
    }   catch(error){
        console.log("Error updating member role:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while updating member role"});
    }
}
//  all Members of Team
const allMembersOfTeam= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team =await Team.findById(teamId).populate('leader', 'username firstName lastName profilePicture').populate('members.user', 'username firstName lastName profilePicture');
        if(!team){
             return res.status(404).json({success: false, message: "Team not found"});
        }
        // check if user is member of team
        const isMember= team.members.some(member=> member.user._id.toString() === userId) || team.leader._id.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "You are not a member of this team"});
        }

        return res.status(200).json({success: true, members: team.members, leader: team.leader});
    }catch(error){
        console.log("Error fetching team members:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while fetching team members"});
    }
}
// Remove team member (Only team leader or admin can remove members)
const removeTeamMember= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId, memberId}= req.params;

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(member=> member.user.toString() === userId && member.role === 'admin');
        
        const isRemoveAdmin= team.members.some(member=> member.user.toString() === memberId && member.role === 'admin');

        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admin can remove members"});
        }


        if(memberId === userId){
            return res.status(400).json({success: false, message: "User cannot remove themselves from the team"});
        }

        // cannot remove team Leader
        if(isAdmin && memberId === team.leader.toString()){
            return res.status(400).json({success: false, message: "Admin cannot remove the team leader"});
        }
        
        if(isAdmin && isRemoveAdmin){
            return res.status(400).json({success: false, message: "Admin cannot remove another admin from the team"});
        }

        const memberIndex= team.members.findIndex(member=> member.user.toString() === memberId);
        if(memberIndex === -1){
            return res.status(404).json({success: false, message: "Member not found in the team"});
        }

        await Team.findByIdAndUpdate(teamId, {$pull: {members: {user: memberId}}});
        
        return res.status(200).json({success: true, message: "Member removed from the team successfully"});
    }catch(error){
        console.log("Error removing team member:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while removing team member"});
    }
}

// leave team (team member can leave team, if team leader wants to leave the team, they have to assign new leader before leaving)
const leaveTeam= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        // Leader cannot leave (must transfer leadership or delete team)
        if (team.leader.toString() === userId) {
            return res.status(400).json({ success: false, message: "Leader cannot leave. Transfer leadership or delete team." });
        }

        await Team.findByIdAndUpdate(teamId, {$pull: {members: {user: userId}}});
        return res.status(200).json({success: true, message: "You have left the team successfully"});
    }catch(error){
        console.log("Error leaving team:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while leaving the team"});
    }
}

//  Delete team (Only team leader can delete the team)
const deleteTeam =async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }
        const isLeader= team.leader.toString() === userId;

        if(!isLeader){
            return res.status(403).json({success: false, message: "Only team leader can delete the team"});
        }

        await Task.deleteMany({team: teamId});
        await TeamInvitation.deleteMany({team: teamId});
        await team.deleteOne();

        return res.status(200).json({success: true, message: "Team deleted successfully"});
    }catch(error){
        console.log("Error deleting team:", error.message);
        return res.status(500).json({success: false, message: "An error occurred while deleting the team"});
    }
}

module.exports= {createTeam, getMyTeams, getTeamDetails, sendTeamInvitation, getTeamInvitations, respondToTeamInvitation, makeUserAdminOrMember, allMembersOfTeam, removeTeamMember, leaveTeam, deleteTeam};