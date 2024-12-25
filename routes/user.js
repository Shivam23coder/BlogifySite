const {Router} = require("express");
const User = require('../models/user');

const router = Router();

router.get("/signin", (req,res) =>{
    return res.render("signin");
});

router.post("/signin",async (req,res) =>{
    const {email,password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token",token).redirect("/");   
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect email or password",
        });
    } 
});

router.get("/logout", (req,res) =>{
    res.clearCookie("token").redirect("/");
})

router.get("/signup", (req,res) =>{
    return res.render("signup");
});

//POSTING a user data
router.post("/signup", async(req,res) =>{
    const{ fullName,email,password} = req.body;
    try{
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/");
    } catch(error) {
        console.error("Error creating user:", error);
        return res.status(400).send("Error creating user");
    }
});

//It is important to export
module.exports = router;