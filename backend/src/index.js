const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());
app.use(cors());
app.use("/projects", projectRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Ini data user", user: req.user });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


