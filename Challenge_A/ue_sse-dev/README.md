# Price-Drop Webshop - CTF Challenge

This project contains a webshop application designed for a Capture The Flag (CTF) event. It is composed of a Next.js frontend and a Flask backend. The application is intentionally designed with a hidden field manipulation vulnerability.

## The Challenge

The goal of the CTF challenge is to find and exploit a hidden field manipulation vulnerability to obtain a flag. The frontend application may present product prices in hidden fields or in a way that suggests they can be manipulated. The backend is designed to trust some, but not all, of the data sent from the client during the shopping process.

## Running the Project

The easiest way to run the entire application is by using the provided Docker Compose file.

**Prerequisites:**
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Instructions:**

1.  **Start the application:**
    From the root of the project, run the following command:
    ```bash
    docker-compose up --build
    ```

2.  **Access the application:**
    - The frontend will be available at [http://localhost:3000](http://localhost:3000).
    - The backend API will be available at [http://localhost:5000](http://localhost:5000).

To stop the application, press `Ctrl+C` in the terminal where `docker-compose` is running, or run `docker-compose down` from the project root in another terminal.
