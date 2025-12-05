# BetterReads API 📖

BetterReads is a robust backend API for a book review platform, designed to function similarly to Goodreads. It provides a comprehensive set of features for managing users, books, and reviews, with a secure authentication system. Built with Node.js, Express, and Prisma, it's a scalable and efficient foundation for any book-centric application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## Features

-   👤 **User Authentication:** Secure sign-up, log-in, and log-out functionality using JSON Web Tokens (JWT).
-   📚 **Book Management:** Operations to add, update, delete, and retrieve books from the database.
-   ✍️ **Review System:** Users can add, update, and delete their reviews for any book.
-   **User Profile:** Fetch a user's profile along with all the reviews they have written.
-   🔒 **Protected Routes:** Middleware to protect sensitive routes, ensuring only authenticated users can perform certain actions.

---

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **ORM:** Prisma ORM
-   **Database:** PostgreSQL
-   **Authentication:** JSON Web Tokens (JWT)
-   **Password Hashing:** bcrypt.js
-   **Validation:** (Optional, e.g., `express-validator` or `zod`)

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
-   [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [PostgreSQL](https://www.postgresql.org/download/)
-   [Git](https://git-scm.com/downloads)

---

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/bookverse.git](https://github.com/your-username/bookverse.git)
    ```

2.  **Navigate into the directory:**
    ```bash
    cd bookverse
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up the environment variables:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # PostgreSQL connection URL from your database provider
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="postgresql://postgres:password@localhost:5432/bookverse"

    # Secret key for signing JWTs (use a long, random string)
    JWT_SECRET="YOUR_SUPER_SECRET_KEY"

    # Port for the server to run on
    PORT=3000
    ```

5.  **Set up the database:**
    Push the Prisma schema to your PostgreSQL database. This will create the necessary tables.
    ```bash
    npx prisma db push
    ```

6.  **Generate the Prisma Client:**
    Generate the Prisma Client based on your schema.
    ```bash
    npx prisma generate
    ```

7.  **Start the server:**
    ```bash
    npm start
    ```
    The API should now be running at `http://localhost:3000`.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user. | `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }` |
| `POST` | `/auth/login` | Log in an existing user. | `{ "email": "user@example.com", "password": "password123" }` |

### Books

*Authentication required for `POST` methods.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/books` | Get a list of all books. |
| `GET` | `/books/:id` | Get a single book by its ID. |
| `POST` | `/books` | Add a new book. |
| `POST` | `/books/:id` | Delete a book. |

### Reviews

*Authentication required for all review endpoints.*

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/books/:bookId/reviews` | Get all reviews for a specific book. | |
| `POST`| `/books/:bookId/reviews` | Add a new review for a book. | `{ "rating": 5, "comment": "Amazing read!" }` |
| `GET` | `/reviews/:id` | Get a single review by its ID. | |
| `PUT` | `/reviews/:id` | Update a user's own review. | `{ "rating": 4, "comment": "Still great on second read." }` |
| `DELETE`| `/reviews/:id` | Delete a user's own review. | |

### Users

*Authentication required.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users/me` | Get the profile of the currently logged-in user. |

---

## Authentication

To access protected routes, you must include the JWT in the `Authorization` header of your request.

**Format:** `Bearer <token>`

**Example:**
`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

The token is provided in the response body upon successful user `signup` or `login`.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/new-feature`).
3.  Commit your changes (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/new-feature`).
5.  Create a new Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
