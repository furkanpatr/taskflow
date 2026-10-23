const tasks = require("../data/tasks");

let nextId = 1;

const createTask = (req, res) => {
  const { title, description, assignee, priority } = req.body;

  const newTask = {
    id: nextId++,
    title,
    description,
    assignee,
    status: "pending",
    priority
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
};

const getAllTasks = (req, res) => {
  const { status, priority, search } = req.query;

  let filteredTasks = tasks;

  if (status) {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === status
    );
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === priority
    );
  }

  if (search) {
    filteredTasks = filteredTasks.filter(
      (task) => task.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.status(200).json(tasks);
};

const getTaskById = (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Gorev bulunamadi"
    });
  }

  res.status(200).json(task);
};

const updateTask = (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Gorev bulunamadi"
    });
  }

  const { title, description, assignee, status, priority } = req.body;

  task.title = title;
  task.description = description;
  task.assignee = assignee;
  task.status = status;
  task.priority = priority;

  res.status(200).json(task);
};

const deleteTask = (req, res) => {
  const taskId = Number(req.params.id);

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Gorev bulunamadi"
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};
