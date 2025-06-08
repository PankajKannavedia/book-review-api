# Book Review API

A robust Node.js API for managing books and user reviews, built with Express, TypeScript, and Mongoose.

## 🚀 Features

- **User Authentication:** Signup and Login with JWT tokens.
- **Book Management:** Create, retrieve (all, by ID) books.
- **Review Management:** Submit, update, and delete reviews for books.
- **Modular Design:** Clean architecture with dedicated layers for controllers, models, routes, and middleware.
- **Environment Variables:** Secure configuration using `.env` files.
- **Global Error Handling:** Centralized exception handling for consistent API responses.

## 📂 Project Structure

this project follows a modular and well-organized structure, enhancing maintainability and scalability.

```
Book-review-API/
├── .vscode/                   # VS Code specific configuration
├── node_modules/              # Installed project dependencies
├── src/                       # Source code directory
│   ├── config/                # Application configuration and environment variables
│   │   └── index.ts
│   ├── controllers/           # Handles incoming requests, orchestrates logic, and prepares responses
│   │   ├── auth.controller.ts
│   │   ├── book.controller.ts
│   │   └── review.controller.ts
│   ├── databases/             # Database connection setup
│   │   └── index.ts
│   ├── exceptions/            # Custom exception/error classes
│   │   └── HttpException.ts
│   ├── interfaces/            # TypeScript interfaces for data models and other types
│   │   ├── auth.interface.ts
│   │   ├── book.interface.ts
│   │   ├── controller.interface.ts # Base interface for controllers
│   │   ├── review.interface.ts
│   │   ├── routes.interface.ts
│   │   ├── service.interface.ts  # Base interface for services
│   │   └── user.interface.ts
│   ├── middlewares/           # Express middleware functions for request processing
│   │   ├── auth.middleware.ts     # Authentication and authorization logic
│   │   ├── error.middleware.ts    # Global error handling
│   │   └── validation.middleware.ts # Input validation middleware
│   ├── models/                # Mongoose schemas and models for database interaction
│   │   ├── Book.model.ts
│   │   ├── Review.model.ts
│   │   └── users.model.ts
│   ├── routes/                # API route definitions and grouping
│   │   ├── auth.route.ts
│   │   ├── base.route.ts
│   │   ├── book.route.ts
│   │   ├── review.route.ts
│   │   └── users.route.ts
│   ├── services/              # Business logic and data manipulation (service layer)
│   │   ├── auth.service.ts
│   │   ├── base.service.ts
│   │   ├── smtp.service.ts
│   │   └── users.service.ts
│   ├── utils/                 # Utility functions and helpers
│   │   └── util.ts
│   ├── validateEnv.ts         # Environment variable validation (if implemented)
│   ├── app.ts                 # Main Express application setup and configuration
│   └── server.ts              # Application entry point (starts the server)
├── .env                       # Environment variables (sensitive and specific settings)
├── .gitignore                 # Specifies intentionally untracked files to ignore by Git
├── nodemon.json               # Nodemon configuration for development server restarts
├── package-lock.json          # Records the exact dependency tree
├── package.json               # Project metadata and script definitions
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript compiler configuration

```

## 📦 Project Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- MongoDB (local instance or cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd your-api-project
    ```
2.  **Install dependencies:**

    ```bash
    npm install
    ```

## 📦 Project Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (local instance or cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd your-api-project # Navigate into your project directory
    ```
2.  **Install dependencies:**

    ```bash
    npm install
    # OR
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory of your project. You can copy the contents from `.env.example` (you should create this file if it doesn't exist, mirroring the structure below).

    ```
    # .env

    # Application Ports
    PORT=3001
    PORT_HTTP=3000

    # BASE_URL is often derived from PORT_HTTP for local development, or configured for deployment

    BASE_URL=http://localhost

    # Database Connection
    # DB_HOST, DB_PORT, DB_DATABASE are used to construct DB_URI for Mongoose

    DB_HOST=127.0.0.1
    DB_PORT=27017
    DB_DATABASE=book-review


    # User Data (for testing/dummy accounts, keep out of production .env)
    EMAIL="example@gmail.com" # This is a dummy email, please change it
    PASS="zbbwmwaqaafytfio" # This is a dummy password, please change it

    # JWT Token Secret Key
    SECRET_KEY="secretKey" # IMPORTANT: Use a strong, long, and random secret key for production!

    ### CORS (Cross-Origin Resource Sharing) Configuration
    # Comma-separated list of allowed origins. '*' allows all (use with caution in production).
    ORIGIN="http://localhost:4200,*"
    # Set to 'true' if your frontend needs to send cookies or authorization headers across origins.
    CREDENTIALS=true

    ```

## ▶ How to Run Locally

1.  **Start the MongoDB server** (if you are running a local instance of MongoDB).
2.  **Run the application:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000` (or your specified `PORT_HTTP`). You should see console logs indicating a successful database connection and server startup.

## 🗄️ Database Schema Design

This API uses **MongoDB** as its database, with **Mongoose** for object data modeling.

### Collections (Models)

1.  **`users` Collection (User Model)**

    - **Purpose:** Stores user authentication details and basic profile information.
    - **Fields:**
      - `_id`: `ObjectId` (Primary Key, auto-generated by MongoDB)
      - `email`: `String` (Required, Unique, Trimmed)
      - `password`: `String` (Required, Hashed using bcrypt)
      - `role`: `String` (Required, Enum: `['user', 'admin']`, Default: `'user'`)
      - `createdAt`: `Date` (Automatically added by Mongoose `timestamps`)
      - `updatedAt`: `Date` (Automatically added by Mongoose `timestamps`)

2.  **`books` Collection (Book Model)**

    - **Purpose:** Stores information about books.
    - **Fields:**
      - `_id`: `ObjectId` (Primary Key, auto-generated by MongoDB)
      - `title`: `String` (Required, Trimmed)
      - `author`: `String` (Required, Trimmed)
      - `genre`: `String` (Required, Trimmed)
      - `publicationYear`: `Number` (Required, Min: 1000, Max: Current Year)
      - `description`: `String` (Optional, Trimmed)
      - `averageRating`: `Number` (Default: 0, Min: 0, Max: 5. Could be calculated from reviews or manually updated.)
      - `reviewCount`: `Number` (Default: 0, Min: 0. Could be calculated from reviews or manually updated.)
      - `createdAt`: `Date` (Automatically added by Mongoose `timestamps`)
      - `updatedAt`: `Date` (Automatically added by Mongoose `timestamps`)

3.  **`reviews` Collection (Review Model)**
    - **Purpose:** Stores individual user reviews for specific books.
    - **Fields:**
      - `_id`: `ObjectId` (Primary Key, auto-generated by MongoDB)
      - `book`: `ObjectId` (Required, **Reference to `books` Collection**)
      - `user`: `ObjectId` (Required, **Reference to `users` Collection**)
      - `rating`: `Number` (Required, Min: 1, Max: 5)
      - `comment`: `String` (Optional, Trimmed)
      - `createdAt`: `Date` (Automatically added by Mongoose `timestamps`)
      - `updatedAt`: `Date` (Automatically added by Mongoose `timestamps`)
    - **Indexes:**
      - **Compound Unique Index on `(book, user)`**: This ensures that a single user can only submit one review per book, preventing duplicate reviews.

### Relationships

- **One-to-Many (Users to Reviews):** One user can write many reviews. (Represented by `user` field in `reviews` referencing `users`).
- **One-to-Many (Books to Reviews):** One book can have many reviews. (Represented by `book` field in `reviews` referencing `books`).
