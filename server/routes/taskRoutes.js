const express= require('express');
const taskRouter= express.Router();

const {createTask, getTeamTasks, getMyTasksInTeam, getMyTasks, updateTaskStatus, updateTask, deleteTask, getTeamMemberProgress}= require('../controllers/taskController.js');

const {authMiddleware}= require('../midllewares/authMiddleware.js');

taskRouter.post('/:teamId/create/:assignedTo', authMiddleware, createTask);
taskRouter.get('/team/:teamId', authMiddleware, getTeamTasks);
taskRouter.get('/team/:teamId/my-tasks', authMiddleware, getMyTasksInTeam);
taskRouter.get('/team/:teamId/progress', authMiddleware, getTeamMemberProgress);
taskRouter.get('/my-tasks', authMiddleware, getMyTasks);
taskRouter.put('/:taskId/status', authMiddleware, updateTaskStatus);
taskRouter.put('/:taskId', authMiddleware, updateTask);
taskRouter.delete('/:taskId', authMiddleware, deleteTask);

module.exports= taskRouter;