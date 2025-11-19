# Project: Overwatch Coaching Website

## 1. Project Overview

This is a full-stack web application for an Overwatch coaching service. It's built with modern web technologies and provides a comprehensive platform for both students and the coach. The application allows players to submit their Overwatch replay codes for review, book coaching sessions, and read blog posts from the coach. It also includes a full-featured admin panel for managing the website's content and services.

**Key Features:**

- **Replay Code Submissions:** Players can submit their replay codes for VOD reviews.
- **Custom Appointment System:** A custom-built booking system allows users to book coaching sessions based on the coach's availability.
- **Blog System:** A Markdown-based blog with syntax highlighting.
- **Admin Panel:** A secure admin panel for managing submissions, bookings, and blog posts.
- **Email Notifications:** Automated email notifications are sent using Resend.
- **Dockerized Deployment:** The entire application is containerized for easy deployment and scaling.

**Architecture:**

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js v5
- **Deployment:** Docker

## 2. Building and Running

### Prerequisites

- Node.js 20 LTS
- PostgreSQL 16 (or Docker)
- npm (v9 or higher)

### Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Copy the `.env.example` file to `.env` and fill in the required environment variables.
    ```bash
    cp .env.example .env
    ```

3.  **Run Database Migrations:**
    ```bash
    npm run prisma:migrate:dev
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Production

The application is designed to be deployed with Docker.

1.  **Build the Docker Image:**
    ```bash
    docker-compose build
    ```

2.  **Start the Services:**
    ```bash
    docker-compose up -d
    ```

### Key Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Creates a production build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run prisma:migrate:dev`: Runs database migrations in a development environment.
-   `npm run prisma:studio`: Opens the Prisma Studio to view and manage data.
-   `npm run create-admin`: A script to create a new admin user.
-   `npm run docker:init`: A script to initialize the application in a Docker environment.

## 3. Development Conventions

### Coding Style

-   The project uses **TypeScript** with strict type checking enabled.
-   Code is formatted according to the default Prettier configuration.
-   ESLint is used for linting, with the `next/core-web-vitals` configuration.
-   Path aliases are configured to use `@/*` for imports from the root directory.

### Testing

-   *TODO: Add information about the testing strategy. No testing frameworks are currently configured.*

### Contribution Guidelines

-   *TODO: Add contribution guidelines if this were an open-source project.*
