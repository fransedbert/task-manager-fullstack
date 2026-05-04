const prisma = require("../config/prisma");

exports.createProject = async (req, res) => {
  const { name } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      userId: req.user.id,
    },
  });

  res.json(project);
};


exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        tasks: true, //relasi
      },
    });

    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error get projects" });
  }
};

