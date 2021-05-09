const router = require("express").Router();
const isAuthenticated = require("../middleware/auth");
const multer = require("multer");
const Image = require("../model/Image");
const Repo = require("../model/Repo");
const User = require("../model/User");
const path = require("path");
const fsPromises = require("fs").promises;

const upload = multer({
  dest: "uploads/",
  fileFilter: async function (req, res, cb) {
    var repoid = req.body.repoid;
    if (!repoid) {
      cb("repoid not specified", false);
    }
    req.body.repoid = parseInt(repoid);
    const ownRepo = await User.ownRepository(req.userid, req.body.repoid);
    if (ownRepo) {
      cb(null, true);
    } else {
      cb(`User ${req.userid} does not own ${req.body.repoid}`, false);
    }
  },
});

router.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  async function (req, res) {
    await Image.createImages(
      req.body.repoid,
      req.file.path,
      req.file.mimetype,
      req.body.description,
      req.body.title
    );

    return res.status(200).end("success");
  }
);

router.get("/", async function (req, res) {
  var repoid = req.query.repoid;
  var pagelength = parseInt(req.query.pagelength) || 5;
  var page = parseInt(req.query.page) || 0;
  if (!repoid) return res.status(400).json({ error: "repoid not specified" });
  repoid = parseInt(repoid);
  const repo = await Repo.getRepo(repoid);
  if (!repo)
    return res.status(400).json({ error: `repo id: ${repoid} does not exist` });
  // check if we can access repo
  const canAccess = await Repo.canAccess(
    req.userid,
    repo.ownedBy,
    repo.permission
  );
  if (canAccess) {
    const images = await Image.getRepoImages(repoid, page, pagelength);
    const owns = repo.ownedBy === req.userid;
    return res.status(200).json({
      ...images,
      name: repo.name,
      owns,
    });
  } else {
    return res.status(400).json({ error: "invalid permission" });
  }
});

router.get("/:id/", async function (req, res) {
  var imgid = parseInt(req.params.id);
  if (isNaN(imgid)) {
    return res.status(400).json({ error: "image id not specified" });
  }
  const img = await Image.getImage(imgid);
  if (!img)
    return res
      .status(400)
      .json({ error: `image id:${req.params.id} does not exist` });
  const canAccess = await Repo.canAccess(
    req.userid,
    img.repo.ownedBy,
    img.repo.permission
  );
  if (canAccess) {
    res.setHeader("Content-Type", img.mimetype);
    return res.sendFile(path.join(__dirname, "..", img.path));
  } else {
    return res.status(400).json({ error: "invalid permission" });
  }
});

router.patch("/", isAuthenticated, async function (req, res) {
  if (isNaN(req.body.imageid)) {
    return res.status(400).json({ error: "image id not specified" });
  }
  const img = await Image.getImage(req.body.imageid);
  if (!img)
    return res
      .status(400)
      .json({ error: `image id:${req.body.imageid} does not exist` });
  if (img.repo.ownedBy !== req.userid)
    return res
      .status(400)
      .json({
        error: `requesting client does not own image id: ${req.body.imageid}`,
      });
  await Image.updateImage(
    req.body.imageid,
    req.body.description,
    req.body.title
  );
  return res.status(200).end("success");
});

router.delete("/", isAuthenticated, async function (req, res) {
  if (isNaN(req.body.imageid)) {
    return res.status(400).json({ error: "image id not specified" });
  }
  const img = await Image.getImage(req.body.imageid);
  if (!img)
    return res
      .status(400)
      .json({ error: `image id:${req.params.id} does not exist` });
  if (img.repo.ownedBy !== req.userid)
    return res
      .status(400)
      .json({
        error: `requesting client does not own image id: ${req.body.imageid}`,
      });
  const imgdeleted = await Image.deleteImage(req.body.imageid);
  await fsPromises.unlink(path.join(__dirname, "..", img.path));
  return res.status(200).end("success");
});

module.exports = router;
