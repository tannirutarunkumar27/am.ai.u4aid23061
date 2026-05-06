const express = require("express");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Notification System Backend Running"
  });

});

app.use("/api/notifications", notificationRoutes);

const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});