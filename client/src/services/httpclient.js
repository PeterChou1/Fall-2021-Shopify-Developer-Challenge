
export default class HTTPClient {
    constructor() {
        this.uri = "";
        if (window.location.port === "3000") {
            // in development port 4000 is backend default port
            this.uri = "http://localhost:4000";
        }
    }

    async signin(username, password) {
        console.log('attempt signin')
        console.log({username, password});
        return fetch(`${this.uri}/api/users/signin`, 
        { 
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({ username, password })
        })
    }

    async signout() {
        return fetch(`${this.uri}/api/users/signout`, {
            redirect : 'follow'
        })
    }

    async signup(username, password) {
        console.log('attempt signup');
        console.log({username, password});
        return fetch(`${this.uri}/api/users/signup`, { 
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({ username, password })
        })
    }

    async isAuth() {
        return fetch(`${this.uri}/api/users/auth`, {
            credentials: 'include'
        })
    }

}


