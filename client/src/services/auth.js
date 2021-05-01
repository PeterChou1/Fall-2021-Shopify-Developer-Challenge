import HTTPClient from './httpclient'

const authFactory = initclient => {

    const client = initclient || new HTTPClient();

    return {
        async signin(username, password) {
            return client.signin(username, password);
        },

        async signout() {
            return client.signout();
        },

        async signup(username, password) {
            return client.signup(username, password);
        },
        async isAuth() {
            return client.isAuth();
        }
    }
}

export default authFactory;