const axios = require("axios");

const logger = async (stack, level, packageName, message) => {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      }
    );

    console.log("Log sent successfully");
  } catch (error) {
    console.log("Logging failed:", error.message);
  }
};

module.exports = logger;