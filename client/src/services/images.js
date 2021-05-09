import HTTPClient from "./httpclient";

const imageFactory = (initclient) => {
  const client = initclient || new HTTPClient();
  return {
    async addImage(formdata) {
      return client.addimage(formdata);
    },
    async getImageRepo(id, page, pagelength) {
      return client.getimagerepo(id, page, pagelength);
    },
    async updateImage(id, title, description) {
      return client.updateimage(parseInt(id), title, description);
    },
    async deleteImage(id) {
      return client.deleteimage(parseInt(id));
    },
  };
};

export default imageFactory;
