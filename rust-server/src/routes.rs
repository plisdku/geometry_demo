use axum::{
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};

use crate::geometry::{
    convex_hull::compute_convex_hull,
    intersection::compute_line_intersection,
    types::{Point, Line},
};

// Handler for the convex hull API endpoint
pub async fn convex_hull(
    Json(payload): Json<ConvexHullRequest>,
) -> impl IntoResponse {
    let hull = compute_convex_hull(&payload.points);
    
    (StatusCode::OK, Json(ConvexHullResponse { hull }))
}

// Handler for the line intersection API endpoint
pub async fn intersection(
    Json(payload): Json<IntersectionRequest>,
) -> impl IntoResponse {
    let intersection = compute_line_intersection(&payload.line1, &payload.line2);
    
    (StatusCode::OK, Json(IntersectionResponse { point: intersection }))
}

// Request and response types for our API
#[derive(Deserialize)]
pub struct ConvexHullRequest {
    pub points: Vec<Point>,
}

#[derive(Serialize)]
pub struct ConvexHullResponse {
    pub hull: Vec<Point>,
}

#[derive(Deserialize)]
pub struct IntersectionRequest {
    pub line1: Line,
    pub line2: Line,
}

#[derive(Serialize)]
pub struct IntersectionResponse {
    pub point: Option<Point>,
}
