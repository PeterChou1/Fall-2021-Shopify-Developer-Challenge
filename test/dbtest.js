const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async function () {
  const picture = await prisma.picture.findMany();
  console.log(picture);
})();
