const Team= require('../models/team.js');
const Task= require('../models/Task.js');
const transporter= require('../config/nodemailer.js');
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

        // is Team leader
        const isMemberLeader= team.leader.toString() === assignedTo;
        if(isAdmin && isMemberLeader){
             return res.status(400).json({success: false, message: "User cannot assigned task to the team leader"});
        }
        
        // is Team Admin
        const isMemberAdmin= team.members.some(member=> member.user.toString() === assignedTo && member.role === 'admin');

        // Admin cannot assign task to another admin
        if(isAdmin && isMemberAdmin){
            return res.status(400).json({success: false, message: "Admin cannot assigned task to another admin"});
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
            { path: 'assignedTo', select: 'firstName lastName username profilePicture' },
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
                completed: tasks.filter(t=> t.status === 'completed'),
                cancelled: tasks.filter(t=> t.status === 'cancelled'),
            }

            const stats= {
                totalTasks: tasks.length,
                byStatus: {
                    todo: kanbanBoard.todo.length,
                    inProgress: kanbanBoard['in-progress'].length,
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
                            completed: 0,
                            cancelled: 0
                        },
                    };
                    taskByMember[memberId].tasks.push(task);
                    taskByMember[memberId].stats.total++;
                    if(task.status === 'todo') taskByMember[memberId].stats.todo++;
                    else if(task.status === 'in-progress') taskByMember[memberId].stats.inProgress++;
                    else if(task.status === 'completed') taskByMember[memberId].stats.completed++;
                    else if(task.status === 'cancelled') taskByMember[memberId].stats.cancelled++;
                }
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
            completed: tasks.filter(t=> t.status === 'completed'),
            cancelled: tasks.filter(t=> t.status === 'cancelled'),
        }

        const stats = {
            totalTasks: tasks.length,
            byStatus: {
                todo: kanbanBoard.todo.length,
                inProgress: kanbanBoard['in-progress'].length,
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
            completed: tasks.filter(t=> t.status === 'completed'),
            cancelled: tasks.filter(t=> t.status === 'cancelled'),
        }

        const stats= {
            totalTasks: tasks.length,
            byStatus: {
                    todo: kanbanBoard.todo.length,
                    inProgress: kanbanBoard['in-progress'].length,
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

        if(!['todo', 'in-progress', 'completed', 'cancelled'].includes(status)){
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
        task.updatedAt= new Date.now();
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

        const isLeader= team.leader.toString()=== userId;
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

module.exports= {createTask, getTeamTasks, getMyTasksInTeam, getMyTasks, updateTaskStatus, updateTask, deleteTask};