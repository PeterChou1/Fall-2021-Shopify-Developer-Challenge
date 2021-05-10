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


### Signout
- description: signs user out by deleting server side session
- request: `GET /api/users/signout/`
- response: 200
  - body: `OK`

### Delete User
- description: deletes an authenticated users account
- request: `DELETE /api/users/delete/`
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
    - usernames: (array) array of users in database

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
- response: 400
  - body: `permission not valid`

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
      - createdAt: (String) creation date
      - updateAt: (String) last modified date
      - ownedBy: (Int) owner id
      - id: (Int) repo id
    - username: (String) Username that owns this repository
- response: 400
  - body: `userid not specified` 

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
- response: 400 
  - body: `repo id not specified` | `permission not valid` | `invalid repository name` | `user (id :userid) does not own repo (id :repoid)`

### Delete Repository

- description: delete an image repository and all associated images
- (requesting users must own this repository)
- request: `DELETE /api/repo/`
  - content-type: `application/json`
  - body: object
    - repoid: (Int) repo id to be deleted
- response: 200
  - body: `success`
- response: 400
  - body: `repo id not specified` | `user (id :userid) does not own repo (id :repoid)`


### Get Repository Thumbnail

- description: get a random image in the repository if no image is in the repository return a placeholder image
- request: `GET /api/repo/:id`
- response: 200
  - content-type: `file mimetype`
  - body: binary file with :id in database
- response: 400
  - body: `repo id not specified` | `repo id:(:id) does not exist` | `invalid permission`


## Image API

### Create Image
- description: create an image under an image repository
- request: `POST /api/images/`
  - content-type: `multipart/form-data`
- response: 200
  - body: `success`

### Read Image
- description: return all paginated response under an repoid based on query parameters
- query parameters:
  - repoid: (Int) Required
  - pagelength: (Int) Optional default=5
  - page: (Int) Optional default=0
- request: `GET /api/images/[?repoid=id][?pagelength=5][?page=0]`
  - content-type: `application/json`
- response: 200
  - content-type: `application/json`
- response: 400
  - body: `repo id not specified` | `repo id:(:id) does not exist` | `invalid permission`


### Read Image Source

- description: retrieve the image with :id file
- request: `GET /api/images/:id`
- response: 200
  - content-type: `file mimetype`
  - body: binary file with :id in database
- response: 400
  - body: `access denied` | `image id :id does not exist`  | `invalid permission`

### Update Image

- description: change title or description of an image
- request: `PATCH /api/images/`
  - content-type: `application/json`
  - body: object
    - imageid: (Int) id of image to be updated
    - description: (String) newly updated description
    - title: (String) newly updated title
- response: 200
  - body: `success`
- response: 400
  - body: `image id not specified` | `image id :id does not exist`  | `requesting client does not own image id:(:imageid)`

### Delete Image

- description: delete a specific images from an image repository
- request: `DELETE /api/images/`
  - content-type: `application/json`
  - body: object
    - imageid: (Int) id of image to be deleted
- response: 200
  - body: `success`
- response: 400
  - body: `image id not specified` | `image id :id does not exist`  | `requesting client does not own image id:(:imageid)`
