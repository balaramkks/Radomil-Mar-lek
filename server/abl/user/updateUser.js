const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 15 },
    surname: {type: "string", minLength: 2, maxLength: 15},
    email: { type: "string", format: "email" },
    sex: {type: "string", enum: ["man", "woman"],},
    age: {type: "integer", minLength:2, maxLength: 2},
    number_of_approved_rides: {type: "integer"},
  },
  required: ["id"],
  additionalProperties: true,
};

async function updateUser(req, res) {
  try {
    let user = req.body;

    // validate input
    const valid = ajv.validate(schema, user);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    //validate of uniqe email
    const userList = userDao.list();
    const emailExists = userList.some(
      (u) => u.email === user.email && u.id !== user.id
    );
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${user.email} already exists`,
      });
      return;
    }

    //validate user existence
    const updatedUser = userDao.update(user);
    if (!updatedUser) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${user.id} not found`,
      });
      return;
    }

    res.json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = updateUser;
