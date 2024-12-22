const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a user

exports.registerUser = catchAsyncErrors( async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"Avatar",
        width: 150,
        crop : "scale",
    })
    
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);

});





//Login a user

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    //checking if user has entered both email and password
    if(!email || !password){
        return next(new ErrorHandler("Please enter both email and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    //user not found
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    
    //password didnt match
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user, 200, res);
});






//Logout User

exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true, //Using the HttpOnly tag when generating a cookie helps mitigate the risk of client-side scripts accessing the protected cookie, thus making these cookies more secure.
    })
    
    
    res.status(200).json({
        success:true,
        message:"Logged Out",
    })
})





//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }


    //Get ResetPassword Token
    const resetToken  = user.getResetPasswordToken();

    await user.save({validateBeforeSave : false}); //set to true by default

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n Ignore if you haven't requested for this email`;

    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email} successfully`,
        })
        
    } catch (error) {
        //as we have  saved the updated values of resetPasswrodtoken and expire in the database already in the prev lines So if any error occur, these values should be set to undefined as they are no longer valid
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next(new ErrorHandler(error.message,500));
    }
});


//Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been expired",404));
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",404));
    }
    
    user.password = req.body.password;
    //password is now changed so resetPasswordtoken is no more required unless requested again so
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save();

    sendToken(user,200,res); //from jwtToken.js
});





//Get User Detail
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        user,
    });
});



//Update user password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",401));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});



//Update User Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    });

    res.status(200).json({
        success : true,
    })
});





//Get all users
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success : true,
        users,
    });
});





//Get single user
exports.getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(
            new ErrorHandler("User not found")
        );
    }

    res.status(200).json({
        success : true,
        user
    });
});



//Update User role --- Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    };

    const user = User.findByIdAndUpdate(req.params.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    });

    res.status(200).json({
        success : true,
    })
});




//delete user --- Admin
exports.deleteProfile = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User not found`));
    }

    await user.remove();

    res.status(200).json({
        success : true,
        message : "User Deleted"
    })
});