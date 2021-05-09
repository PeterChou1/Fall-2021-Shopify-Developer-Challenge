# Image Repository API Doc

## User API

### Signup

- description: signs up and authenticates user by setting session cookie server side
- request: `POST /api/users/signup/`
  - content-type: `application/json`
  - body: object
    - password: (string) password of account
    - username: (string) username of account
- response: 200
  - body: object
    - userid: (Int) userid assigned by database
    - username: (string) username of account
- response: 409
  - body: object
    - error : `user name already exist`
- response: 500
  - content-type: `application/json`
  - body: object
    - error : (string) server error string

### Signin

- description: authenticates user by setting session cookie server side
- request: `POST /api/users/signin/`
  - content-type: `application/json`
  - body: object
    - password: (string) password of account
    - username: (string) username of account
- response: 200
  - body: object
    - userid: (Int) userid assigned by database
    - username: (string) username of account
- response: 401
  - content-type: `application/json`
  - body: object
    - error : `incorrect password`
- response: 404
  - content-type: `application/json`
  - body: object
    - error : `username not found`
- response: 500
  - content-type: `application/json`
  - body: object
    - error : (string) server error string

### Signout

- description: signs user out by deleting server side session
- request: `GET /api/users/signout/`
- response: 200
  - body: `OK`

### Read Users

- description: returns all username in database based on query parameters
- query parameters:
  - pagelength: (Int) Optional default=5
  - page: (Int) Optional default=0
- request: `GET /api/users/profiles/[?pagelength=5][?page=0]`
- response: 200
  - content-type: `application/json`
  - body: object
    - usernames: (array) array of username in database
- response: 500
  - content-type: `application/json`
  - body: object
    - error : (string) server error string

### Send Friend Request

### Resolve Friend Request

## Repository API

### Notes

A user can create image repository under three permissions

- PUBLIC: Anyone has access to it
- FRIENDS_ONLY: Only friends of this user can have access to it
- PRIVATE: Only the user can have access to it

### Create Repository

- description: create a repository for an authenticated user
- request: `POST /api/repo/`
  - content-type: `application/json`
  - body: object
    - name: (String) name of the repository
    - permissions: (String) `PUBLIC` | `FRIENDS_ONLY` | `PRIVATE`
- response: 200
  - body: `success`
- response: 401
  - body: `access denied`

### Read Repository

- description: returns all repositories owned by a given userid with correct permissions applied based on query parameters
- query parameters:
  - userid: (Int) Required
  - pagelength: (Int) Optional default=5
  - page: (Int) Optional default=0
- request: `GET /api/repo/[?userid=id][?pagelength=5][?page=0]`
  - content-type: `application/json`
- response: 200
  - content-type: `application/json`
  - body: object
    - count: (Int) total number of repository
    - repos: (array of objects)
      - name: (String) string of the repository
      - id: (Int) repo id
- response: 500
  - content-type: `application/json`
  - body: object
    - error : (string) server error string

### Update Repository

- description: change name or permissions of a given repository
- (requesting user must own this repository)
- request: `PATCH /api/repo/`
  - content-type: `application/json`
  - body: object
    - repoid: (Int) repo id to be updated
    - name: (String) new name of the repository
    - permissions: (String) `PUBLIC` | `FRIENDS_ONLY` | `PRIVATE` new permissions
- response: 200
  - body: `success`

### Delete Repository

- description: delete an image repository and all associated images
- (requesting users must own this repository)
- request: `DELETE /api/repo/`
  - content-type: `application/json`
  - body: object
    - repoid: (Int) repo id to be deleted
- response: 200
  - body: `success`
- response: 401
  - body: `access denied`

## Image API

### Create Image

- description: create an image under an image repository
- request: `POST /api/images/`
  - content-type: `multipart/form-data`
- response: 200

### Read Image

- description: get all image id (paginated) under an image repository
- request: `GET /api/images/[?repoid=id][?pagelength=5][?page=0]`
  - content-type: `application/json`
- response: 200
  - content-type: `application/json`

### Read Image Source

- description: retrieve the image with :id file
- request: `GET /api/images/:id`
- response: 200
  - content-type: `file mimetype`
  - body: binary file with :id in database
- response: 401
  - body: `access denied`
- response: 500
  - body: internal server errors
- response 404
  - body: image id :id does not exist

### Update Image

- description: change title or description of an image
- request: `PATCH /api/images/`
  - content-type: `application/json`
  - body: object
    - repoid: (Int) id of repo the image belongs to
    - imageid: (Int) id of image to be updated
- response: 200

### Delete Image

- description: delete a specific images from an image repository
- request: `DELETE /api/images/`
  - content-type: `application/json`
  - body: object
    - repoid: (Int) id of repo the image belongs to
    - imageid: (Int) id of image to be updated
- response: 200
