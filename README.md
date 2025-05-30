# Computational Geometry Visualizer

A minimal computational geometry application with a Rust backend API and JavaScript frontend visualization.

## Project Structure

- `rust-server/`: Rust backend with computational geometry algorithms
- `web-client/`: JavaScript frontend for visualization

## Getting Started

### Backend Setup

1. Make sure you have Rust and Cargo installed. If not, install from [rustup.rs](https://rustup.rs/).

2. Navigate to the server directory:
   ```
   cd rust-server
   ```

3. Build and run the server:
   ```
   cargo run
   ```

The server will start on `http://localhost:8080`.

### Frontend Setup

1. Open a new terminal window/tab

2. Navigate to the web client directory:
   ```
   cd web-client
   ```

3. You can serve the frontend using any simple HTTP server. For example, with Python:
   ```
   python -m http.server 3000
   ```
   
   Or with Node.js's `http-server` (requires installation via npm):
   ```
   npx http-server -p 3000
   ```

4. Open your browser and go to `http://localhost:3000`

## Features

- **Convex Hull**: Add points to the canvas and compute their convex hull
- **Line Intersection**: Create two lines and find their intersection point

## Implementation Details

### Backend
- Built with Rust and Axum for minimal dependencies
- RESTful API endpoints for computational geometry operations
- JSON serialization with serde

### Frontend
- Vanilla JavaScript with HTML5 Canvas for visualization
- No frameworks or unnecessary dependencies
- Responsive design that works on various screen sizes

## Adding New Algorithms

To add new computational geometry algorithms:

1. Create a new Rust module in `rust-server/src/geometry/`
2. Add corresponding API endpoint in `routes.rs`
3. Update the frontend UI to include the new algorithm

## License

MIT
