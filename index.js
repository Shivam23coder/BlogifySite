require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user'); 
const blogRoute = require('./routes/blog'); 
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const Blog = require('./models/blog');
const Comment = require("./models/comment");

const app = express();
const PORT = process.env.PORT;

//here you are connecting to database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error(FAILED!!):", err);
    process.exit(1);
  });

        // async () => {
        //     try {
        //         const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`)
        //         console.log(`\nMongoDB connected: DB host: ${connectionInstance.connection.host}`);
        //     } catch (error) {
        //         console.log("MongoDB connection FAILED",error);
        //         process.exit(1);
        //     }
        // }

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
//Next line == ?
app.use(express.static(path.resolve('./public')));

app.get("/", async (req,res) =>{
    try{
        const allBlogs = await Blog.find({});
        res.render("home",{
            user: req.user,
            blogs: allBlogs,
        });
    } catch(error){
        console.error("ERROR FETCHING BLOGS:", error);
    res.status(500).send("Internal Server Error");
    }
});

app.use('/user',userRoute); 
app.use('/blog',blogRoute); 

app.listen(PORT, ()=> console.log(`Server started at port: ${PORT}`));
