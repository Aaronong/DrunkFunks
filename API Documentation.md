# API and Schema Documentation

[TOC]

This API documentation will define all the APIs that Alfred requires to operate smoothly. Alfred is a fairly small and simple project with only 3 database models, 8 API calls, and 7 views. 

## Models

In this section, I will define the models used in Alfred. The models in this document will be defined in sequelize for ease of migration into the codebase. 

###### <u>User</u>

```javascript
const User = sequelize.define('user', {
  //The important part
  user_id: { 
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: { 
    type: Sequelize.STRING, 
    allowNull: false 
  },
  
  //The no so important part
  contact_number: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: { min: 0, max: 99999999999}
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
});
```

This looks really long and complicated, but schema validation actually makes dealing with the Getters and Setters easier since you are dealing with validation on the DB side. 

###### <u>Group</u>

```javascript
const Group = sequelize.define('group', {
  group_id: { type: Sequelize.INTEGER, primaryKey: true },
  name: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false}
});
```

I don't think there's any need to explain this. We will store the hashed password.

###### <u>Membership</u>

Membership connects a single user to a single group.

```javascript
Group.belongsToMany(User, {through: 'Membership'});
User.belongsToMany(Group, {through: 'Membership'});
```

This will create a new model called Membership with the equivalent foreign keys, `group_id` and `user_id`. 



## API Overview

In this section, I will define the APIs used in Alfred, their URLs, and their structure. The required APIs are as follows:

###### <u>User</u>

- Create User Profile (POST)
- Read User Profile (GET)
- Update User Profile (POST)

###### <u>Group</u>

- Create Group (POST)
- Read Group (GET)
- Backend will handle deleting of groups when everyone in the group has left

###### <u>Membership</u>

-  Create Membership (POST) - User Join Group
- Read Membership (GET) - Read User Groups
- Delete Membership (POST) - Use Leave Group 



## APIs

#### User

###### <u>Create User Profile</u>

- POST \user\create

```json
{
  "user_id": 1102329453453,
  "name": "Aaron Ong",
  "access_token": "FB ACCESS TOKEN"
}
```



###### <u>Read User Profile</u>

- GET \user\\{user-id}

```json
{
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
  "name": "Aaron Ong",
  "contact_number": 90688260,
  "address": "27 Hazel Park Terrace \n #06-02 \n Singapore 509228",
  "latitude": 53.2312312,
  "longtitude": -7.33232323
}
```



###### <u>Update User Profile</u>

- POST \user\\{user-id}
- Limit updates to contact number and address changes

```json
//Change contact number
{
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
  "contact_number": 90688260
}
//Change address
{
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
  "address": "27 Hazel Park Terrace \n #06-02 \n Singapore 509228"
}
//Update Location
{
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
  "latitude": 53.2312312,
  "longtitude": -7.33232323
}
```



#### Group

###### <u>Create Group</u>

- POST \group\create

```json
{
  "name": "Gin Gang",
  "password": "hashed : GroupPW"
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
}
```



###### <u>Read Group Information</u>

- GET \group\\{group-id}

```json
{
  "group_id": 123,
  "group_name": "Gin Gang",
  "user_id": 1102329453453,
  "access_token": "FB ACCESS TOKEN",
  "participants": [
    {
      "name": "Aaron Ong",
      "contact_number": 90688260,
      "address": "27 Hazel Park Terrace \n #06-02 \n Singapore 509228",
      "latitude": 53.2312312,
      "longtitude": -7.33232323
    },
    {
      "name": "Sam See",
      "contact_number": 91788571,
      "address": "Address Placeholder",
      "latitude": 53.2312312,
      "longtitude": -7.33232323
    },
    {
      "name": "Kush Goyal",
      "contact_number": 84220258,
      "address": "Address Placeholder",
      "latitude": 53.2312312,
      "longtitude": -7.33232323
    },
  ]
}
```



#### Membership

###### <u>Create Membership</u>

- POST \membership\create

```json
{
  "group": {
    "group_id": 123,
  	"password": "hashed : GroupPW"
  },
  "user": {
    "user_id": 1102329453453,
    "access_token": "FB ACCESS TOKEN",
  }
}
```



###### <u>Read Membership</u>

- GET \membership

```javascript
[
  {
    "group_id": 123,
    "group_name": "Gin Gang"
  },
  {
    "group_id": 137,
    "group_name": "Whisky Wonderers"
  }
]
```



###### <u>Delete Membership</u>

- POST \membership\delete

```json
{
  "group": {
    "group_id": 123,
  	"password": "hashed : GroupPW"
  },
  "user": {
    "user_id": 1102329453453,
    "access_token": "FB ACCESS TOKEN",
  }
}
```

