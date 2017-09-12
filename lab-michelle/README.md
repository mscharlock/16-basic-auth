# Basic Authorization
Hash. Delicious, delicious hash.

![hashbrowns running](https://media.giphy.com/media/DUsMipEoXKaBy/giphy.gif)

We've created a simple API that can verify if a user is who they say they are.

## Getting Started
Download from npm

Install dependencies with npm -i

# Endpoints
**/api/signup**
+ Accepts POST requests
```
POST /api/signup
```

**/api/signin**
+ Accepts GET Requests
```
GET /api/signin
```

# DB Schema
Using mongoose & MongoDB, each user has a:
+ username
+ email
+ password
+ findhash
