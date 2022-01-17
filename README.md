# simpleSprint
###### A simple scrum board to make sprint planning and standups more efficient

Built with with the MERN Stack. This app consists of a RESTful API backend, which serves the frontend. 

Backend was built using Node.js, particularly express.js for the server. In addition the app uses a mongoDB database, and mongoose to query it. 

The Frontend/UX is built with ReactJS and redux. 

## Backend API Endpoint Documentation

###### Entry point (server.js)
The backend begins with a server.js file where the server is instantiated using express(). 
This file handles the api routes and which port to run the server on. 

###### /api/auth

**get('/')**
Responds with the current user. This endpoint uses a custom auth middleware I built, which adds the currently logged into a given request. The middleware take the x-auth-token from the request header (jwt which should be coming from the front end), and decodes for the user id. It then gets the user from db, and passes it on to the next part of the request. Using this middleware makes any routes protected, as it will block any requests with an invalid auth token. 

This endpoint is used by the app to check if the user is logged in, and to add user data into the app state.


**post('/')**

