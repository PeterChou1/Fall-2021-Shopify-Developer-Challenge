/*
const expect = require('chai').expect
const User = require("../model/User");
const Image = require("../model/Image");
const Repo = require("../model/Repo");
const prisma = require("../prisma/db");
const username = 'testuser';
const password = 'testuser'

describe('image database test', function () {
    describe('test create image', function () {
        it("should a create user", async function () {
            // wait 10 seconds
            this.timeout(10000);
            const user = await User.createUser(username, password);
            const alluser = await prisma.user.findMany();
            const alluserid = alluser.map( u => u.id);
            expect(alluserid).to.contain(user.id);
        });
    });
    after(async function () {
        await prisma.user.delete({
            where: {
                username
            }
        })
    });
});
*/