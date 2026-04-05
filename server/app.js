const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/loginRoute");
const adminRoutes = require("./routes/AdminRoutes");
const studentRoutes = require("./routes/StudentRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
