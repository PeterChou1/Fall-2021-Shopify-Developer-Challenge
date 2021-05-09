import HTTPClient from "./httpclient";

const userFactory = (initclient) => {
  const client = initclient || new HTTPClient();

  return {
    async getusers(page, pagelength) {
      return client.getusers(page, pagelength);
    },
    async deleteuser() {
      return client.deleteuser();
    },
  };
};

export default userFactory;
