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
## Database structure
The Project contains the file **share-a-meal.sql**, this can be used to configure the database, after this is done and the database works the project is ready to be run.

## Starting the server
```
npm start 
```

For developing, this command is recommended
```
npm run dev 
```
this restarts the server every time a file is saved.
***
## Testing
```
npm test
```
This runs the tests made with [Mocha](https://www.npmjs.com/package/mocha) and [Chai](https://www.npmjs.com/package/chai).
