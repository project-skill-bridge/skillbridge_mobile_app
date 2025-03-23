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
 * Main logic class for Level 4 of the Circlobrust Game
 * Extends BaseLogicClass to implement level-specific mechanics
 * Adds rotation to circles for increased visual complexity and challenge
 */
class Level4LogicClass @JvmOverloads constructor(
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
     * Circle model with advanced properties for sine wave movement and rotation
     * Extends previous levels with rotation parameters for spinning effect
     */
    private data class Circle(
        var x: Float, // Current horizontal position
        var y: Float, // Current vertical position
        val initialX: Float, // Starting X position for sine wave
        val color: Int, // Circle color
        val radius: Float, // Circle size
        val velocity: Float, // Vertical movement speed
        val amplitude: Float, // Controls width of sine wave
        val frequency: Float, // Controls frequency of sine wave
        val phase: Float, // Starting phase of sine wave
        var rotation: Float = 0f, // Current rotation angle in degrees
        val rotationSpeed: Float, // Speed of rotation in degrees per frame
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

    private val MAX_CIRCLES = 4 // Maximum circles on screen at once
    private var lastCircleTime = 0L // Last time a circle was created
    private val CIRCLE_SPAWN_INTERVAL = 3000L // 3 seconds between new circles

    /* ================ Update Mechanism Section ================ 
     * Runnable for continuous game updates
     * Handles animation frame timing and game state progression
     */
    private val updateRunnable = object : Runnable {
        override fun run() {
            updateCircle() // Move and rotate circles
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
            val radius = (30f..80f).randomFloat() // Random size
            val initialX = (radius..(width - radius)).randomFloat() // Initial horizontal position
            val y = height + radius // Start below screen
            val color = colors.random() // Pick random color
            val velocity = (10f..15f).randomFloat() // Vertical movement speed
            
            // Sine wave parameters
            val amplitude = (width / 10f..width / 5f).randomFloat() // Control wave width
            val frequency = (0.005f..0.015f).randomFloat() // Control wave frequency
            val phase = (0f..2f * Math.PI.toFloat()).randomFloat() // Random starting phase
            
            // Rotation parameters
            val rotationSpeed = (-5f..20f).randomFloat() // Negative values rotate counterclockwise
            
            circles.add(Circle( // Create and add new circle
                x = initialX, // Initial x position
                y = y, // Initial y position
                initialX = initialX, // Reference position for sine wave
                color = color, // Circle color
                radius = radius, // Circle size
                velocity = velocity, // Upward speed
                amplitude = amplitude, // Wave width
                frequency = frequency, // Wave frequency
                phase = phase, // Starting position in wave
                rotation = 0f, // Initial rotation angle
                rotationSpeed = rotationSpeed, // Rotation speed
                isPopped = false // Not popped initially
            ))
            invalidate() // Request redraw
        }
    }

}