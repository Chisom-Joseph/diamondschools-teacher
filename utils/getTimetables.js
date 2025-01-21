const { Timetable } = require("../models");

module.exports = async () => {
  try {
    const timetables = await Timetable.findAll();

    if (timetables.length === 0) return [];

    const allTimeTables = await Promise.all(
      timetables.map(async (timetable) => {
        const currentTimetable = timetable.dataValues;
        // Fetch the subject for the timetable
        if (currentTimetable.subject !== "break") {
          const subject = await require("./getSubject")(
            currentTimetable.subject
          );
          currentTimetable.subject = subject;

          // Get class
          const classItem = await require("./getClass")(subject.ClassId);
          currentTimetable.class = classItem;
        }
        return currentTimetable;
      })
    );

    return allTimeTables || [];
  } catch (error) {
    console.error("ERROR TRYING TO GET TIMETABLES");
    console.error(error);
    return [];
  }
};
