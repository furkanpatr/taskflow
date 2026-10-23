const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const logger = require("./middleware/logger");

const app = express();

app.use(logger);
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "TASKFLOW API calisiyor" });
});

app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`TASKFLOW API ${PORT} portunda çalışıyor.`);
});
