use crate::geometry::types::Point;
use std::cmp::Ordering;

// Compute the convex hull of a set of points using the Graham scan algorithm
pub fn compute_convex_hull(points: &[Point]) -> Vec<Point> {
    if points.len() < 3 {
        return points.to_vec();
    }

    // Find the point with the lowest y-coordinate (and leftmost if tied)
    let mut points = points.to_vec();
    let lowest_point_idx = find_lowest_point(&points);
    
    // Swap the lowest point to index 0
    points.swap(0, lowest_point_idx);
    let pivot = points[0].clone();
    
    // Sort the remaining points by polar angle with respect to the lowest point
    points[1..].sort_by(|a, b| {
        let orientation = calculate_orientation(&pivot, a, b);
        if orientation == 0 {
            // If collinear, choose the closer point
            if distance_squared(&pivot, a) < distance_squared(&pivot, b) {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        } else if orientation > 0 {
            Ordering::Less
        } else {
            Ordering::Greater
        }
    });
    
    // Build the convex hull
    let mut hull = Vec::new();
    hull.push(points[0].clone());
    hull.push(points[1].clone());
    
    for i in 2..points.len() {
        while hull.len() >= 2 {
            let n = hull.len();
            let orientation = calculate_orientation(
                &hull[n - 2], 
                &hull[n - 1], 
                &points[i]
            );
            
            if orientation <= 0 {
                hull.pop();
            } else {
                break;
            }
        }
        
        hull.push(points[i].clone());
    }
    
    hull
}

// Find the point with the lowest y-coordinate (and leftmost if tied)
fn find_lowest_point(points: &[Point]) -> usize {
    let mut lowest_idx = 0;
    for i in 1..points.len() {
        if points[i].y < points[lowest_idx].y || 
           (points[i].y == points[lowest_idx].y && points[i].x < points[lowest_idx].x) {
            lowest_idx = i;
        }
    }
    lowest_idx
}

// Calculate the orientation of three points (p, q, r)
// Returns:
//  0 if collinear
//  1 if clockwise
// -1 if counterclockwise
fn calculate_orientation(p: &Point, q: &Point, r: &Point) -> i32 {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if val == 0.0 { 0 } else if val > 0.0 { 1 } else { -1 }
}

// Calculate squared distance between two points
fn distance_squared(p1: &Point, p2: &Point) -> f64 {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    dx * dx + dy * dy
}
