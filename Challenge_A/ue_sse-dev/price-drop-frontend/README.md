# Price-Drop Frontend - CTF Challenge

This project is a small webshop application built with Next.js and React. It serves as the frontend for a Capture The Flag (CTF) challenge. The main objective for participants is to find and exploit a hidden field manipulation vulnerability to obtain a flag.

## The Vulnerability

The frontend application may present product prices in hidden fields or in a way that suggests they can be manipulated. The goal of the CTF challenge is to successfully check out with a total cart value of less than zero, which will reveal the flag.

## Features

- A simple shop page displaying products from a backend API.
- A functional shopping cart.
- A checkout process with form validation.
- A "backdoor" in the browser console for manipulating the cart state (part of the CTF design).

---

## Running the Project

There are two ways to run this project: for local development or as a containerized application using Docker.

### 1. Local Development

This is the recommended approach for actively developing the frontend.

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v24 or later)
- A running instance of the backend server.

**Setup:**

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Backend URL:**
    Create a `.env.local` file in the root of the project and define the URL of your running backend server.
    ```
    # .env.local
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000). The page will auto-update as you edit the files.

---

### 2. Running with Docker

This method allows you to run the frontend as a standalone container. It requires the backend to be accessible from the container (e.g., running on the host machine or in another container on the same Docker network).

**Prerequisites:**
- [Docker](https://www.docker.com/get-started)

**Instructions:**

1.  **Build the Docker Image:**
    From the root of this project directory, run the following command to build the image.
    ```bash
    docker build -t price-drop-frontend .
    ```

2.  **Run the Docker Container:**
    Run the container, passing the backend's URL via the `NEXT_PUBLIC_API_BASE_URL` environment variable. You also need to map a port to access the application.

    *   **If your backend is running on your host machine (e.g., at `localhost:5000`),** you can use `host.docker.internal` to allow the container to connect to it:
        ```bash
        docker run -p 3000:3000 \
          -e NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:5000 \
          price-drop-frontend
        ```
        - `-p 3000:3000`: Maps the container's port 3000 to your local machine's port 3000.
        - `-e CTF_FLAG="..."`: Sets the secret flag that will be revealed upon successful exploitation.

    *   **If your backend is in another Docker container on a shared network,** use the backend container's name as the hostname:
        ```bash
        docker run -p 3000:3000 \
          --network your-shared-network \
          -e NEXT_PUBLIC_API_BASE_URL=http://backend-container-name:5000 \
          price-drop-frontend
        ```

    The application will be available at [http://localhost:3000](http://localhost:3000).
