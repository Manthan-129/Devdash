const Team= require('../models/team.js');
const Task= require('../models/Task.js');
const {transporter}= require('../config/nodemailer.js');
const {updateTaskTemplate, taskAssignmentTemplate}= require('../utils/emailTemplates.js');

// Task Model
const createTask= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId, assignedTo}= req.params;
        const {title, description, priority, dueDate }= req.body;

        if(!title || !teamId || !assignedTo){
            return res.status(400).json({success: false, message: "Title, Team, AssignTo are required"});
        }

        const team= await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(member=> member.user.toString() === userId && member.role === 'admin');

        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admins can create tasks"});
        }

        //  is Team Member
        const isMember= team.members.some(member=> member.user.toString() === assignedTo);
        if(!isMember){
            return res.status(400).json({success: false, message: "Assigned user must be a member of the team"});
        }

        // Admin cannot assign task to the team leader
        const isMemberLeader= team.leader.toString() === assignedTo;
        if(isAdmin && isMemberLeader){
             return res.status(403).json({success: false, message: "Admin cannot assign task to the team leader"});
        }
        
        const newTask= new Task({
            title,
            description,
            team: teamId,
            assignedTo,
            assignedBy: userId,
            priority: priority || 'medium',
            dueDate: dueDate || null,
        })

        await newTask.save();
        await newTask.populate([
            { path: 'assignedTo', select: 'firstName lastName username profilePicture email' },
            { path: 'assignedBy', select: 'firstName lastName username profilePicture' }
        ]);
        
        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: newTask.assignedTo.email,
            subject: taskAssignmentTemplate({title: newTask.title, description: newTask.description, status: newTask.status, priority: newTask.priority, dueDate: newTask.dueDate, assignedBy: newTask.assignedBy.firstName + ' ' + newTask.assignedBy.lastName}).subject,
            text: taskAssignmentTemplate({title: newTask.title, description: newTask.description, status: newTask.status, priority: newTask.priority, dueDate: newTask.dueDate, assignedBy: newTask.assignedBy.firstName + ' ' + newTask.assignedBy.lastName}).html.replace(/<[^>]+>/g, ''),
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({success: true, message: "Task created successfully", task: newTask});
    }catch(error){
        console.error("Error creating task:", error);
        return res.status(500).json({success: false, message: "Server error while creating task"});
    }
}

const getTeamTasks= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isMember= team.members.some(member=>  member.user.toString() === userId) || team.leader.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "Only team members can view tasks"});
        }
        
        const tasks= await Task.find({team: teamId})
            .populate('assignedTo', 'firstName lastName username profilePicture')
            .populate('assignedBy', 'firstName lastName username profilePicture')
            .sort({createdAt: -1});

            const kanbanBoard= {
                todo: tasks.filter(t=> t.status === 'todo'),
                'in-progress': tasks.filter(t=> t.status === 'in-progress'),
                'in-review': tasks.filter(t=> t.status === 'in-review'),
                completed: tasks.filter(t=> t.status === 'completed'),
                cancelled: tasks.filter(t=> t.status === 'cancelled'),
            }

            const stats= {
                totalTasks: tasks.length,
                byStatus: {
                    todo: kanbanBoard.todo.length,
                    inProgress: kanbanBoard['in-progress'].length,
                    inReview: kanbanBoard['in-review'].length,
                    completed: kanbanBoard.completed.length,
                    cancelled: kanbanBoard.cancelled.length,
                },
                byPriority: {
                    high: tasks.filter(t=> t.priority === 'high').length,
                    medium: tasks.filter(t=> t.priority === 'medium').length,
                    low: tasks.filter(t=> t.priority === 'low').length,
                },
                overDue: tasks.filter(t=> t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'cancelled').length,
            }

            // Group tasks by assigned user for team overview
            const taskByMember= {};
            tasks.forEach(task=>{
                const memberId= task.assignedTo._id.toString();
                if(!taskByMember[memberId]){
                    taskByMember[memberId]={
                        memberInfo: {
                            _id: task.assignedTo._id,
                            firstName: task.assignedTo.firstName,
                            lastName: task.assignedTo.lastName,
                            profilePicture: task.assignedTo.profilePicture,
                            username: task.assignedTo.username,
                        },
                        tasks: [],
                        stats: {
                            total: 0,
                            todo: 0,
                            inProgress: 0,
                            inReview: 0,
                            completed: 0,
                            cancelled: 0
                        },
                    };
                }
                    taskByMember[memberId].tasks.push(task);
                    taskByMember[memberId].stats.total++;
                    if(task.status === 'todo') taskByMember[memberId].stats.todo++;
                    else if(task.status === 'in-progress') taskByMember[memberId].stats.inProgress++;
                    else if(task.status === 'in-review') taskByMember[memberId].stats.inReview++;
                    else if(task.status === 'completed') taskByMember[memberId].stats.completed++;
                    else if(task.status === 'cancelled') taskByMember[memberId].stats.cancelled++;
            })
            return res.status(200).json({success: true, message: "Tasks retrieved successfully", kanbanBoard, stats, taskByMember, allTasks: tasks});

    }catch(error){
        console.error("Error retrieving tasks:", error);
        return res.status(500).json({success: false, message: "Server error while retrieving tasks"});
    }
}

