const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const userController = require("./server/controller/user.js");
const lessonController = require("./server/controller/lesson.js");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded
app.use(cors());

app.get("/", (req, res) => {
  res.send("Vítej v naší autoškole!");
});

app.use("/user", userController);
app.use("/lesson", lessonController);

app.listen(port, () => {
  console.log(`I'am listening on port ${port}`);
});



