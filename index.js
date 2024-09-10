// Dependencies
const express = require("express");
const app = express();
const session = require("express-session");
const PORT = process.env.PORT || 3000;

const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000
  }
}));
// app.set("views", "./views");

// Routes
app.use("/", homeRoutes);
app.use("/admin", adminRoutes);

// Run server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
