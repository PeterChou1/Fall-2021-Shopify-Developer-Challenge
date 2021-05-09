const prisma = require("../prisma/db");
const User = require("./User");
const Permission = require("./Permission");

const Repo = {
  async accessPermission(accessUserId, readUserId) {
    /* undefined implies user is unauthenticated */
    if (accessUserId === undefined) {
      return [{ permission: Permission.PUBLIC }];
    }
    if (accessUserId === readUserId) {
      return [
        { permission: Permission.PUBLIC },
        { permission: Permission.FRIENDSONLY },
        { permission: Permission.PRIVATE },
      ];
    } else if (await User.isFriend(accessUserId, readUserId)) {
      return [
        { permission: Permission.PUBLIC },
        { permission: Permission.FRIENDSONLY },
      ];
    } else {
      return [{ permission: Permission.PUBLIC }];
    }
  },
  async canAccess(accessId, ownerId, resourcePermission) {
    const accessPermission = (
      await Repo.accessPermission(accessId, ownerId)
    ).map((p) => p.permission);
    return accessPermission.includes(resourcePermission);
  },
  async createRepo(userid, name, permission) {
    return prisma.repo.create({
      data: {
        name,
        permission,
        owner: {
          connect: {
            id: userid,
          },
        },
      },
    });
  },
  async getRepo(repoid, pictures = false) {
    return prisma.repo.findUnique({
      where: {
        id: repoid,
      },
      include: {
        pictures,
      },
    });
  },
  async readUserRepo(accessUserId, readUserId, page, pagelength) {
    const permission = await Repo.accessPermission(accessUserId, readUserId);
    const getcount = prisma.repo.count({
      where: {
        ownedBy: readUserId,
        OR: permission,
      },
    });
    const getrepos = prisma.repo.findMany({
      where: {
        ownedBy: readUserId,
        OR: permission,
      },
      take: pagelength,
      skip: pagelength * page,
    });
    const [count, repos] = await prisma.$transaction([getcount, getrepos]);
    return {
      count,
      repos,
    };
  },
  async updateRepository(repoid, name, permission) {
    return await prisma.repo.update({
      where: {
        id: repoid,
      },
      data: {
        name,
        permission,
      },
    });
  },
  async deleteRepo(repoId) {
    // delete
    // delete all pictures
    const deletePictures = prisma.picture.deleteMany({
      where: {
        repoId,
      },
    });
    // delete repository
    const deleteRepo = prisma.repo.delete({
      where: {
        id: repoId,
      },
    });
    return prisma.$transaction([deletePictures, deleteRepo]);
  },
};

module.exports = Repo;
