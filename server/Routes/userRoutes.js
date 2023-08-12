const express = require("express");
const { register ,login,setavatar,getalluser} = require("../controllers/userController");

// Create a new router instance using express.Router()
const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.post("/setavatar/:id",setavatar);
router.get("/getalluser/:id",getalluser);

module.exports = router;
