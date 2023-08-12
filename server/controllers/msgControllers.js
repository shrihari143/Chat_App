const msgModel = require("../models/MessageModel");
const bcrypt = require("bcrypt");
module.exports.addmsg=async(req, res,next)=>{
    try {
        const { from, to, message } = req.body;
        const data = await msgModel.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
        if (data) 
        return res.json({ msg: "Message added successfully." });
        else 
        return res.json({ msg: "Failed to add message to the database" });

    } 
    catch (error) {
        next(error);
    }
};
module.exports.getmsg=async(req, res,next)=>{
    try {
        const{from,to}=req.body;
        const Msgdata= await msgModel.find({users:{$all:[from,to],}}).sort({updatedAt:1});
        const projectedMsg= Msgdata.map((msg)=>{
            return{
                fromSelf: msg.sender.toString()===from,
                message: msg.message.text,
            }
        });
        res.json(projectedMsg);
    
} 
catch (error) {
    next(error); 
}
};

