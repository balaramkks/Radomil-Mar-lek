const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const lessonDao = require("../../dao/lesson-dao.js");


const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 14, maxLength: 14 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function getLeson(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

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

    // read lesson by given id
    const lesson = lessonDao.get(reqParams.id);
    if (!lesson) {
      res.status(404).json({
        code: "LessonNotFound",
        message: `Lesson ${reqParams.id} not found`,
      });
      return;
    }

    res.json(lesson);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = getLeson;
