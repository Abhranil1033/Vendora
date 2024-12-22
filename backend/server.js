const app = require('./app');

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require('cloudinary');
const PORT = 4000 || process.env.PORT

//Handling uncaught exception
// process.on("uncaughtException",(err)=>{
//     console.log(`Error: ${err.message}`);
//     console.log(`Shutting down the server due to uncaught exception`);

//     process.exit(1);
// })




//Config
dotenv.config({path:"backend/config/config.env"});

//Connecting to database
connectDatabase();


//connecting to cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


const server = app.listen(PORT,()=>{
    // console.log(`Server is running at port ${process.env.PORT}`);
    console.log(`Server is running at ${PORT}`);
})

// console.log(you); (these are uncaught errors and should be handled at the beginning)


//Unhandled Promise Rejection (here,we have to make the server crash on its own due to some unhandled errors)
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    //closing the server
    server.close(() => {
        process.exit(1);
    })
})