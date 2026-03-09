const User= require('../models/User.js');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');
const validator= require('validator');
const {cloudinary}= require('../config/cloudinary.js');
const Invite = require('../models/Invite.js');
const OTP= require('../models/OTP.js');
const {transporter}= require('../config/nodemailer.js');
const {forgetPasswordTemplate, registrationTemplate, changePasswordRequest}= require('../utils/emailTemplates.js');

const createToken= (userId)=>{
    const token= jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
    return token;
}
const loginUser= async (req, res)=>{
    try{
        const {email, username, password}= req.body;

        if((!email && !username) ||!password){
            return res.status(404).json({success: false, message: "Email or username and password are required" });
        }
        let user;
        if(email){
            if(!validator.isEmail(email)){
                return res.json({success: false, message: "Invalid email address"});
            }
            user= await User.findOne({email});
        }
        else if(username){
            user= await User.findOne({username});
        }

        if(!user){
            return res.status(404).json({success: false,message: "User not found" });
        }

        const isPasswordMatch= await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = createToken(user._id);

        return res.status(200).json({
        success: true,
        token
        });
    }catch(error){
        console.log("Login error:", error.message);
        return res.status(500).json({
        success: false,
        message: "Login error"
        });

    }
}

// Registration with OTP
const sendRegistrationOTP= async (req, res)=>{
    try{
        const {email, username}= req.body;
        if(!email && !username){
            return res.status(400).json({success: false, message: "Email or username is required"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: "Invalid email address"});
        }

        const existingUserByEmail= await User.findOne({email});
        if(existingUserByEmail){
            return res.status(400).json({success: false, message: "Email already exists"});
        }
        const existingUserByUsername= await User.findOne({username});
        if(existingUserByUsername){
            return res.status(400).json({success: false, message: "Username already exists"});
        }
        const otp = Math.floor(100000 + Math.random()*900000).toString(); // generate 6-digit OTP

        const otpHash= await bcrypt.hash(otp, 10);

        await OTP.create({
            email: email,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),   // OTP expires in 5 minutes
        });

        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: registrationTemplate(otp,5).subject,
            text: registrationTemplate(otp,5).html.replace(/<[^>]+>/g, '')   // Strip HTML tags for plain text version
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({success: true, message: "Registration OTP sent to email"});
    }catch(error){
        console.log("Send registration OTP error:", error.message);
        return res.status(500).json({success: false, message: "Send Registration OTP Error"});
    }
}

// Complete registration after OTP verification
const verifyRegistrationOTP= async (req, res)=>{
    try{
        console.log(req.body);
        const {email, otp, firstName, lastName, username, password}= req.body;
        if(!email || !otp || !firstName || !lastName || !username || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const otpRecord= await OTP.findOne({email}).sort({createdAt: -1});

        if(!otpRecord){
            return res.status(400).json({success: false, message: "OTP expired or invalid"});
        }

        if(otpRecord.expiresAt < new Date()){
            return res.status(400).json({success: false, message: "OTP expired"});
        }

        const isValidOTP= await bcrypt.compare(otp, otpRecord.otp);

        if(!isValidOTP){
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }

        const hashedPass= await bcrypt.hash(password, 10);
        const newUser= await User.create({
            firstName, lastName, username, email, password: hashedPass
        })

        await OTP.deleteOne({email});

        const token= createToken(newUser._id);
        return res.status(200).json({success: true, message: "User registered successfully", token});
    }catch(error){
        console.log("Verify registration OTP error:", error.message);
        return res.status(500).json({success: false, message: "Verify Registration OTP Error"});
    }
}

const userInfo= async (req, res)=>{
    try{
        const userId= req.userId;
        const user= await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, user});
    }catch(error){
        console.log("User info error:", error.message);
        return res.status(500).json({success: false, message: "User Info Not Found"});
    }
}

const updateUserInfo= async (req, res)=>{
    try{
        const userId= req.userId;
        const {password}= req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to update profile"
            });
        }

        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Access denied. Incorrect password."});
        }
        const {firstName, lastName, bio}= req.body;
        const imageFile= req.file;

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                folder: "devdash_profiles",
                resource_type: "image",
                transformation: [{ width: 300, crop: "scale" }]
            });
            console.log("Cloudinary upload result:", imageUpload.secure_url);
            user.profilePicture= imageUpload.secure_url;
        }

        if(firstName) user.firstName= firstName;
        if(lastName) user.lastName= lastName;

        if(bio) user.bio= bio;

        const updateduser= await user.save();
        const updatedUser = await User.findById(updateduser._id).select('-password');
        
        return res.status(200).json({success: true, message: "User info updated successfully", updatedUser});
    }catch(error){
        console.log("Update user info error:", error.message);
        return res.status(500).json({success: false, message: "Update User Info Error"});
    }
}

