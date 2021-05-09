const router = require("express").Router();
const isAuthenticated = require("../middleware/auth");
const Repo = require("../model/Repo");
const Permission = require("../model/Permission");
const User = require("../model/User");
const path = require("path");
const fsPromises = require("fs").promises;

router.post("/", isAuthenticated, async function (req, res) {
  const name = req.body.name || "Image Repo";
  const permission = req.body.permission || Permission.PUBLIC;
  if (!Permission.isValid(permission)) {
    return res.status(400).json({ error: `permission not valid` });
  }
  await Repo.createRepo(req.userid, name, permission);
  res.status(200).end("success");
});

router.get("/", async function (req, res) {
  var queryid = req.query.userid;
  var pagelength = parseInt(req.query.pagelength) || 5;
  var page = parseInt(req.query.page) || 0;
  if (!queryid) return res.status(400).json({ error: "userid not specified" });
  queryid = parseInt(req.query.userid);
  // user is authenticated
  const repoData = await Repo.readUserRepo(
    req.userid,
    queryid,
    page,
    pagelength
  );
  const user = await User.findUserById(queryid);
  return res.status(200).json({ ...repoData, username: user.username });
});

router.get("/:id", async function (req, res) {
  var repoid = parseInt(req.params.id);
  if (isNaN(repoid)) {
    return res.status(400).json({ error: "repo id not specified" });
  }
  const repo = await Repo.getRepo(repoid, true);
  if (!repo)
    return res
      .status(400)
      .json({ error: `repo id:${req.params.id} does not exist` });
  const canAccess = await Repo.canAccess(req.userid, repoid, repo.permission);
  if (canAccess) {
    const pictures = repo.pictures;
    if (pictures.length > 0) {
      const thumbnail = pictures[Math.floor(Math.random() * pictures.length)];
      res.setHeader("Content-Type", thumbnail.mimetype);
      return res.sendFile(path.join(__dirname, "..", thumbnail.path));
    } else {
      res.setHeader("Content-Type", "image/jpeg");
      return res.sendFile(path.join(__dirname, "../assets/defaultimage.jpg"));
    }
  } else {
    return res.status(400).json({ error: "invalid permission" });
  }
});

router.patch("/", isAuthenticated, async function (req, res) {
  var repoid = req.body.repoid;
  var name = req.body.name;
  var permission = req.body.permission;
  if (isNaN(repoid)) {
    return res.status(400).json({ error: "repo id not specified" });
  }
  if (!Permission.isValid(permission)) {
    return res.status(400).json({ error: `permission not valid` });
  }
  if (typeof name !== "string" || name === "") {
    return res.status(400).json({ error: "invalid repository name" });
  }
  queryid = parseInt(req.query.userid);
  // user is authenticated
  const ownRepository = await User.ownRepository(req.userid, repoid);
  if (!ownRepository) {
    return res
      .status(400)
      .json({
        error: `user (id ${req.userid}) does not own repo (id ${repoid})`,
      });
  }
  await Repo.updateRepository(repoid, name, permission);
  return res.status(200).end("success");
});

router.delete("/", isAuthenticated, async function (req, res) {
  var repoId = req.body.repoid;
  if (isNaN(repoId)) {
    return res.status(400).json({ error: "repo id not specified" });
  }
  const ownRepository = await User.ownRepository(req.userid, repoId);
  if (!ownRepository) {
    return res
      .status(400)
      .json({
        error: `user (id ${req.userid}) does not own repo (id ${repoId})`,
      });
  }
  // delete all picture
  const repo = await Repo.getRepo(repoId, true);
  const filedelete = [];
  repo.pictures.forEach((img) => {
    filedelete.push(fsPromises.unlink(path.join(__dirname, "..", img.path)));
  });
  await Promise.all(filedelete);
  // delete all database information
  await Repo.deleteRepo(repoId);
  return res.status(200).end("success");
});

module.exports = router;
