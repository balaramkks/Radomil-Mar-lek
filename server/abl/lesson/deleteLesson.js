const Ajv = require("ajv");
const ajv = new Ajv();

const lessonDao = require("../../dao/lesson-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 14, maxLength: 14 },
    role: {
      type: "string",
      enum: ["zak", "ucitel"],
    }
  },
  required: ["id", "role"],
  additionalProperties: false,
};

async function deleteLesson(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;

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

    //check if lesson exists
    const existingLesson = lessonDao.get(reqParams.id);
    if (existingLesson) {
      const dateOfLesson = existingLesson.date;
      const timeOfLesson = existingLesson.start_time;

      lessonDao.remove(reqParams.id);
      res.json({
        message: `Lesson from ${dateOfLesson} in ${timeOfLesson} was deleted.`,
      });

     /* // Confirm dialog
      const confirmed = confirm(
        `Do you want delete lesson scheduled on  ${dateOfLesson} in ${timeOfLesson}?`
      );
      if (confirmed) {
        lessonDao.remove(reqParams.id);
        res.json({
          message: `Lesson from ${dateOfLesson} in ${timeOfLesson} was deleted.`,
        });
      } else {
        res.json({
          message: `This Lesson scheduled on ${dateOfLesson} in ${timeOfLesson} will not be deleted.`,
        });
      }*/
    } else {
      res.status(404).json({
        id: reqParams.id,
        message: "Lesson id doesnt exist",
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = deleteLesson;
