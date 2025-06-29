# Ghostery Application

This project is a ghostery application built with React, TypeScript, Tailwind CSS for the frontend, and Node.js with tRPC for the backend. The application is containerized using Docker and orchestrated with Docker Compose.

## Project Structure

```
ghostery-app
├── frontend          # Frontend application
│   ├── src          # Source files for the frontend
│   ├── package.json  # Frontend dependencies and scripts
│   ├── tsconfig.json # TypeScript configuration for frontend
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vite.config.ts # Vite configuration for building
│   └── Dockerfile    # Dockerfile for frontend
├── backend           # Backend application
│   ├── src          # Source files for the backend
│   ├── package.json  # Backend dependencies and scripts
│   ├── tsconfig.json # TypeScript configuration for backend
│   └── Dockerfile    # Dockerfile for backend
├── docker-compose.yml # Docker Compose configuration
├── build.sh         # Script to build and run the application
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/microsoft/vscode-remote-try-node.git
   cd ghostery-app
   ```

2. Build and run the application using the provided script:

   ```
   ./build.sh
   ```

### Usage

- The frontend application will be available at `http://localhost:3000`.
- The backend API will be available at `http://localhost:4000`.

### Development

- To develop the frontend, navigate to the `frontend` directory and run:

  ```
  npm install
  npm run dev
  ```

- To develop the backend, navigate to the `backend` directory and run:

  ```
  npm install
  npm run dev
  ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for details.