export default class HTTPClient {
  constructor() {
    this.uri = "";
    if (window.location.port === "3000") {
      // in development port 4000 is backend default port
      this.uri = "http://localhost:4000";
    }
  }

  async deleteuser() {
    return fetch(`${this.uri}/api/users/delete`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  async signin(username, password) {
    return fetch(`${this.uri}/api/users/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  async signout() {
    return fetch(`${this.uri}/api/users/signout`, {
      credentials: "include",
    });
  }

  async signup(username, password) {
    return fetch(`${this.uri}/api/users/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  async getusers(page, pagelength) {
    return fetch(
      `${this.uri}/api/users/profiles?` +
        new URLSearchParams({ page, pagelength }),
      {
        method: "GET",
      }
    );
  }

  async addrepo(name, permission) {
    return fetch(`${this.uri}/api/repo/`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, permission }),
    });
  }

  async getrepo(userid, page, pagelength) {
    return fetch(
      `${this.uri}/api/repo?` +
        new URLSearchParams({ userid, page, pagelength }),
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  async deleterepo(repoid) {
    return fetch(`${this.uri}/api/repo/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoid }),
    });
  }
  async updaterepo(repoid, name, permission) {
    return fetch(`${this.uri}/api/repo/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoid, name, permission }),
    });
  }
  async addimage(formdata) {
    return fetch(`${this.uri}/api/images`, {
      method: "POST",
      credentials: "include",
      body: formdata,
    });
  }

  async getimagerepo(repoid, page, pagelength) {
    return fetch(
      `${this.uri}/api/images?` +
        new URLSearchParams({ repoid, page, pagelength }),
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  async updateimage(imageid, title, description) {
    return fetch(`${this.uri}/api/images`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageid, title, description }),
    });
  }

  async deleteimage(imageid) {
    return fetch(`${this.uri}/api/images`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageid }),
    });
  }
}
