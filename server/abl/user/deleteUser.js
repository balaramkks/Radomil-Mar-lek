const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function deleteUser(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;
    console.log(reqParams);
    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    //check if user exists
    const existingUser = userDao.get(reqParams.id);
    if (existingUser) {
      const deletedUserName = existingUser.name;
      const deletedUserSurName = existingUser.surname;

      userDao.remove(reqParams.id);
      res.json({
        message: `Uživatel byl ${deletedUserName} ${deletedUserSurName} smazán.`,
      });
      /*POVOL AZ BUDES NAHRAVAT NA GITHUB - ODEVZDAVAT UKOL
 // Confirm dialog
      const confirmed = confirm(
        `Do you want delete user ${deletedUserName} ${deletedUserSurName}?`
      );
      if (confirmed) {
        userDao.remove(reqParams.id);
        res.json({
          message: `Uživatel byl ${deletedUserName} ${deletedUserSurName} smazán.`,
        });
      }else {
        res.json({
          message: `Akce smazání uživatele ${deletedUserName} ${deletedUserSurName} byla zrušena.`,
        });
      }
      */
    } else {
      res.status(404).json({
        id: reqParams.id,
        message: "User id doesnt exist",
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = deleteUser;
