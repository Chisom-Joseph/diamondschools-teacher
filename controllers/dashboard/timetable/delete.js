const deleteTimetableSchema = require("../../../validation/timetable/delete");
const { Timetable } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate timetable
    const timetableValid = deleteTimetableSchema.validate(req.body);
    if (timetableValid.error) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: timetableValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/timetable");
    }

    // Delete timetable in db
    const deletedTimetable = await Timetable.destroy({
      where: { id: req.body.id },
    });

    if (deletedTimetable === 0) {
      req.flash("alert", {
        status: "error",
        section: "update",
        message: "No item found or deleted",
      });
      req.flash("form", req.body);
      req.flash("status", 400);
      return res.redirect("/dashboard/timetable");
    }

    console.log(deletedTimetable);

    req.flash("alert", {
      status: "success",
      section: "update",
      message: "Timetable deleted successfully.",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    res.redirect("/dashboard/timetable");
  } catch (error) {
    console.log("ERROR DELETING TIMETABLE");
    console.log(error);
  }
};
