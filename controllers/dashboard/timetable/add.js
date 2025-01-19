const addTimetableSchema = require("../../../validation/timetable/add");
const { Timetable } = require("../../../models");

module.exports = async (req, res) => {
  try {
    // Validate timetable
    const timetableValid = addTimetableSchema.validate(req.body);
    if (timetableValid.error) {
      req.flash("alert", {
        status: "error",
        section: "add",
        message: timetableValid.error.message,
      });
      req.flash("form", req.body);
      req.flash("formSection", "add");
      req.flash("status", 400);
      return res.redirect("/dashboard/timetable");
    }

    // Format time
    const timeFrom = require("../../../utils/timeFormatter")(req.body.timeFrom);
    const timeTo = require("../../../utils/timeFormatter")(req.body.timeTo);
    let time = `${timeFrom} - ${timeTo}`;

    // Check if day is an array
    if (Array.isArray(req.body.day)) {
      req.body.day.forEach(async (currentDay) => {
        try {
          // Use upsert to either update an existing record or create a new one
          const [newTimetable, created] = await Timetable.upsert({
            day: currentDay,
            time,
            subject: req.body.subject,
            ClassId: req.body.class,
          });

          if (created) {
            console.log(`Created new timetable:`, newTimetable);
          } else {
            console.log(`Updated existing timetable:`, newTimetable);
          }
        } catch (error) {
          console.error(`Error processing day: ${currentDay}`, error);
        }
      });
    } else {
      try {
        // Use upsert to either update an existing record or create a new one
        const [newTimetable, created] = await Timetable.upsert({
          day: req.body.day,
          time,
          subject: req.body.subject,
          ClassId: req.body.class,
        });

        if (created) {
          console.log(`Created new timetable:`, newTimetable);
        } else {
          console.log(`Updated existing timetable:`, newTimetable);
        }
      } catch (error) {
        console.error(`Error processing day: ${req.body.day}`, error);
      }
    }

    req.flash("alert", {
      status: "success",
      section: "add",
      message: "Timetable added successfully.",
    });
    req.flash("form", req.body);
    req.flash("status", 200);
    res.redirect("/dashboard/timetable");
  } catch (error) {
    console.log("ERROR ADDING TIMETALBE");
    console.log(error);
  }
};