// otp verification of password change request and then update password
const verifyChangePasswordOTP =async (req, res)=>{
    try{
        const userId= req.userId;

        const {password}= req.body;

        if(!password){
            return res.status(400).json({success: false, message: "Current password is required"});
        }
        
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Access denied. Incorrect current password."});
        }
        const email= user.email;

        const otp = Math.floor(100000 + Math.random()*900000).toString();
        const otpHash= await bcrypt.hash(otp, 10);

        await OTP.create({
            email: email,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 5*60*1000),
        })

        const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: changePasswordRequest(otp,5).subject,
            text: changePasswordRequest(otp,5).html.replace(/<[^>]+>/g, '')   // Strip HTML tags for plain text version
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true, message: "OTP sent to email for password change verification", email});
    }catch(error){
        console.log("Verify change password OTP error:", error.message);
        return res.status(500).json({success: false, message: "Verify Change Password OTP Error"});
    }
}
const verifyChangePasswordOTPAndUpdate= async (req, res)=>{
    try{
        const {email,newPassword, otp}= req.body;
        
        if(!email || !newPassword || !otp){
            return res.status(404).json({success: false, message: "Email, new password and OTP are required" });
        }
        const user= await User.findOne({email});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const otpRecord= await OTP.findOne({email}).sort({createdAt: -1});
        if(!otpRecord){
            return res.status(404).json({success: false, message: "OTP is invalid or expire"});
        }
        if(otpRecord.expiresAt < new Date()){
            return res.status(400).json({success: false, message: "OTP expired"});
        }
        const validateOtp= await bcrypt.compare(otp, otpRecord.otp);
        if(!validateOtp){
            return res.status(401).json({success: false, message: "Invalid OTP"});
        }

        const hashedNewPassword= await bcrypt.hash(newPassword, 10);
        user.password= hashedNewPassword;
        await user.save();
        await OTP.deleteOne({email});

        return res.status(200).json({success: true, message: "Password updated successfully"});
    }catch(error){
        console.log("Verify change password OTP and update error:", error.message);
        return res.status(500).json({success: false, message: "Verify Change Password OTP and Update Error"});
    }
}

const updateUserPassword= async (req, res)=>{
    try{
        const userId= req.userId;
        const {currentPassword, newPassword}= req.body;
        
        if(!currentPassword || !newPassword){
            return res.status(400).json({success: false, message: "Current and new passwords are required"});
        }
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const isMatch= await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Access denied. Incorrect current password."});
        }
        const hashedNewPassword= await bcrypt.hash(newPassword, 10);
        user.password= hashedNewPassword;
        await user.save();
        return res.status(200).json({success: true, message: "Password updated successfully"});
    }catch(error){
        console.log("Update password error:", error.message);
        return res.status(500).json({success: false, message: "Update Password Error"});
    }
}

const deleteUserAccount= async (req, res)=>{
    try{
        const userId= req.userId;
        const {password}= req.body;
        if(!password){
            return res.status(400).json({success: false, message: "Password is required to delete account"});
        }
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message: "Access denied. Incorrect password."});
        }
        await User.findByIdAndDelete(userId);

        await Invite.deleteMany({$or: [{sender: userId}, {receiver: userId}]});
        return res.status(200).json({success: true, message: "User account deleted successfully"});
    }catch(error){
        console.log("Delete user account error:", error.message);
        return res.status(500).json({success: false, message: "Delete User Account Error"});
    }
}

const forgetPasswordOTPRequest= async (req, res)=>{
    try{
        const {email}= req.body;
        if(!email){
            return res.status(400).json({success: false, message: "Email is required"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: "Invalid email address"});
        }
        const user= await User.find({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const otp= Math.floor(100000 + Math.random()*900000).toString();
        const otpHash= await bcrypt.hash(otp, 10);

        await OTP.create({
            email: email,
            otp: otpHash,
            expiresAt: new Date(Date.now() + 5*60*1000),
         })

         const mailOptions= {
            from: `"Support" <${process.env.SENDER_EMAIL}`,
            to: email,
            subject: forgetPasswordTemplate(otp,5).subject,
            text: forgetPasswordTemplate(otp,5).html.replace(/<[^>]+>/g, '')   // Strip HTML tags for plain text version
         }

         await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true, message: "OTP sent to email for password reset"});
        }catch(error){
            console.log("Forget password OTP request error:", error.message);
            return res.status(500).json({success: false, message: "Forget Password OTP Request Error"});
    }
}

// Verifying OTP of the forget Password Request
const verifyForgetPasswordOTPAndUpdate= async (req, res)=>{
    try{
        const {email,newPass, otp}= req.body;
        if(!email || !otp || !newPass){
            return res.status(400).json({success: false, message: "Email, OTP and new password are required"});
        }

        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        const otpRecord= await OTP.findOne({email}).sort({createdAt: -1});
        if(!otpRecord){
            return res.status(404).json({success: false, message: "OTP is invalid or expire"});
        }
        if(otpRecord.expiresAt < new Date()){
            return res.status(400).json({success: false, message: "OTP expired"});
        }
        const validateOtp= await bcrypt.compare(otp, otpRecord.otp);
        if(!validateOtp){
            return res.status(401).json({success: false, message: "Invalid OTP"});
         }

         // Update the user's password
         const hashNewPassword= await bcrypt.hash(newPass, 10);
         user.password= hashNewPassword;
         await user.save();

         return res.status(200).json({success: true, message: "OTP verified successfully. Password updated."});
    }catch(error){
        return res.status(500).json({success: false, message: "Verify Forget Password OTP Error"});
    }
}

module.exports= {loginUser,sendRegistrationOTP, verifyRegistrationOTP,verifyChangePasswordOTP, verifyChangePasswordOTPAndUpdate,forgetPasswordOTPRequest,verifyForgetPasswordOTPAndUpdate, userInfo, updateUserInfo, updateUserPassword, deleteUserAccount};