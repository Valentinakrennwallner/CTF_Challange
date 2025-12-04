# Price-Drop Backend - CTF Challenge

This project is a Flask-based backend for a small webshop application. It serves as the server-side component for a Capture The Flag (CTF) challenge. The API provides endpoints for products, a shopping cart, and a checkout process.

The application is intentionally designed with a specific vulnerability related to how it processes data from the client.

## The Vulnerability

The goal of the CTF challenge is to successfully check out with a total cart value of less than zero, which will reveal the flag. The backend is designed to trust some, but not all, of the data sent from the client during the shopping process, creating an opportunity for exploitation.

## Features

- Serves a list of products from a `products.csv` file.
- Hosts product images from the `/data/images` directory.
- Provides a basic API to create a cart, update its contents, and check out.
- Includes admin endpoints for CTF organizers to monitor and reset the application state.
- Offers interactive Swagger/OpenAPI documentation when running in development mode.

---

## Getting Started

You can run the application locally for development or as a container using Docker.

### Prerequisites

- Python 3.9+
- Docker (for containerized deployment)

### Development Setup

Running the application locally is recommended for development and testing. This setup enables live reloading and provides access to the interactive API documentation.

1.  **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate
    # On Windows, use: venv\Scripts\activate
    ```

2.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

3.  **Set required environment variables:**
    ```sh
    export FLASK_ENV=development
    export CTF_FLAG="this_is_a_dev_flag"
    ```

4.  **Run the Flask development server:**
    ```sh
    flask run --port 5000
    # Alternatively, you can run the script directly:
    # python app.py
    ```

The API will be available at `http://localhost:5000`.

### Docker Setup

This is the recommended way to run the application for the CTF event. The `Dockerfile` sets `FLASK_ENV` to `production`, which disables the interactive API docs.

1.  **Build the Docker image:**
    ```bash
    docker build -t price-drop-backend .
    ```

2.  **Run the Docker container:**
    Run the container, passing the CTF flag value via the `CTF_FLAG` environment variable. You also need to map a port to access the application. You can optionally bind mount the data directory to provide custom products.
    ```bash
    docker run --name price-drop-backend \
      -p 5000:5000 \
      -v "$(pwd)/data:/app/data" \
      -e CTF_FLAG="this_is_the_real_ctf_flag" \
      price-drop-backend
    ```
    - `-p 5000:5000`: Maps the container's port 5000 to your local machine's port 5000.
    - `-v "$(pwd)/data:/app/data"`: Mounts the local `data` directory into the container. This allows you to modify products and images on the fly.
    - `-e CTF_FLAG="..."`: Sets the secret flag that will be revealed upon successful exploitation.

---

## API Documentation

When running in **development mode**, interactive API documentation is available via Swagger UI at:

- **`http://localhost:5000/apidocs`**

This UI allows you to inspect all available endpoints, their parameters, and their response schemas. It is disabled in the production Docker environment.

## Admin Endpoints

A few special endpoints are available for CTF organizers:

- `GET /api/admin/carts`: Lists all shopping carts currently in memory.
- `GET /api/admin/flag-captures`: Shows how many times the flag has been successfully captured.
- `POST /api/admin/reload`: Reloads the `products.csv` file from disk.
- `POST /api/admin/reset`: Clears all shopping carts and resets the flag capture count.
