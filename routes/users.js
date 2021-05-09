const router = require("express").Router();
const bcrypt = require("bcrypt");
const prisma = require("../prisma/db");
const isAuthenticated = require("../middleware/auth");
const User = require("../model/User");
const Repo = require("../model/Repo");
const fsPromises = require("fs").promises;
const path = require("path");

router.post("/signup/", async function (req, res) {
  try {
    const user = await User.createUser(req.body.username, req.body.password);
    // init session track username and id
    req.session.userid = user.id;
    res
      .cookie("username", user.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .cookie("userid", user.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .json({
        userid: user.id,
        username: user.username,
      });
  } catch (err) {
    if (
      err.message.includes(
        "Unique constraint failed on the fields: (`username`)"
      )
    ) {
      res.status(409).json({ error: "user name already exist" });
    }
    // rethrow error to error handler
    throw Error(err);
  }
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
router.post("/signin/", async function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  const user = await User.findUser(username);
  if (!user)
    return res.status(404).json({ error: `${username} does not exist` });
  const valid = await bcrypt.compare(password, user.password);
  // retrieve user from the databas
  if (!valid) return res.status(401).json({ error: "incorrect password" });
  //init session
  req.session.userid = user.id;
  res
    .cookie("username", user.username, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    .cookie("userid", user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    .status(200)
    .json({
      userid: user.id,
      username: username,
    });
});

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
router.get("/signout/", isAuthenticated, function (req, res) {
  req.session.destroy((_) => _);
  // clearing cookie to log out
  res.clearCookie("username");
  res.clearCookie("userid");
  res.sendStatus(200);
});

router.delete("/delete/", isAuthenticated, async function (req, res) {
  const user = await User.findUserById(req.userid, true);
  let repos = [];
  for (var repo of user.repos) {
    repos.push(Repo.getRepo(repo.id, true));
  }
  repos = await Promise.all(repos);
  const promises = [];
  for (var repo of repos) {
    for (var picture of repo.pictures) {
      promises.push(
        fsPromises.unlink(path.join(__dirname, "..", picture.path))
      );
    }
    promises.push(Repo.deleteRepo(repo.id));
  }
  // delete all files + repositories
  await Promise.all(promises);
  // delete user
  await User.deleteUser(req.userid);
  req.session.destroy((_) => _);
  res.clearCookie("username");
  res.clearCookie("userid");
  res.sendStatus(200);
});

router.get("/profiles/", async function (req, res) {
  var pagelength = parseInt(req.query.pagelength) || 5;
  var page = parseInt(req.query.page) || 0;
  const users = await User.getUsers(page, pagelength);
  res.status(200).json(users);
});

module.exports = router;
