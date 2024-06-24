require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const explorerRoutes = require("./routes/explorerRoutes");
const businessRoutes = require("./routes/businessRoutes");
const db = require("./database/index");
const app = express();

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/explorer", explorerRoutes);
app.use("/business", businessRoutes);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server listening at http://${process.env.DB_HOST}:${process.env.PORT}`); 
});
