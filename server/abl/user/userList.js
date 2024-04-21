const userDao = require("../../dao/user-dao.js");

async function userList(req, res) {
  try {
    const userList = userDao.list();
    res.json(userList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = userList;
