import HTTPClient from "./httpclient";

const repoFactory = (initclient) => {
  const client = initclient || new HTTPClient();
  const permissionEnum = ["PUBLIC", "PRIVATE", "FRIENDSONLY"];
  return {
    async addrepo(name, permission) {
      if (!permissionEnum.includes(permission))
        throw Error(
          `invalid repository permission (${permission}) valid permission (${permissionEnum.join(
            "|"
          )})`
        );
      return client.addrepo(name, permission);
    },
    async updaterepo(repoid, name, permission) {
      return client.updaterepo(repoid, name, permission);
    },
    async getrepo(userid, page, pagelength) {
      return client.getrepo(userid, page, pagelength);
    },
    async deleterepo(repoid) {
      return client.deleterepo(repoid);
    },
  };
};

export default repoFactory;
