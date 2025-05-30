/**
 * Renderer for computational geometry visualizations
 */

export class GeometryRenderer {
    /**
     * Initialize the geometry renderer
     * @param {HTMLCanvasElement} canvas - Canvas element to render on
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.points = [];
        this.lines = [];
        this.hull = [];
        this.intersection = null;
        this.clear();
    }
    
    /**
     * Clear the canvas and reset all drawn elements
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.points = [];
        this.lines = [];
        this.hull = [];
        this.intersection = null;
        this.render();
    }
    
    /**
     * Add a new point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    addPoint(x, y) {
        this.points.push({ x, y });
        this.render();
        return this.points.length - 1;
    }
    
    /**
     * Remove the last added point
     * @returns {boolean} - True if a point was removed, false if no points exist
     */
    removeLastPoint() {
        if (this.points.length === 0) return false;
        
        this.points.pop();
        this.render();
        return true;
    }
    
    /**
     * Add a line connecting two points
     * @param {number} startIdx - Index of start point
     * @param {number} endIdx - Index of end point
     */
    addLine(startIdx, endIdx) {
        if (startIdx < 0 || startIdx >= this.points.length || 
            endIdx < 0 || endIdx >= this.points.length) {
            return false;
        }
        
        this.lines.push({
            start: this.points[startIdx],
            end: this.points[endIdx]
        });
        
        this.render();
        return true;
    }
    
    /**
     * Set the convex hull points
     * @param {Array<{x: number, y: number}>} hullPoints - Array of points forming the hull
     */
    setConvexHull(hullPoints) {
        this.hull = hullPoints;
        this.render();
    }
    
    /**
     * Set an intersection point
     * @param {{x: number, y: number}} point - The intersection point
     */
    setIntersection(point) {
        this.intersection = point;
        this.render();
    }
    
    /**
     * Get all points
     * @returns {Array<{x: number, y: number}>} - Array of points
     */
    getPoints() {
        return [...this.points];
    }
    
    /**
     * Get all lines
     * @returns {Array<{start: {x: number, y: number}, end: {x: number, y: number}}>} - Array of lines
     */
    getLines() {
        return [...this.lines];
    }
    
    /**
     * Render all geometry elements to the canvas
     */
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw grid for reference
        this._drawGrid();
        
        // Draw lines
        this._drawLines();
        
        // Draw convex hull if exists
        if (this.hull.length > 0) {
            this._drawConvexHull();
        }
        
        // Draw intersection if exists
        if (this.intersection) {
            this._drawIntersection();
        }
        
        // Draw points (on top of everything else)
        this._drawPoints();
    }
    
    /**
     * Draw background grid
     * @private
     */
    _drawGrid() {
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw all points
     * @private
     */
    _drawPoints() {
        this.ctx.fillStyle = '#3498db';
        
        this.points.forEach((point, index) => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw point index
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(index + 1, point.x + 10, point.y - 10);
            this.ctx.fillStyle = '#3498db';
        });
    }
    
    /**
     * Draw all lines
     * @private
     */
    _drawLines() {
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        
        this.lines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.moveTo(line.start.x, line.start.y);
            this.ctx.lineTo(line.end.x, line.end.y);
            this.ctx.stroke();
        });
    }
    
    /**
     * Draw the convex hull
     * @private
     */
    _drawConvexHull() {
        if (this.hull.length < 3) return;
        
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.hull[0].x, this.hull[0].y);
        
        for (let i = 1; i < this.hull.length; i++) {
            this.ctx.lineTo(this.hull[i].x, this.hull[i].y);
        }
        
        // Close the hull
        this.ctx.lineTo(this.hull[0].x, this.hull[0].y);
        this.ctx.stroke();
    }
    
    /**
     * Draw the intersection point
     * @private
     */
    _drawIntersection() {
        this.ctx.fillStyle = '#e74c3c';
        
        this.ctx.beginPath();
        this.ctx.arc(this.intersection.x, this.intersection.y, 7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw "X" label
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('X', this.intersection.x, this.intersection.y);
    }
}

// No need for global instance in module pattern
// Each module that imports GeometryRenderer will create its own instance