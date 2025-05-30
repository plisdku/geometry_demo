use crate::geometry::types::{Point, Line};

// Compute the intersection point of two lines, if one exists
pub fn compute_line_intersection(line1: &Line, line2: &Line) -> Option<Point> {
    let p1 = &line1.start;
    let p2 = &line1.end;
    let p3 = &line2.start;
    let p4 = &line2.end;
    
    // Line AB represented as a1x + b1y = c1
    let a1 = p2.y - p1.y;
    let b1 = p1.x - p2.x;
    let c1 = a1 * p1.x + b1 * p1.y;
    
    // Line CD represented as a2x + b2y = c2
    let a2 = p4.y - p3.y;
    let b2 = p3.x - p4.x;
    let c2 = a2 * p3.x + b2 * p3.y;
    
    let determinant = a1 * b2 - a2 * b1;
    
    if determinant.abs() < 1e-9 {
        // The lines are parallel or coincident
        return None;
    }
    
    // Calculate the intersection point
    let x = (b2 * c1 - b1 * c2) / determinant;
    let y = (a1 * c2 - a2 * c1) / determinant;
    
    // Check if the intersection point is on both line segments
    if is_point_on_segment(&Point::new(x, y), p1, p2) &&
       is_point_on_segment(&Point::new(x, y), p3, p4) {
        Some(Point::new(x, y))
    } else {
        None
    }
}

// Check if a point is on a line segment
fn is_point_on_segment(point: &Point, segment_start: &Point, segment_end: &Point) -> bool {
    // Calculate distances
    let d_point_to_start = point.distance(segment_start);
    let d_point_to_end = point.distance(segment_end);
    let d_segment = segment_start.distance(segment_end);
    
    // Check if point is on segment (allowing for floating point errors)
    (d_point_to_start + d_point_to_end - d_segment).abs() < 1e-9
}
