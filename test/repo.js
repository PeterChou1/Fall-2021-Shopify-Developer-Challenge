/*
const expect = require('chai').expect
const User = require("../model/User");
const Repo = require("../model/Repo");
const prisma = require("../prisma/db");
const username = 'testuser';
const password = 'testuser'
const testrepo = 'testuser';
const permission = 'PUBLIC'

describe('repo database test', function () {
    describe('test create user', function () {
        it("should a create repo", async function () {
            // wait 10 seconds
            this.timeout(10000);
            const user = await User.createUser(username, password);
            const alluser = await prisma.user.findMany();
            const alluserid = alluser.map( u => u.id);
            expect(alluserid).to.contain(user.id);
            const repo = await Repo.createRepo(user.id, testrepo, permission)
            const allrepo = await prisma.repo.findMany();
            const allrepoid = allrepo.map( r => r.id);
            expect(allrepoid).to.contain(repo.id);
        });
    });
    after(async function () {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        await prisma.repo.delete({
            where: {
                ownedBy: user.id
            }
        })
        await prisma.user.delete({
            where: {
                username
            }
        })
    });
});
*/