// get My Tasks(assignTo) for a specific team
const getMyTasksInTeam= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team= await Team.findById(teamId);
        if(!team){  
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isMember= team.members.some(member=> member.user.toString() === userId) || team.leader.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "Only team members can view tasks"});
        }

        const tasks= await Task.find({team: teamId, assignedTo: userId})
        .populate('assignedTo', 'firstName lastName username profilePicture').populate('assignedBy', 'firstName lastName username profilePicture').sort({createdAt: -1});
        
        const kanbanBoard= {
            todo: tasks.filter(t=> t.status === 'todo'),
            'in-progress': tasks.filter(t=> t.status === 'in-progress'),
            'in-review': tasks.filter(t=> t.status === 'in-review'),
            completed: tasks.filter(t=> t.status === 'completed'),
            cancelled: tasks.filter(t=> t.status === 'cancelled'),
        }

        const stats = {
            totalTasks: tasks.length,
            byStatus: {
                todo: kanbanBoard.todo.length,
                inProgress: kanbanBoard['in-progress'].length,
                inReview: kanbanBoard['in-review'].length,
                completed: kanbanBoard.completed.length,
                cancelled: kanbanBoard.cancelled.length,
            },
            byPriority: {
                high: tasks.filter(t=> t.priority === 'high').length,
                medium: tasks.filter(t=> t.priority === 'medium').length,
                low: tasks.filter(t=> t.priority === 'low').length,
            },
            overDue: tasks.filter(t=> t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'cancelled').length,
        }
        return res.status(200).json({success: true, message: "My tasks retrieved successfully", kanbanBoard, stats, allTasks: tasks});
    }catch(error){
        console.error("Error retrieving my tasks:", error);
        return res.status(500).json({success: false, message: "Server error while retrieving my tasks"});
    }
}

// get My Tasks(assignTo) across all teams
const getMyTasks= async (req, res)=>{
    try{
        const userId= req.userId;

        const tasks= await Task.find({assignedTo: userId})
        .populate('assignedTo', 'firstName lastName username profilePicture').populate('assignedBy', 'firstName lastName username profilePicture').sort({createdAt: -1});

        const kanbanBoard= {
            todo: tasks.filter(t=> t.status === 'todo'),
            'in-progress': tasks.filter(t=> t.status === 'in-progress'),
            'in-review': tasks.filter(t=> t.status === 'in-review'),
            completed: tasks.filter(t=> t.status === 'completed'),
            cancelled: tasks.filter(t=> t.status === 'cancelled'),
        }

        const stats= {
            totalTasks: tasks.length,
            byStatus: {
                    todo: kanbanBoard.todo.length,
                    inProgress: kanbanBoard['in-progress'].length,
                    inReview: kanbanBoard['in-review'].length,
                    completed: kanbanBoard.completed.length,
                    cancelled: kanbanBoard.cancelled.length,
                },
            byPriority: {
                high: tasks.filter(t=> t.priority === 'high').length,
                medium: tasks.filter(t=> t.priority === 'medium').length,
                low: tasks.filter(t=> t.priority === 'low').length,
            },
            overDue: tasks.filter(t=> t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.status !== 'cancelled').length,
        }

        return res.status(200).json({success: true, message: "My tasks retrieved successfully", kanbanBoard, stats, allTasks: tasks});
    }catch(error){
        console.error("Error retrieving my tasks:", error);
        return res.status(500).json({success: false, message: "Server error while retrieving my tasks"});
    }
}

