const validateTask = (req, res, next) => {
  const { title, description, assignee, status, priority } = req.body || {};

  if (!title || !description || !assignee || !priority) {
    return res.status(400).json({
      message: "Zorunlu alanlar eksik"
    });
  }

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof assignee !== "string"
  ) {
    return res.status(400).json({
      message: "title, description ve assignee metin olmalidir"
    });
  }

  if (
    !title.trim() ||
    !description.trim() ||
    !assignee.trim()
  ) {
    return res.status(400).json({
      message: "Metin alanlari bos birakilamaz"
    });
  }

  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Gecersiz priority degeri"
    });
  }

  const validStatuses = ["pending", "in_progress", "completed"];

  if (req.method === "PUT" && status === undefined) {
    return res.status(400).json({
      message: "Guncelleme icin status zorunludur"
    });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Gecersiz status degeri"
    });
  }

  next();
};

module.exports = validateTask;
