# Fall-2021-Shopify-Developer-Challenge

## Table of Contents

- [Overview](#overview)
  - [General Overview](#general-overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
- [Database Design](#db-design)
- [Getting Started / Launching](#getting-started)
- [API Documentation](#api-doc)
- [Unit Testing](#unit-testing)
- [Future Extensions](#extended-functionality)

## Overview
### General Overview
__problem statement__:  Build an image repository

__deployed app__: App is deployed on https://shopify-fall-2021.herokuapp.com/

Due to the nature of heroku's empheral file system every time the app is restarted all the file is deleted. Because of this all previously uploaded file will not be rendered on app restart. To test the full functionality of the app you would have to do everything in a single session. To mitigate this issue future work can be done to migrate local storage solution to amazon s3 cloud storage.

### Features
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

### Technologies Used

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


## Database Design

![alt text](https://github.com/PeterChou1/Fall-2021-Shopify-Developer-Challenge/tree/main/assets/dbdiagram.png "Logo Title Text 1")

## Getting Started / Launching

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


## API Documentation

The backend API is based on a REST Design the full documentation of can found [here](https://github.com/PeterChou1/Fall-2021-Shopify-Developer-Challenge/tree/main/doc)

## Unit Testing 

## Future Extensions

