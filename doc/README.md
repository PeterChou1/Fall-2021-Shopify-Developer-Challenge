# Image Repository API Doc

## User API

### Signup
- description: signs user up
- request: `POST /api/users/signup/`
    - content-type: `application/json`
    - body: object
        - password: (string) password of account
        - username: (string) username of account
- response: 409
    - body: `user name already exist`
- response: 500
    - body: `error`
- response: 200
    - body: `user "username" signed up`

### Signin
- description: signs users in 
- request: `POST /api/users/signin/`
    - content-type: `application/json`
    - body: object
        - password: (string) password of account
        - username: (string) username of account
- response: 401
    - body: `access denied`
- response: 500
    - body: `:error`

### Signout
- description: signs user out
- request: `GET /api/users/signout/`
- response: 301

### Read Users
- description: returns all usernames in database
- request: `GET /api/users/`
- response: 200
    - content-type: `application/json`
    - body: object
        - usernames: (array) array of username in database
- response: 500
    - body: `:error`
