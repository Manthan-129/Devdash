require('dotenv').config();
const express= require('express');
const cors= require('cors');
const morgan= require('morgan');

const {connectDB}= require('./config/db.js');
const {connectCloudinary}= require('./config/cloudinary.js');
const loginRouter= require('./routes/loginRoutes.js');
const inviteRouter= require('./routes/inviteRoutes.js');
const teamRouter= require('./routes/teamRoutes.js');
const taskRouter= require('./routes/taskRoutes.js');
const pullRequestRouter= require('./routes/pullRequestRoutes.js');

const app= express();
const PORT= process.env.PORT || 5000;

// Connect to Database and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (req,res)=>{
    console.log("API is running");
    return res.status(200).json({message: "DEVDASH API is running"});
})
app.use('/api/auth', loginRouter);
app.use('/api/friendship', inviteRouter);
app.use('/api/team', teamRouter);
app.use('/api/task', taskRouter);
app.use('/api/pull-request', pullRequestRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});