# Fall-2021-Shopify-Developer-Challenge

## Table of Contents

- [Overview](#overview)
  - [General Overview](#general)
  - [Features](#features)
  - [Technologies Used](#technologies)
- [Database Design](#database)
- [Getting Started](#start)
- [API Documentation](#api)
- [Unit Testing](#testing)
- [Future Extensions](#future)

## <a name="overview"></a> Overview 
### <a name="general"></a>  General Overview
__problem statement__:  Build an image repository

Fullstack App built using Nodejs and react.
Features full CRUD operations on images and repository with permissions. Authentication and Authorization is manage through through bcrypt and express sessions.

__deployed app__: App is deployed on https://shopify-fall-2021.herokuapp.com/

Due to the nature of heroku's empheral file system every time the app is restarted all the file is deleted. Because of this all previously uploaded file will not be rendered on app restart. To test the full functionality of the app you would have to do everything in a single session. To mitigate this issue future work can be done to migrate local storage solution to amazon s3 cloud storage.



### <a name="features"></a> Features
- users can sign up and create an account to store their images
- users can delete their entire account along with all their images
- users can create image repositories
- users can access other users image repository to view
- users can edit permissions/names of image repositories
  - __supported permission__: PRIVATE, PUBLIC, FRIENDS ONLY
  - PUBLIC: everyone can view the repository
  - FRIENDS ONLY: only the user and friends can view repository (Note: the friends is only partially implemented and will not be testable)
  - PRIVATE: only the user himself can see the images in the repository
- users can delete their own repository 
- users can upload images in image repositories
- users can edit title/descriptions of images in other people image repository
- users can delete their own images within image repository

### <a name="technologies"></a> Technologies Used

Testing 
 - mocha
 - chai

Backend
 - Nodejs
 - PostgresSQL
 - Prisma ORM
 - express

Frontend
 - react
 - material-ui


## <a name="database"></a> Database Design
<img src="assets/dbdiagram.png"/>


### Relations
- a user can have 1 - n repos
- a repo can have 1 - n pictures 
- a user can have 1 - n FriendRequest 
- a friend request has 1 send User and 1 recieve User


Notes: a person is consider a friend if the accept is set to true within Friend Request line


## <a name="start"></a> Getting Started / Launching

To test the app locally first run 

`npm install`

next run [postgres](https://www.postgresql.org/) locally or through a cloud service and create an .env file with the following parameters

DATABASE_URL=postgresql://username:password@localhost:5432/mydb
APP_SECRET=yourappsecret

to generate your prisma client and database schema

`npx prisma generate`
`npx prisma db push --preview-feature`

finally to run your app run

`npm run start`

app is now avaliable on `http://localhost:3000`


## <a name="api"></a> API Documentation

The backend API is based on a REST Design the full documentation of can found [here](https://github.com/PeterChou1/Fall-2021-Shopify-Developer-Challenge/tree/main/doc)

## <a name="testing"></a> Unit Testing 

## <a name="future"></a> Project Structure + Future Extensions

This project was written with extensibility in mind. To achieve the code is organized in the following manner shown below. Notably all database logic is separate from the core API routing logic improving modularity and reusability of code.
```
├── assets                       (static server side assets)
├── client                                     (client side)
├── doc                                  (API documentation)
├── middleware        (express utility middleware directory)
├── model                                   (database logic)
├── node_modules
├── package-lock.json
├── package.json
├── prisma                                 (database schema)
├── Procfile
├── README.md
├── routes                                 (API route logic)
├── server.js
├── shortcuts.txt
├── test                     (mocha and chai test directory)
└── uploads                (uploaded image stored by multer)
```

future extensions for the project could the implementation of Friend Request which due to time constraints is only partially implemented. Other possibility include implementing a search functionality through Solr and Commenting and Upvoting images.


