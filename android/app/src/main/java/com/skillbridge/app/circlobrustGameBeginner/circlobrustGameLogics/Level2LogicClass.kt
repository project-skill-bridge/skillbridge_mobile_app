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
}