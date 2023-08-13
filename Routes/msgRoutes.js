const express =require("express");
const { addmsg,getmsg } = require("../controllers/msgControllers");
const router=express.Router();
router.post("/addmsg",addmsg);
router.post("/getmsg",getmsg);
module.exports = router;