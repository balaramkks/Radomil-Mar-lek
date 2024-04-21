const express = require("express");
const router = express.Router();

const getUser = require("../abl/user/getUser.js");
const createUser = require("../abl/user/createUser.js");
const userList = require("../abl/user/userList.js");
const deleteUser = require("../abl/user/deleteUser.js");
const updateUser = require("../abl/user/updateUser.js");

router.get("/get", getUser);
router.post("/create", createUser);
router.get("/list", userList);
router.delete("/delete", deleteUser);
router.patch("/update", updateUser);

module.exports = router;