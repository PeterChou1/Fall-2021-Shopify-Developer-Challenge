require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const http = require("http");
const port = Number(process.env.PORT || 4000);
const cors = require("cors");
const errorHandler = require("./middleware/error");
const path = require("path");

/* API routes */
const userRoutes = require("./routes/users");
const repoRoutes = require("./routes/repo");
const imageRoutes = require("./routes/images");
const env = process.env.NODE_ENV || "development";

app.use(
  cors({
    credentials: true,
    origin:
      env === "development"
        ? ["http://localhost:4000", "http://localhost:3000"]
        : true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  req.userid = req.session.userid ? req.session.userid : null;
  next();
});

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/images", imageRoutes);
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.use(errorHandler);

http.createServer(app).listen(port, function (err) {
  if (err) console.log(err);
  else {
    console.log("HTTP server on http://localhost:%s", port);
  }
});
