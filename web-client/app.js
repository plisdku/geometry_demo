import { GeometryRenderer } from './renderer.js';
import * as api from './api-client.js';

/**
 * Main application for the Computational Geometry Visualizer
 */


document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const canvas = document.getElementById('geometry-canvas');
    const clearBtn = document.getElementById('clear-btn');
    const undoBtn = document.getElementById('undo-btn');
    const algorithmSelect = document.getElementById('algorithm-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const statusMessage = document.getElementById('status-message');
    const modeInstructions = document.getElementById('mode-instructions');
    
    // Initialize renderer
    /**
     * @type {GeometryRenderer}
     */
    const renderer = new GeometryRenderer(canvas);
    
    // Current app state
    let currentAlgorithm = 'convex-hull';
    let lineStartPointIndex = -1;
    let lineCount = 0;
    
    // Add event listeners
    clearBtn.addEventListener('click', clearCanvas);
    undoBtn.addEventListener('click', undoLastAction);
    algorithmSelect.addEventListener('change', changeAlgorithm);
    calculateBtn.addEventListener('click', calculateResult);
    canvas.addEventListener('click', handleCanvasClick);
    
    // Update initial UI state
    updateInstructionsDisplay();
    
    /**
     * Clear the canvas and reset state
     */
    function clearCanvas() {
        renderer.clear();
        lineStartPointIndex = -1;
        lineCount = 0;
        updateStatus('Canvas cleared');
    }
    
    /**
     * Undo the last action (remove last point or line)
     */
    function undoLastAction() {
        if (renderer.removeLastPoint()) {
            if (currentAlgorithm === 'intersection' && lineStartPointIndex >= 0) {
                lineStartPointIndex = -1;
            }
            updateStatus('Last point removed');
        } else {
            updateStatus('Nothing to undo');
        }
    }
    
    /**
     * Change the current algorithm
     */
    function changeAlgorithm() {
        currentAlgorithm = algorithmSelect.value;
        clearCanvas();
        updateInstructionsDisplay();
        updateStatus(`Switched to ${algorithmSelect.options[algorithmSelect.selectedIndex].text} mode`);
    }
    
    /**
     * Handle canvas click events
     * @param {MouseEvent} event - Click event
     */
    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (currentAlgorithm === 'convex-hull') {
            // Simply add points for convex hull
            const idx = renderer.addPoint(x, y);
            updateStatus(`Added point ${idx + 1} (${Math.round(x)}, ${Math.round(y)})`);
        } 
        else if (currentAlgorithm === 'intersection') {
            // Handle line creation for intersection
            const idx = renderer.addPoint(x, y);
            
            if (lineStartPointIndex === -1) {
                lineStartPointIndex = idx;
                updateStatus(`Added first point of line ${lineCount + 1}`);
            } else {
                // Create a line between the two points
                renderer.addLine(lineStartPointIndex, idx);
                lineStartPointIndex = -1;
                lineCount++;
                
                updateStatus(`Added line ${lineCount}`);
                
                // Reset after two lines
                if (lineCount === 2) {
                    updateStatus('Two lines created. Click Calculate to find intersection.');
                }
            }
        }
    }
    
    /**
     * Calculate results based on current algorithm
     */
    async function calculateResult() {
        try {
            if (currentAlgorithm === 'convex-hull') {
                await calculateConvexHull();
            } else if (currentAlgorithm === 'intersection') {
                await calculateIntersection();
            }
        } catch (error) {
            updateStatus(`Error: ${error.message}`);
        }
    }
    
    /**
     * Calculate convex hull
     */
    async function calculateConvexHull() {
        const points = renderer.getPoints();
        
        if (points.length < 3) {
            updateStatus('Need at least 3 points to calculate a convex hull');
            return;
        }
        
        updateStatus('Calculating convex hull...');
        
        try {
            const result = await api.computeConvexHull(points);
            renderer.setConvexHull(result.hull);
            updateStatus(`Convex hull calculated with ${result.hull.length} points`);
        } catch (error) {
            updateStatus('Failed to calculate convex hull');
            console.error(error);
        }
    }
    
    /**
     * Calculate line intersection
     */
    async function calculateIntersection() {
        const lines = renderer.getLines();
        
        if (lines.length !== 2) {
            updateStatus('Need exactly 2 lines to calculate intersection');
            return;
        }
        
        updateStatus('Calculating intersection...');
        
        try {
            const result = await api.computeIntersection(lines[0], lines[1]);
            
            if (result.point) {
                renderer.setIntersection(result.point);
                updateStatus(`Intersection found at (${Math.round(result.point.x)}, ${Math.round(result.point.y)})`);
            } else {
                updateStatus('Lines do not intersect');
            }
        } catch (error) {
            updateStatus('Failed to calculate intersection');
            console.error(error);
        }
    }
    
    /**
     * Update status message
     * @param {string} message - Status message
     */
    function updateStatus(message) {
        statusMessage.textContent = message;
    }
    
    /**
     * Update instructions based on current algorithm
     */
    function updateInstructionsDisplay() {
        if (currentAlgorithm === 'convex-hull') {
            modeInstructions.innerHTML = `
                <p><strong>Convex Hull Mode:</strong> Click on the canvas to add points. Then click "Calculate" to compute the convex hull.</p>
            `;
        } else if (currentAlgorithm === 'intersection') {
            modeInstructions.innerHTML = `
                <p><strong>Line Intersection Mode:</strong> Click to add two points for the first line, then two more for the second line. Click "Calculate" to find the intersection.</p>
            `;
        }
    }
});
