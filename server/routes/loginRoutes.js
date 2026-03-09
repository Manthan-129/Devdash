const express= require('express');
const loginRouter= express.Router();

const {loginUser,sendRegistrationOTP, verifyRegistrationOTP,verifyChangePasswordOTP, verifyChangePasswordOTPAndUpdate,forgetPasswordOTPRequest,verifyForgetPasswordOTPAndUpdate, userInfo, updateUserInfo, updateUserPassword, deleteUserAccount}= require('../controllers/loginController.js');
const upload= require('../midllewares/multer.js').upload;

const {authMiddleware}= require('../midllewares/authMiddleware.js');
loginRouter.post('/login', loginUser);
loginRouter.post('/send-registration-otp', sendRegistrationOTP);
loginRouter.post('/verify-registration-otp', verifyRegistrationOTP);
loginRouter.post('/verify-change-password-otp', verifyChangePasswordOTP);
loginRouter.post('/verify-change-password-otp-update', verifyChangePasswordOTPAndUpdate);
loginRouter.post('/forget-password-otp-request', forgetPasswordOTPRequest);
loginRouter.post('/verify-change-pass-otp', verifyForgetPasswordOTPAndUpdate);
loginRouter.get('/user-info', authMiddleware, userInfo);
loginRouter.put('/update-profile', authMiddleware, upload.single('profilePicture'), updateUserInfo);
loginRouter.post('/update-password', authMiddleware, updateUserPassword);
loginRouter.delete('/delete-account', authMiddleware, deleteUserAccount);
module.exports= loginRouter;