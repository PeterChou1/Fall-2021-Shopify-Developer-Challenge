const prisma = require("../prisma/db");
const Repo = require("./Repo");
const path = require("path");
const fs = require("fs");

const Image = {
  async createImages(repoid, path, mimetype, description, title) {
    return prisma.picture.create({
      data: {
        path,
        mimetype,
        description,
        title,
        repo: {
          connect: {
            id: repoid,
          },
        },
      },
    });
  },
  async getImage(imageid) {
    return prisma.picture.findUnique({
      where: {
        id: imageid,
      },
      include: {
        repo: true,
      },
    });
  },
  async getRepoImages(repoid, page, pagelength) {
    const getcount = prisma.picture.count({
      where: {
        repoId: repoid,
      },
    });
    const getimages = prisma.picture.findMany({
      where: {
        repoId: repoid,
      },
      take: pagelength,
      skip: pagelength * page,
    });
    const [count, images] = await prisma.$transaction([getcount, getimages]);
    return {
      count,
      images,
    };
  },
  async updateImage(imgid, description, title) {
    return prisma.picture.update({
      where: {
        id: imgid,
      },
      data: {
        description,
        title,
      },
    });
  },
  async deleteImage(imgid) {
    return prisma.picture.delete({
      where: {
        id: imgid,
      },
    });
  },
};

module.exports = Image;
