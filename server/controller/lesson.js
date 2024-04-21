const express = require("express");
const router = express.Router();

const getLesson = require("../abl/lesson/getLesson");
const listLesson = require("../abl/lesson/listLesson");
const createLesson = require("../abl/lesson/createLesson");
const deleteLesson = require("../abl/lesson/deleteLesson");
const approveLesson = require("../abl/lesson/approveLesson");
const disapproveLesson = require("../abl/lesson/disapproveLesson")

router.get("/get", getLesson);
router.get("/list", listLesson);
router.post("/create", createLesson);
router.delete("/delete", deleteLesson);
router.patch("/approve", approveLesson);
router.patch("/disapprove", disapproveLesson);

module.exports = router;
