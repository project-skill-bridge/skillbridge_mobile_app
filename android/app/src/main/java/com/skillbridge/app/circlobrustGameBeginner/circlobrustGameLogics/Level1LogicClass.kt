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
 * Main logic class for Level 1 of the Circlobrust Game
 * Extends BaseLogicClass to implement level-specific mechanics
 * Handles circle generation, movement, and collision detection
 */
class Level1LogicClass @JvmOverloads constructor(
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
     * Circle model defining properties of each game object
     * Tracks position, appearance, movement, and state
     */
    private data class Circle(
        var x: Float, // Horizontal position on screen
        var y: Float, // Vertical position on screen
        val color: Int, // Circle color
        val radius: Float, // Circle size
        val velocity: Float, // Movement speed
        val isMovingUp: Boolean, // Direction flag (up/down)
        var isPopped: Boolean = false // Whether circle has been popped
    )

    /* ================ Properties Section ================ 
     * Game state variables and UI elements
     * Manages collections of game objects and their visual representation
     */
    private val circles = mutableListOf<Circle>() // Collection of active game circles
    private val circlePaint = Paint().apply { // Paint configuration for circles
        style = Paint.Style.FILL // Fill the circles
        isAntiAlias = true // Enable smooth edges
    }

    /* ================ Game Constants Section ================ 
     * Configuration values for game mechanics
     * Controls game difficulty and behavior
     */
    private val MAX_CIRCLES = 4 // Maximum circles on screen at once
    private var lastCircleTime = 0L // Last time a circle was created
    private val CIRCLE_SPAWN_INTERVAL = 1500L // 1.5 seconds between new circles

    /* ================ Update Mechanism Section ================ 
     * Runnable for continuous game updates
     * Handles animation frame timing and game state progression
     */
    private val updateRunnable = object : Runnable {
        override fun run() {
            updateCircle() // Move circles
            checkCollisions() // Check for finger-circle intersections
            customHandler.postDelayed(this, 32) // ~30 fps animation rate
        }
    }

    /* ================ Initialization Section ================ 
     * Methods for setting up the game environment
     * Handles view size changes and initial game state
     */
    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh) // Handle parent class behavior
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
            val radius = (30f..80f).randomFloat() // Random size
            val velocity = (2f..5f).randomFloat() // Random speed
            val x = (radius..(width - radius)).randomFloat() // Random horizontal position
            
            // Randomly choose whether balloon comes from top or bottom (50% chance each)
            val isMovingUp = Math.random() < 0.5 // Determine movement direction
            
            // Set Y position based on direction
            val y = if (isMovingUp) {
                // For upward-moving balloons, start below the screen
                (height + radius..(height * 2).toFloat()).randomFloat() // Start below screen
            } else {
                // For downward-moving balloons, start above the screen
                (-radius * 2..0f).randomFloat() // Start above screen
            }
            
            val color = colors.random() // Pick random color
            circles.add(Circle(x, y, color, radius, velocity, isMovingUp)) // Create new circle
            invalidate() // Request redraw
        }
    }

    /* ================ Game Logic Section ================ 
     * Core game mechanics for circle movement and spawning
     * Controls the flow and timing of game elements
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
            // Move up or down based on the direction flag
            if (circle.isMovingUp) {
                circle.y -= circle.velocity // Move upward
            } else {
                circle.y += circle.velocity // Move downward
            }
            
            // Check if balloon moved off screen
            if ((circle.isMovingUp && circle.y + circle.radius < 0) || // Off top
                (!circle.isMovingUp && circle.y - circle.radius > height)) { // Off bottom
                
                // Reset position based on direction
                if (circle.isMovingUp) {
                    circle.y = height + circle.radius // Reset to bottom
                } else {
                    circle.y = -circle.radius // Reset to top
                }
                
                // Randomize X position when resetting
                circle.x = (0f + circle.radius..width - circle.radius).randomFloat() // New horizontal position
            }
        }
        invalidate() // Request redraw with updated positions
    }

    /* ================ Collision Detection Section ================ 
     * Handles interaction between player's finger and game objects
     * Triggers scoring events when collisions are detected
     */
    private fun checkCollisions() {
        results?.let { handResults ->
            handResults.landmarks().forEach { hand ->
                val indexFingerTip = hand.get(8) // Get index fingertip landmark
                val landmarkX = indexFingerTip.x() * imageWidth * scaleFactor // Convert to screen coordinates
                val landmarkY = indexFingerTip.y() * imageHeight * scaleFactor // Convert to screen coordinates

                circles.forEach { circle ->
                    if (!circle.isPopped) { // Only check active circles
                        val dx = landmarkX - circle.x // Horizontal distance
                        val dy = landmarkY - circle.y // Vertical distance
                        val distanceSquared = dx * dx + dy * dy // Square of distance (faster than sqrt)
                        val detectionThreshold = circle.radius * 0.8f // Detection zone slightly smaller than visual size
                        if (distanceSquared < detectionThreshold * detectionThreshold) { // Fingertip inside circle
                            circle.isPopped = true // Mark as popped
                            circlePoppedListener?.onCirclePopped() // Trigger score update
                        }
                    }
                }
            }
        }
        circles.removeAll { it.isPopped } // Remove all popped circles
    }

    /* ================ Drawing Section ================ 
     * Rendering methods for game elements and hand tracking
     * Controls the visual presentation of the game state
     */
    override fun draw(canvas: Canvas) {
        super.draw(canvas) // Draw base class content (background)

        results?.let { handLandmarkerResult ->
            for (landmark in handLandmarkerResult.landmarks()) { // For each detected hand
                for ((index, normalizedLandmark) in landmark.withIndex()) {
                    val x = normalizedLandmark.x() * imageWidth * scaleFactor // Convert to screen coordinates
                    val y = normalizedLandmark.y() * imageHeight * scaleFactor // Convert to screen coordinates
                    canvas.drawPoint(x, y, pointPaint) // Draw all hand landmarks

                    if (index == 8) { // Index fingertip (landmark 8)
                        canvas.drawCircle(x, y, 30f, pointPaint) // Highlight fingertip with larger circle
                    }
                }

                HandLandmarker.HAND_CONNECTIONS.forEach { // Draw lines between landmarks
                    canvas.drawLine(
                        landmark[it.start()].x() * imageWidth * scaleFactor, // Start X
                        landmark[it.start()].y() * imageHeight * scaleFactor, // Start Y
                        landmark[it.end()].x() * imageWidth * scaleFactor, // End X
                        landmark[it.end()].y() * imageHeight * scaleFactor, // End Y
                        linePaint // Use configured line paint
                    )
                }
            }
        }
        drawCircle(canvas) // Draw the game circles
    }

    private fun drawCircle(canvas: Canvas) {
        circles.forEach { circle ->
            if (!circle.isPopped) { // Only draw active circles
                circlePaint.color = circle.color // Set current circle color
                canvas.drawCircle(circle.x, circle.y, circle.radius, circlePaint) // Draw the circle
            }
        }
    }

    /* ================ Lifecycle Section ================ 
     * Methods for managing component lifecycle
     * Handles resource allocation and cleanup
     */
    override fun onAttachedToWindow() {
        super.onAttachedToWindow() // Call parent method
        customHandler.post(updateRunnable) // Start game update loop
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow() // Call parent method
        customHandler.removeCallbacks(updateRunnable) // Stop game update loop
    }
}