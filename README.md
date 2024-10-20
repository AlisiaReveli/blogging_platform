# Blogging Platform

## Getting Started
Prerequisites
Before you begin, ensure you have met the following requirements:
1. Clone repo  `` https://github.com/AlisiaReveli/blogging_platform.git  ``
2. Create a .env file in the root directory, like the example below

```plaintext
JWTKEY=your_jwt_key
TOKEN_EXPIRATION=1d
BEARER=Bearer
PORT=3000
MONGO_URI_DEVELOPMENT='mongodb://localhost:27017/my_local_db'
MONGO_URI_TEST='mongodb://localhost:27017/my_local_db'
MONGO_URL='mongodb://mongo:27017/production_db'
NODE_ENV=DEVELOPMENT
````


3. Run ``npm install``



### Starting the Project
4. ````nest start````


### Accessing Documentation
Once the project is running, you can access the API documentation at:

````
http://localhost:3000/api/documentation
````


