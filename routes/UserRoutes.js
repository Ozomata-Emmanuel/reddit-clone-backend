const express = require("express");
const router = express.Router();
const { createUser, getUsers, getSingleUser, deleteUser, updateUserPassword, updateUsername, updateUserStatus, loginUser, updateUserGender, updateUserAvatar, getNonAdmins } = require("../controllers/UserController");
const uploadMiddleware = require("../utils/upload");

router.post("/reddit/api/users/login", loginUser);
router.post("/reddit/api/users/register", createUser);
router.get("/reddit/api/users/all", getUsers);
router.get("/reddit/api/users/allusers", getNonAdmins);
router.get("/reddit/api/user/:id", getSingleUser);
router.put("/reddit/api/updateUser/username/:id", updateUsername);
router.put("/reddit/api/updateUser/password/:id", updateUserPassword);
router.put("/reddit/api/updateUser/gender/:id", updateUserGender);
router.put("/reddit/api/updateUser/status/:id", updateUserStatus);
router.put("/reddit/api/updateUser/avatar/:id", uploadMiddleware, updateUserAvatar);
router.delete("/reddit/api/deleteUser/:id", deleteUser);

module.exports = router;
