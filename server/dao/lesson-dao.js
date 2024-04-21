const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const lessonFolderPath = path.join(__dirname, "storage", "lessonList");

// Method to read an lesson from a file
function get(lessonId) {
  try {
    const filePath = path.join(lessonFolderPath, `${lessonId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToGetLesson", message: error.message };
  }
}

// Method to write an lesson to a file
function create(lesson) {
  try {
    lesson.id = crypto.randomBytes(7).toString("hex");
    const filePath = path.join(lessonFolderPath, `${lesson.id}.json`);
    const fileData = JSON.stringify(lesson);
    fs.writeFileSync(filePath, fileData, "utf8");
    return lesson;
  } catch (error) {
    throw { code: "failedToCreateLesson", message: error.message };
  }
}

// Method to update lesson in a file
function update(lesson) {
  try {
    const currentEvent = get(lesson.id);
    if (!currentEvent) return null;
    const newEvent = { ...currentEvent, ...lesson };
    const filePath = path.join(lessonFolderPath, `${lesson.id}.json`);
    const fileData = JSON.stringify(newEvent);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newEvent;
  } catch (error) {
    throw { code: "failedToDisapproveLesson", message: error.message };
  }
}

// Method to remove an lesson from a file
function remove(lessonId) {
  try {
    const filePath = path.join(lessonFolderPath, `${lessonId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveLesson", message: error.message };
  }
}

// Method to list lessons in a folder
function list() {
  try {
    const files = fs.readdirSync(lessonFolderPath);
    const lessonList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(lessonFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    lessonList.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Check if lessonList is empty, return null if empty
    if (lessonList.length === 0) {
      return { message: "There exist no Lessons." };
    }

    return lessonList;
  } catch (error) {
    throw { code: "failedToListLesson", message: error.message };
  }
}

//Tato metoda získává všechny lekce pomocí lessonDao.list()
// a pak používá filter, aby vybral pouze lekce s konkrétním datem.
function getByDate(date) {
  try {
    const allLessons = list();
    // Pokud `list()` vrátí prázdné pole nebo jiný nevhodný typ
    if (!Array.isArray(allLessons)) {
      throw new Error("No lessons data available.");
    }

    let lessonsOnDate = [];

    // Projít všechny lekce a najít ty na dané datum
    for (const lesson of allLessons) {
      if (lesson.date === date) {
        lessonsOnDate.push(lesson);
      }
    }

    // Pokud nebyly nalezeny žádné lekce pro dané datum
    if (lessonsOnDate.length === 0) {
      return null;
    }

    return lessonsOnDate;
  } catch (error) {
    throw { code: "failedToGetLessonsByDate", message: error.message };
  }
}


module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getByDate,
};
