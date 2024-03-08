# Gamerstag-RBAC

Gamerstag-RBAC is a an API that provides Role-Based Access Control (RBAC) functionalities for managing users in a gaming platform.

## Deployment

The application is deployed on an AWS EC2 instance and can be accessed at [http://3.110.37.45/](http://3.110.37.45/).

## API Documentation

For detailed information about the API endpoints and how to use them, refer to the Postman documentation at [Postman Documentation](https://documenter.getpostman.com/view/30465633/2s9YsKhCnN).

## Features

- **Role-Based Access Control (RBAC):** Manage users with different roles, including SuperAdmin, Branch Manager, and Salesperson.
- **User Creation:** Create users with specified roles based on permissions.
- **User Deletion:** Allow SuperAdmin to delete Branch Managers and Salespersons, and Branch Managers to delete their related Salespersons.
- **User Information:** Retrieve information about logged-in users.


## Technologies Used

- **Backend:** Node.js, Express.js, Sequelize (ORM for MySQL)
- **Database:** MySQL and Amazon RDS for deployment
- **Deployment:** AWS EC2, PM2 for process management, NGINX for reverse proxy

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```env
MAIL_HOST=""
MAIL_USER=""
MAIL_PASS=""

HOST=""
DATABASE=""
USER_NAME=""
PASSWORD=""

JWT_SECRET=""
```

## Local Setup

To run the project locally, follow these steps:

1.  Clone the repository: `git clone <repository-url>`
2.  Install dependencies: `npm install`
3.  Set up the environment variables in a `.env` file.
4.  Run the application: `npm start`

## Contributors

-   Nil Mani

