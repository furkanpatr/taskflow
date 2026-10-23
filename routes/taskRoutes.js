const express = require("express");
const validateTask = require("../middleware/taskValidation");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);

router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
