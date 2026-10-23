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

app.use((req, res) => {
  res.status(404).json({ message: "Rota bulunamadi" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Gecersiz JSON govdesi" });
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
    ? err.status
    : 500;
  res.status(status).json({ message: "Istek islenemedi" });
});

app.listen(PORT, () => {
  console.log(`TASKFLOW API ${PORT} portunda çalışıyor.`);
});
