const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs")

async function createUser(req, res){
  try {
    const user_data = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      gender: req.body.gender,
    };
    const findEmail = await UserModel.findOne({email: req.body.email});
    if(findEmail) return res.status(401).send({success: false, message: "User email already exists"})
    const resp = await new UserModel(user_data).save();
    res.status(200).send({
      success: true,
      message: "User Created",
      data: resp
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Cannot create user",
      errorMsg: error,
    })
  }

}

function getUsers(req, res) {
  UserModel.find({}, {password: 0, __v: 0}).then((resp) => {
    res.status(200).send({
      success: true,
      message: "All users",
      data: resp
    })
  }).catch((error) => {
    res.status(404).send({
      success: false,
      message: "Cannot get users",
      errorMsg: error,
    })
  });
}

function getNonAdmins(req, res) {
  UserModel.find({role: 'user' }, {password: 0, __v: 0}).then((resp) => {
    res.status(200).send({
      success: true,
      message: "All users",
      data: resp
    })
  }).catch((error) => {
    res.status(404).send({
      success: false,
      message: "Cannot get users",
      errorMsg: error,
    })
  });
}

const getSingleUser = async (req, res) => {
  try{
    const id = req.params.id
    const user = await UserModel.findById(id)
    const user_details = {id: user._id, username:user.username, email:user.email, gender:user.gender, avatar:user.avatar, status:user.status, role:user.role}
    res.status(200).send({
      success: true,
      message: "User gotten successfully",
      data: user_details
    })    
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Cannot get user",
      errMsg: error      
    })    
  }
}


function updateUsername(req, res) {
  const update_values = {
    username: req.body.username,
  }
  try{
    UserModel.findByIdAndUpdate(req.params.id, update_values, { new: true }).then((user) => {
      res.status(200).send({
        success: true,
        message: "Username updated successfully",
        data: user
      })
    })
  } catch(error){
    res.status(404).send({
      success: fales,
      message: "Failed to update username",
      errorMsg: error
    })
  }
}

function updateUserGender(req, res) {
  const update_values = {
    gender: req.body.gender,
  }
  try{
    UserModel.findByIdAndUpdate(req.params.id, update_values, { new: true }).then((user) => {
      res.status(200).send({
        success: true,
        message: "User gender updated successfully",
        data: user
      })
    })
  } catch(error){
    res.status(404).send({
      success: fales,
      message: "Failed to update user gender",
      errorMsg: error
    })
  }
}

function updateUserStatus(req, res) {
  const update_values = {
    status: req.body.status,
  }
  try{
    UserModel.findByIdAndUpdate(req.params.id, update_values, { new: true }).then((user) => {
      res.status(200).send({
        success: true,
        message: "User status updated successfully",
        data: user
      })
    })
  } catch(error){
    res.status(404).send({
      success: fales,
      message: "Failed to update user status",
      errorMsg: error
    })
  }
}

async function updateUserAvatar(req, res) {
  // Check if avatar was uploaded
  const avatarPath = req.files?.avatar ? req.files.avatar[0].path : null;

  if (!avatarPath) {
    return res.status(400).send({
      success: false,
      message: "No avatar file uploaded",
    });
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarPath },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Avatar updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update avatar",
      errorMsg: error.message,
    });
  }
}



function deleteUser(req, res) {
  try {
    UserModel.findByIdAndDelete(req.params.id).then((user) => {
      res.status(200).send({
        success: true,
        message: "User deleted successfully",
        data: user
      })
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error deleteing user",
      data: error
    })
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ success: false, message: "Invalid email or password" });
    }

    res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        role: user.role,
        status: user.status,
        username: user.username,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      errorMsg: error.message,
    });
  }
}

const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);

    if (!isMatch) {
      return res.status(400).send({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send({
      success: false,
      message: "Failed to update password",
      errorMsg: error.message,
    });
  }
};





module.exports = { createUser, getUsers, getSingleUser, updateUserPassword, updateUserAvatar, updateUserGender, updateUserStatus, updateUsername, deleteUser, loginUser, getNonAdmins }