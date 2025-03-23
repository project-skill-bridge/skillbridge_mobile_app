package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics

// Imports for Android UI components, graphics, hand tracking, and game utilities
import android.content.Context // For accessing application resources
import android.graphics.Canvas // For drawing game elements
import android.graphics.Color // For color definitions
import android.graphics.Paint // For configuring drawing styles
import android.util.AttributeSet // For XML attribute handling
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker // For hand tracking connections
import com.skillbridge.app.circlobrustGameBeginner.circlobrustAbstractClasses.BaseLogicClass // Parent class
import com.skillbridge.app.circlobrustGameBeginner.circlobrustExtensions.randomFloat // Random number utility

/* ================ Class Definition Section ================ 
 * Main logic class for Level 2 of the Circlobrust Game
 * Extends BaseLogicClass to implement level-specific mechanics
 * Handles circle generation, movement, collision detection with increased complexity
 */
class Level2LogicClass @JvmOverloads constructor(
    context: Context?, // Android context for accessing resources
    attrs: AttributeSet? = null // Optional XML attributes
) : BaseLogicClass (context, attrs) {

    /* ================ Interface Section ================ 
     * Defines callback for circle popping events
     * Allows activity to respond to player scoring
     */
    interface OnCirclePoppedListener {
        fun onCirclePopped() // Called when player pops a circle
    }

    var circlePoppedListener: OnCirclePoppedListener? = null // Listener for score updates

    /* ================ Data Model Section ================ 
     * Circle model with enhanced properties for Level 2
     * Adds horizontal velocity and movement direction parameters
     */
    private data class Circle(
        var x: Float, // Horizontal position on screen
        var y: Float, // Vertical position on screen
        val color: Int, // Circle color
        val radius: Float, // Circle size
        val velocity: Float, // Vertical movement speed
        val horizontalVelocity: Float, // Horizontal velocity component
        val isMovingUp: Boolean, // Direction flag
        var isPopped: Boolean = false // Whether circle has been popped
    )

    /* ================ Properties Section ================ 
     * Game state variables, rendering tools, and configuration values
     */
    private val circles = mutableListOf<Circle>() // Collection of active game circles
    private val circlePaint = Paint().apply { // Paint configuration for circles
        style = Paint.Style.FILL // Fill the circles
        isAntiAlias = true // Enable smooth edges
    }

    private val MAX_CIRCLES = 4 // Maximum circles on screen at once
    private var lastCircleTime = 0L // Last time a circle was created
    private val CIRCLE_SPAWN_INTERVAL = 1500L // 1.5 seconds between circles

    /* ================ Update Mechanism Section ================ 
     * Runnable for continuous game updates
     * Controls animation timing and game state progression
     */
    private val updateRunnable = object : Runnable {
        override fun run() {
            updateCircle() // Move circles
            checkCollisions() // Check for finger-circle interactions
            customHandler.postDelayed(this, 32) // ~30 fps animation rate
        }
    }

    /* ================ Initialization Section ================ 
     * Methods for setting up the game environment
     * Handles view size changes and initial circle creation
     */
    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh) // Call parent method
        initializeCircle() // Reset circle collection on size change
    }

    private fun initializeCircle() {
        circles.clear() // Remove all existing circles
        lastCircleTime = System.currentTimeMillis() // Reset spawn timer
        addNewCircleIfNeeded() // Add initial circle
    }

    private fun addNewCircleIfNeeded() {
        // Only add if we have less than maximum circles
        if (circles.count { !it.isPopped } < MAX_CIRCLES) {
            val colors = listOf(Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.CYAN, Color.MAGENTA) // Available colors
            val radius = (35f..80f).randomFloat() // Random size (slightly larger than Level 1)
            val x = (radius..(width - radius)).randomFloat() // Random horizontal position
            val color = colors.random() // Pick random color
            val velocity = (15f..23f).randomFloat() // Faster vertical speed than Level 1
            val horizontalVelocity = (-3f..3f).randomFloat() // Random horizontal movement
            
            // Randomly choose whether circle comes from top or bottom (50% chance each)
            val isMovingUp = Math.random() < 0.5 // Determine movement direction
            
            // Set Y position based on direction
            val y = if (isMovingUp) {
                // For upward-moving circles, start below the screen
                (height + radius..(height * 2).toFloat()).randomFloat() // Start below screen
            } else {
                // For downward-moving circles, start above the screen
                (-radius * 2..0f).randomFloat() // Start above screen
            }
            
            circles.add(Circle(x, y, color, radius, velocity, horizontalVelocity, isMovingUp)) // Create new circle
            invalidate() // Request redraw
        }
    }

    /* ================ Game Logic Section ================ 
     * Core mechanics for circle movement and spawning
     * Handles both vertical and horizontal movement with boundary physics
     */
    private fun updateCircle() {
        // Check if it's time to spawn a new circle
        val currentTime = System.currentTimeMillis() // Get current time
        if (currentTime - lastCircleTime >= CIRCLE_SPAWN_INTERVAL) { // Check if interval passed
            addNewCircleIfNeeded() // Create new circle if needed
            lastCircleTime = currentTime // Reset timer
        }
        
        // Update existing circles
        circles.forEach { circle ->
            // Vertical movement based on direction
            if (circle.isMovingUp) {
                circle.y -= circle.velocity // Move up
            } else {
                circle.y += circle.velocity // Move down
            }
            
            // Horizontal movement (same for both directions)
            circle.x += circle.horizontalVelocity // Apply horizontal movement
            
            // Handle horizontal boundaries - bounce off walls
            if (circle.x - circle.radius <= 0 || circle.x + circle.radius >= width) { // Hit left or right edge
                // Create a new circle with reversed horizontal direction
                val newHorizontalVelocity = -circle.horizontalVelocity // Reverse direction
                val newX = if (circle.x - circle.radius <= 0) {
                    circle.radius // Keep inside left boundary
                } else {
                    width - circle.radius // Keep inside right boundary
                }
                
                // Replace the circle with updated properties
                val index = circles.indexOf(circle) // Find circle index
                if (index >= 0) {
                    circles[index] = circle.copy(x = newX, horizontalVelocity = newHorizontalVelocity) // Update with new properties
                }
            }
}