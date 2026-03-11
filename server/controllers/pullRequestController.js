const Team= require('../models/team.js');
const Task= require('../models/Task.js');
const PullRequest= require('../models/PullRequest.js');
const {transporter}= require('../config/nodemailer.js');
const {pullRequestTemplate, pullRequestReviewTemplate}= require('../utils/emailTemplates.js');

// Create Pull Request (member sends PR link to leader/admin for review)
const createPullRequest= async (req, res)=>{
    try{
        const userId= req.userId;
        const {taskId}= req.params;
        const {githubPRLink, message}= req.body;

        if(!githubPRLink){
            return res.status(400).json({success: false, message: "GitHub PR link is required"});
        }

        const task= await Task.findById(taskId).populate('assignedTo', 'firstName lastName username email').populate('assignedBy', 'firstName lastName username email');
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"});
        }

        // Only the assigned user can create a PR for this task
        if(task.assignedTo._id.toString() !== userId){
            return res.status(403).json({success: false, message: "Only the assigned user can submit a pull request for this task"});
        }

        // Check if there's already a pending PR for this task
        const existingPR= await PullRequest.findOne({task: taskId, status: 'pending'});
        if(existingPR){
            return res.status(400).json({success: false, message: "A pending pull request already exists for this task"});
        }

        const team= await Team.findById(task.team).populate('leader', 'firstName lastName username email');
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const newPR= new PullRequest({
            task: taskId,
            team: task.team,
            sender: userId,
            githubPRLink,
            message: message || '',
        });

        await newPR.save();

        // Update task status to in-review
        task.status= 'in-review';
        task.updatedAt= new Date();
        await task.save();

        await newPR.populate([
            { path: 'sender', select: 'firstName lastName username profilePicture' },
            { path: 'task', select: 'title description status priority' },
        ]);

        // Send email to team leader
        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: team.leader.email,
            subject: pullRequestTemplate({taskTitle: task.title, senderName: task.assignedTo.firstName + ' ' + task.assignedTo.lastName, githubPRLink, message: message || ''}).subject,
            text: pullRequestTemplate({taskTitle: task.title, senderName: task.assignedTo.firstName + ' ' + task.assignedTo.lastName, githubPRLink, message: message || ''}).html.replace(/<[^>]+>/g, ''),
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({success: true, message: "Pull request submitted successfully", pullRequest: newPR});
    }catch(error){
        console.error("Error creating pull request:", error);
        return res.status(500).json({success: false, message: "Server error while creating pull request"});
    }
}

// Review Pull Request (leader/admin accepts or rejects)
const reviewPullRequest= async (req, res)=>{
    try{
        const userId= req.userId;
        const {prId}= req.params;
        const {status, reviewNote}= req.body;

        if(!['accepted', 'rejected'].includes(status)){
            return res.status(400).json({success: false, message: "Status must be 'accepted' or 'rejected'"});
        }

        const pullRequest= await PullRequest.findById(prId).populate('sender', 'firstName lastName username email');
        if(!pullRequest){
            return res.status(404).json({success: false, message: "Pull request not found"});
        }

        if(pullRequest.status !== 'pending'){
            return res.status(400).json({success: false, message: "This pull request has already been reviewed"});
        }

        const team= await Team.findById(pullRequest.team);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(member=> member.user.toString() === userId && member.role === 'admin');

        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admins can review pull requests"});
        }

        pullRequest.status= status;
        pullRequest.reviewedBy= userId;
        pullRequest.reviewNote= reviewNote || '';
        pullRequest.reviewedAt= new Date();
        await pullRequest.save();

        // Update task status based on PR review
        const task= await Task.findById(pullRequest.task);
        if(task){
            if(status === 'accepted'){
                task.status= 'completed';
                task.completedAt= new Date();
            } else if(status === 'rejected'){
                task.status= 'in-progress';
            }
            task.updatedAt= new Date();
            await task.save();
        }

        await pullRequest.populate([
            { path: 'sender', select: 'firstName lastName username profilePicture' },
            { path: 'reviewedBy', select: 'firstName lastName username profilePicture' },
            { path: 'task', select: 'title description status priority' },
        ]);

        // Send email to PR sender about the review result
        const reviewerInfo= await require('../models/User.js').findById(userId).select('firstName lastName');
        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: pullRequest.sender.email,
            subject: pullRequestReviewTemplate({taskTitle: task.title, reviewerName: reviewerInfo.firstName + ' ' + reviewerInfo.lastName, status, reviewNote: reviewNote || ''}).subject,
            text: pullRequestReviewTemplate({taskTitle: task.title, reviewerName: reviewerInfo.firstName + ' ' + reviewerInfo.lastName, status, reviewNote: reviewNote || ''}).html.replace(/<[^>]+>/g, ''),
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true, message: `Pull request ${status} successfully`, pullRequest});
    }catch(error){
        console.error("Error reviewing pull request:", error);
        return res.status(500).json({success: false, message: "Server error while reviewing pull request"});
    }
}

// Get all PRs for a team
const getTeamPullRequests= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;
        const {status}= req.query;

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isMember= team.members.some(member=> member.user.toString() === userId) || team.leader.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "Only team members can view pull requests"});
        }

        const filter= {team: teamId};
        if(status && ['pending', 'accepted', 'rejected'].includes(status)){
            filter.status= status;
        }

        const pullRequests= await PullRequest.find(filter)
            .populate('sender', 'firstName lastName username profilePicture')
            .populate('reviewedBy', 'firstName lastName username profilePicture')
            .populate('task', 'title description status priority dueDate')
            .sort({createdAt: -1});

        const stats= {
            total: pullRequests.length,
            pending: pullRequests.filter(pr=> pr.status === 'pending').length,
            accepted: pullRequests.filter(pr=> pr.status === 'accepted').length,
            rejected: pullRequests.filter(pr=> pr.status === 'rejected').length,
        }

        return res.status(200).json({success: true, pullRequests, stats});
    }catch(error){
        console.error("Error fetching pull requests:", error);
        return res.status(500).json({success: false, message: "Server error while fetching pull requests"});
    }
}

// Get my PRs across all teams
const getMyPullRequests= async (req, res)=>{
    try{
        const userId= req.userId;

        const pullRequests= await PullRequest.find({sender: userId})
            .populate('sender', 'firstName lastName username profilePicture')
            .populate('reviewedBy', 'firstName lastName username profilePicture')
            .populate('task', 'title description status priority dueDate')
            .populate('team', 'name title')
            .sort({createdAt: -1});

        const stats= {
            total: pullRequests.length,
            pending: pullRequests.filter(pr=> pr.status === 'pending').length,
            accepted: pullRequests.filter(pr=> pr.status === 'accepted').length,
            rejected: pullRequests.filter(pr=> pr.status === 'rejected').length,
        }

        return res.status(200).json({success: true, pullRequests, stats});
    }catch(error){
        console.error("Error fetching my pull requests:", error);
        return res.status(500).json({success: false, message: "Server error while fetching my pull requests"});
    }
}

module.exports= {createPullRequest, reviewPullRequest, getTeamPullRequests, getMyPullRequests};
