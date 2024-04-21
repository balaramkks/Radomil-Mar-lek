const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const lessonDao = require("../../dao/lesson-dao.js");
const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    date: {
      type: "string",
      pattern: "^(0?[1-9]|[12][0-9]|3[01]).(0?[1-9]|1[0-2]).[0-9]{4}$",
    },
    start_time: {
      type: "string",
      pattern: "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
    },
    student_id: { type: "string", minLength: 10, maxLength: 10 },
    tutor_id: { type: "string", minLength: 0, maxLength: 10, default: null },
    validity: { type: "boolean", default: false },
  },
  required: ["date", "start_time", "student_id"],
  additionalProperties: false,
};

async function createLesson(req, res) {
  try {
    let lesson = req.body;

    // Set default values for validity and tutor_id
    lesson.validity = false;
    lesson.tutor_id = "";

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

    // Check if the user is exists and is student
    const user = userDao.get(lesson.student_id);
    if (!user) {
      res.status(400).json({
        code: "invalidStudentId",
        message: `Student with ID ${lesson.student_id} does not exist`,
      });
      return;
    } else {
      if (user.role != "zak") {
        res.status(400).json({
          code: "invalidUserRole",
          message: "Only a student can create Lesson",
        });
        return;
      }
    }

    // Pokud zatim neexistuje zadna lekce, zalozime ji
    const firstLesson = lessonDao.list();
    if (firstLesson.message === "There exist no Lessons.") {
      // Create the first lesson if no lessons exist
      lesson = lessonDao.create(lesson);
      res.json(lesson);
      return;
    }

     // Check for conflicting lesson
     const lessons = lessonDao.list();
     const conflictingLesson = lessons.find(
       (l) => l.date === lesson.date && l.start_time === lesson.start_time
     );
 
     if (conflictingLesson) {
       res.status(400).json({
         code: "lessonConflict",
         message: "This time slot is alreay booked. Book your ride on another hour",
       });
       return;
     }

    // Create the lesson if all checks pass
    lesson = await lessonDao.create(lesson);
    return res.json(lesson);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = createLesson;
