const prisma = require("../prisma/db");
const bcrypt = require("bcrypt");

const User = {
  async createUser(username, password) {
    const passwordHashed = await bcrypt.hash(password, 15);
    return prisma.user.create({
      data: {
        username,
        password: passwordHashed,
      },
    });
  },
  async findUserById(id, repos = false) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        repos,
      },
    });
  },
  async findUser(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  },
  async deleteUser(userid) {
    return prisma.user.delete({
      where: {
        id: userid,
      },
    });
  },
  async getUsers(page, pagelength) {
    return prisma.user.findMany({
      take: pagelength,
      skip: pagelength * page,
    });
  },
  async ownRepository(userid, repoid) {
    if (userid === undefined) return false;
    const repos = await prisma.user
      .findUnique({
        where: {
          id: userid,
        },
      })
      .repos();
    return repos.map((repo) => repo.id).includes(repoid);
  },
  async isFriend(userAId, userBId) {
    const friend = await prisma.friendRequest.findFirst({
      where: {
        accepted: true,
        OR: [
          {
            sendId: userAId,
            recieveId: userBId,
          },
          {
            sendId: userBId,
            recieveId: userAId,
          },
        ],
      },
    });
    return !!friend;
  },

  async createFriendRequest() {},
};

module.exports = User;
