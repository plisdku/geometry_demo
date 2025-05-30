/**
 * API Client for the Computational Geometry Server
 */

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Sends a request to the server to compute the convex hull of a set of points
 * @param {Array<{x: number, y: number}>} points - Array of points
 * @returns {Promise<{hull: Array<{x: number, y: number}>}>} - Convex hull result
 */
async function computeConvexHull(points) {
    try {
        const response = await fetch(`${API_BASE_URL}/convex-hull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to compute convex hull:', error);
        throw error;
    }
}

/**
 * Sends a request to calculate the intersection of two lines
 * @param {{start: {x: number, y: number}, end: {x: number, y: number}}} line1 - First line
 * @param {{start: {x: number, y: number}, end: {x: number, y: number}}} line2 - Second line
 * @returns {Promise<{point: {x: number, y: number} | null}>} - Intersection point or null if no intersection
 */
async function computeIntersection(line1, line2) {
    try {
        const response = await fetch(`${API_BASE_URL}/intersection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ line1, line2 }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to compute intersection:', error);
        throw error;
    }
}

// Export API functions
export {
    computeConvexHull,
    computeIntersection,
};
