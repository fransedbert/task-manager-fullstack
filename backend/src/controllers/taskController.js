const prisma = require("../config/prisma");

exports.createTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        status: "todo",
        projectId,
      },
    });

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const tasks = await prisma.task.findMany({
      where: { projectId: Number(projectId) },
    });

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error get tasks" });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const newStatus = task.status === "done" ? "todo" : "done";

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: {
      status: newStatus,
    },
  });

  res.json(updated);
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error delete task" });
  }
};

exports.toggleTask = async (req, res) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const newStatus = task.status === "done" ? "todo" : "done";

  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: {
      status: newStatus,
    },
  });

  res.json(updated);
};
