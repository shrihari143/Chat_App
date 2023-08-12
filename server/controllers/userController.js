const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({ message: "Email already exists", success: false });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newuser = new userModel({
      username,
      email,
      password: passwordHash,
    });

    await newuser.save();
    delete newuser.password;
    
    
    res.status(200).send({
      message: "Registration successful",
      success: true,
      newuser: newuser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
module.exports.login=async(req,res,next)=>{
    try {
        const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    res.status(200).send({ message: "Login Success", success: true, user :user});
    
        
    } 
    catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
        
    }

}
module.exports.setavatar=async(req,res,next)=>{
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await userModel.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    res.status(200).send({ message: "Avatar is selected successfully", success: true,
    isSet: userData.isAvatarImageSet,
    image: userData.avatarImage, });

    
  } 
  catch (error) {
    next(error);
  }


}
module.exports.getalluser=async(req,res,next)=>{
  try {
    const users= await userModel.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    
    res.status(200).send({
       message:"Getting all user information successfull",
       users:users,
       success:true
    });
    
  } catch (error) {
    next(error);
  }
}
