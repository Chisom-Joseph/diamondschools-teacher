const { Teacher } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const TeacherFromDb = await Teacher.findOne({ where: { id } });
    if (!TeacherFromDb) return {};

    return TeacherFromDb.dataValues;
  } catch (error) {
    console.error(`ERROR GETTING Teacher: ${error}`);
    return {};
  }
};
