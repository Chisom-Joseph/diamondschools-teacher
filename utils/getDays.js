module.exports = async () => {
  try {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  } catch (error) {
    console.log("ERROR GETTING DAYS:");
    console.log(error);
  }
};
