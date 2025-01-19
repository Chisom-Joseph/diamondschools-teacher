const updateTimetableSchema = require("../../../validation/timetable/update");
const { Timetable } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate timetable
    const timetableValid = updateTimetableSchema.validate(req.body);
    if (timetableValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: timetableValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "update");
      req.flash("status", 400);
      return res.redirect("/dashboard/timetable");
    }

    // Format time
    const timeFrom = require("../../../utils/timeFormatter")(req.body.timeFrom);
    const timeTo = require("../../../utils/timeFormatter")(req.body.timeTo);
    let time = `${timeFrom} - ${timeTo}`;

    // Update timetable in db
    const updatedTimetable = await Timetable.update(
      {
        day: req.body.day,
        time,
        subject: req.body.subject,
      },
      {
        where: { id: req.body.id },
      }
    );

    console.log(updatedTimetable);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: "Timetable updated successfully.",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    res.redirect("/dashboard/timetable");
  } catch (error) {
    console.log("ERROR UPDATING TIMETABLE");
    console.log(error);
  }
};