// Update Task Status
const updateTaskStatus= async (req, res)=>{
    try{
        const userId= req.userId;
        const {taskId}= req.params;
        const {status}= req.body;

        if(!['todo', 'in-progress', 'in-review', 'completed', 'cancelled'].includes(status)){
            return res.status(400).json({success: false, message: "Invalid status value"});
        }

        const task= await Task.findById(taskId).populate('team');
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"});
        }

        const team= await Team.findById(task.team._id);
        const isAssigned= task.assignedTo.toString() === userId;
        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(member=> member.user.toString() === userId && member.role === 'admin');

        if(!isAssigned && !isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only assigned user, team leader or admins can update task status"});
        }

        task.status= status;
        task.updatedAt= new Date();
        if(status === 'completed'){
            task.completedAt= new Date();
        }
        await task.save();

        await task.populate('assignedTo', 'firstName lastName username profilePicture').populate('assignedBy', 'firstName lastName username profilePicture');

        return res.status(200).json({success: true, message: "Task status updated successfully", task});
    }catch(error){
        console.error("Error updating task status:", error);
        return res.status(500).json({success: false, message: "Server error while updating task status"});
    }
}

// update Task
const updateTask= async (req, res)=>{
    try{
        const userId= req.userId;
        const {taskId}= req.params;

        const {title, description, priority, dueDate, assignedTo}= req.body;

        const task= await Task.findById(taskId);
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"});
        }
        const team= await Team.findById(task.team);

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }   

        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(m=> m.user.toString() === userId && m.role === 'admin');

        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admins can update task"});
        }
        
        if(title) task.title= title;
        if(description) task.description= description;
        if(priority) task.priority= priority;
        if(dueDate) task.dueDate= dueDate;

        if(assignedTo){
            const isMember= team.members.some(m=> m.user.toString() === assignedTo);
            if(!isMember || team.leader.toString() === assignedTo){
                return res.status(404).json({success: false, message: "Assigned user must be a team member and cannot be the team leader"});
            }
            task.assignedTo= assignedTo;
        }
        task.assignedBy= userId;
        task.updatedAt= new Date();
        await task.save();
        
        await task.populate('assignedTo', 'firstName lastName username profilePicture').populate('assignedBy', 'firstName lastName username profilePicture');

        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: task.assignedTo.email,
            subject: updateTaskTemplate({title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate, assignedBy: task.assignedBy.firstName + ' ' + task.assignedBy.lastName}).subject,
            text: updateTaskTemplate({title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate, assignedBy: task.assignedBy.firstName + ' ' + task.assignedBy.lastName}).html.replace(/<[^>]+>/g, ''),
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true, message: "Task updated successfully", task});
    }catch(error){
        console.error("Error updating task:", error);
        return res.status(500).json({success: false, message: "Server error while updating task"});
    }
}

//  delete task
const deleteTask= async (req, res)=>{
    try{
        const userId= req.userId;
        const {taskId}= req.params;

        const task= await Task.findById(taskId);
        if(!task){
            return res.status(404).json({success: false, message: "Task not found"});
        }

        const team= await Team.findById(task.team);
        const isLeader= team.leader.toString() === userId;
        const isAdmin= team.members.some(member=> member.user.toString() === userId && member.role === 'admin');
        
        if(!isLeader && !isAdmin){
            return res.status(403).json({success: false, message: "Only team leader or admins can delete task"});
        }

        await task.deleteOne();
        return res.status(200).json({success: true, message: "Task deleted successfully"});
    }catch(error){
        console.error("Error deleting task:", error);
        return res.status(500).json({success: false, message: "Server error while deleting task"});
    }
}

