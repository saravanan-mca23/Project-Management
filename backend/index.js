const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // <-- import cors
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:5173", // <-- replace with your frontend URL
  credentials: true, // if you need cookies/auth headers
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes); // for /api/auth/all
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
