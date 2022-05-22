# Share-a-meal-api
### Backend-API for the share-a-meal assignment.

A small and lightweight API made with [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/).
***
## Features

- Create, update, read and delete meals and users
- JWT authentication
- Input validation
- persistence with MySQL

## Development
**This project requires a [MySQL](https://www.mysql.com/) Database to run**

The Repository can be cloned from Github, after that run the following command
```
npm install 
```

This installs the required dependencies for local development.
After that create a **.env** in the root of the project and store the following enviroment variables. 
Further explanation about **.env** files can be found [here](https://www.ibm.com/docs/en/aix/7.2?topic=files-env-file).

> DB_HOST
> DB_PORT
> DB_USER
> DB_DATABASE
> DB_PASSWORD
> SECRET_JWT_KEY
> TEST_TOKEN

This makes sure the server makes use of your local configuration and prevents sensitive data from being published.
***
## Starting the server
```
npm start 
```
This starts the server, a link to open the server in the browser can be found in the command line