// User Progress Report for each member in a team
const getTeamMemberProgress= async (req, res)=>{
    try{
        const userId= req.userId;
        const {teamId}= req.params;

        const team= await Team.findById(teamId).populate('leader', 'firstName lastName username profilePicture').populate('members.user', 'firstName lastName username profilePicture');
        if(!team){
            return res.status(404).json({success: false, message: "Team not found"});
        }

        const isMember= team.members.some(member=> member.user._id.toString() === userId) || team.leader._id.toString() === userId;
        if(!isMember){
            return res.status(403).json({success: false, message: "Only team members can view progress reports"});
        }

        const tasks= await Task.find({team: teamId});

        const now= new Date();
        const memberProgress= [];

        // Include leader + all members
        const allUsers= [
            { user: team.leader, role: 'leader', joinedAt: team.createdAt },
            ...team.members.map(m=> ({ user: m.user, role: m.role, joinedAt: m.joinedAt }))
        ];

        // Deduplicate (leader may also be in members array)
        const seen= new Set();

        for(const entry of allUsers){
            const uid= entry.user._id.toString();
            if(seen.has(uid)) continue;
            seen.add(uid);

            const userTasks= tasks.filter(t=> t.assignedTo.toString() === uid);
            const total= userTasks.length;
            const completed= userTasks.filter(t=> t.status === 'completed');
            const cancelled= userTasks.filter(t=> t.status === 'cancelled');
            const inProgress= userTasks.filter(t=> t.status === 'in-progress');
            const inReview= userTasks.filter(t=> t.status === 'in-review');
            const todo= userTasks.filter(t=> t.status === 'todo');
            const overdue= userTasks.filter(t=> t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed' && t.status !== 'cancelled');

            // On-time completions: completed before or on dueDate
            const onTime= completed.filter(t=> t.dueDate && t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate));

            // Average resolution time (days) for completed tasks
            let avgResolutionDays= 0;
            if(completed.length > 0){
                const totalMs= completed.reduce((sum, t)=>{
                    const start= new Date(t.createdAt);
                    const end= t.completedAt ? new Date(t.completedAt) : now;
                    return sum + (end - start);
                }, 0);
                avgResolutionDays= Math.round((totalMs / completed.length) / (1000 * 60 * 60 * 24) * 10) / 10;
            }

            const activeTasks= total - cancelled.length;
            const completionRate= activeTasks > 0 ? Math.round((completed.length / activeTasks) * 100) : 0;
            const onTimeRate= completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 0;

            memberProgress.push({
                user: {
                    _id: entry.user._id,
                    firstName: entry.user.firstName,
                    lastName: entry.user.lastName,
                    username: entry.user.username,
                    profilePicture: entry.user.profilePicture,
                },
                role: entry.role,
                stats: {
                    total,
                    completed: completed.length,
                    inProgress: inProgress.length,
                    inReview: inReview.length,
                    todo: todo.length,
                    cancelled: cancelled.length,
                    overdue: overdue.length,
                    completionRate,
                    onTimeRate,
                    avgResolutionDays,
                },
                byPriority: {
                    high: userTasks.filter(t=> t.priority === 'high').length,
                    medium: userTasks.filter(t=> t.priority === 'medium').length,
                    low: userTasks.filter(t=> t.priority === 'low').length,
                },
            });
        }

        // Sort by completion rate descending, then by total tasks
        memberProgress.sort((a, b)=> b.stats.completionRate - a.stats.completionRate || b.stats.total - a.stats.total);

        // Team-wide summary
        const totalTeamTasks= tasks.length;
        const totalCompleted= tasks.filter(t=> t.status === 'completed').length;
        const totalActive= tasks.filter(t=> t.status !== 'cancelled').length;
        const teamCompletionRate= totalActive > 0 ? Math.round((totalCompleted / totalActive) * 100) : 0;
        const totalOverdue= tasks.filter(t=> t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed' && t.status !== 'cancelled').length;

        return res.status(200).json({
            success: true,
            message: "Progress report retrieved successfully",
            teamSummary: {
                totalTasks: totalTeamTasks,
                completed: totalCompleted,
                completionRate: teamCompletionRate,
                overdue: totalOverdue,
                membersCount: seen.size,
            },
            memberProgress,
        });
    }catch(error){
        console.error("Error retrieving progress report:", error);
        return res.status(500).json({success: false, message: "Server error while retrieving progress report"});
    }
}

module.exports= {createTask, getTeamTasks, getMyTasksInTeam, getMyTasks, updateTaskStatus, updateTask, deleteTask, getTeamMemberProgress};