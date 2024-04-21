const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const lessonDao = require("../../dao/lesson-dao.js");
const userDao  = require("../../dao/user-dao.js"); 

const schema = {
  type: "object",
  properties: {
    id: { type: "string"},
    tutor_id: { type: "string", minLength: 0, maxLength: 10},
    validity: { type: "boolean", default: false },
  },
  required: ["id", "tutor_id"],
  additionalProperties: false,
};


async function disaproveLesson(req, res) {
  try {
    let lesson = req.body;

    // validate input
    const valid = ajv.validate(schema, lesson);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    
   // Find the user with the tutor_id
   const user = userDao.get(lesson.tutor_id);

   // Check if user exists and has role "ucitel"
   if (!user || user.role !== "ucitel") {
     res.status(400).json({
       code: "invalidTutor",
       message: "Invalid tutor_id. Tutor id must have role a teacher.",
     });
     return;
   }

    //validity set to false
    lesson.validity = false;
    lesson.tutor_id = req.body.tutor_id;

    const updatedLesson = lessonDao.update(lesson);
    if (!updatedLesson) {
      res.status(404).json({
        code: "lessonNotFound",
        message: `Lesson ${lesson.id} not found`,
      });
      return;
    }

    res.json(updatedLesson);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = disaproveLesson;

