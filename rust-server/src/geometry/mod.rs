use serde::{Deserialize, Serialize};

// Basic types module
pub mod types {
    use super::*;

    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Point {
        pub x: f64,
        pub y: f64,
    }

    impl Point {
        pub fn new(x: f64, y: f64) -> Self {
            Self { x, y }
        }
        
        pub fn distance(&self, other: &Point) -> f64 {
            let dx = self.x - other.x;
            let dy = self.y - other.y;
            (dx * dx + dy * dy).sqrt()
        }
    }

    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Line {
        pub start: Point,
        pub end: Point,
    }

    impl Line {
        pub fn new(start: Point, end: Point) -> Self {
            Self { start, end }
        }
        
        pub fn length(&self) -> f64 {
            self.start.distance(&self.end)
        }
    }
}

// Modules for algorithms
pub mod convex_hull;
pub mod intersection;
