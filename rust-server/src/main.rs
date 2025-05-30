use axum::{
    routing::{get, post},
    http::{StatusCode, HeaderValue},
    Json, Router,
    extract::DefaultBodyLimit,
    response::IntoResponse,
};
use tower_http::cors::{CorsLayer, Any};
use std::net::SocketAddr;

mod geometry;
mod routes;

use routes::*;

#[tokio::main]
async fn main() {
    // Initialize our application router
    let app = Router::new()
        // API routes
        .route("/", get(root))
        .route("/api/convex-hull", post(convex_hull))
        .route("/api/intersection", post(intersection))
        // Set a reasonable body size limit
        .layer(DefaultBodyLimit::max(1024 * 1024))
        // Set up CORS for the frontend
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Run the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Computational Geometry API Server"
}
