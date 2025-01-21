module.exports = (time) => {
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12; // Convert 24-hour format to 12-hour
  hour = hour ? hour : 12; // 0 becomes 12 for AM/PM formatting
  const formattedTime = `${hour}:${minutes} ${period}`;

  return formattedTime;
};
