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
}