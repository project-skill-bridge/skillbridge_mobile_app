package com.skillbridge.application.circlobrustGameBeginner.circlobrustAbstractClasses

// Imports for Android UI components, graphics, MediaPipe hand tracking, and utility functions
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Handler
import android.os.Looper
import android.util.AttributeSet
import android.view.View
import androidx.core.content.ContextCompat
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import kotlin.math.max
import kotlin.math.min
import com.skillbridge.application.R

/* ================ Class Definition Section ================ 
 * Abstract base class for all game logic views
 * Provides common functionality for hand tracking visualization and game rendering
 * Creates foundation for level-specific implementation details
 */
abstract class BaseLogicClass @JvmOverloads constructor(
    context: Context?, // Android context for resource access
    attrs: AttributeSet? = null // XML attributes for view customization
) : View(context, attrs) {

    /* ================ Properties Section ================ 
     * Shared variables for hand tracking results and display scaling
     * Maintains state information used across all game levels
     */
    protected var results: HandLandmarkerResult? = null // Stores hand detection results
    protected var scaleFactor: Float = 1f // Controls coordinate scaling for display
    protected var imageWidth: Int = 1 // Width of processed camera image
    protected var imageHeight: Int = 1 // Height of processed camera image

    /* ================ Paint Configuration Section ================ 
     * Drawing tools for rendering hand landmarks and connections
     * Defines visual appearance of hand tracking visualization
     */
    protected val linePaint = Paint().apply {
        color = ContextCompat.getColor(context!!, R.color.colorHandLines) // Color for hand connection lines
        strokeWidth = LANDMARK_STROKE_WIDTH // Line thickness
        style = Paint.Style.STROKE // Outline-only drawing style
    }

    protected val pointPaint = Paint().apply {
        color = ContextCompat.getColor(context!!, R.color.colorPopPointer) // Color for hand landmark points
        strokeWidth = LANDMARK_STROKE_WIDTH // Point size
        style = Paint.Style.FILL // Filled drawing style
    }

    /* ================ Threading Section ================ 
     * Handler for managing UI updates on the main thread
     * Ensures smooth animation and proper thread synchronization
     */
    protected val customHandler = Handler(Looper.getMainLooper()) // Creates handler on main UI thread

    /* ================ View Management Section ================ 
     * Methods for resetting and initializing the view state
     * Handles clearing previous results and preparing for new data
     */
    fun clear() {
        results = null // Clear detection results
        linePaint.reset() // Reset paint configurations
        pointPaint.reset() 
        invalidate() // Request redraw of view
        initPaints() // Reinitialize paint objects
    }

    protected open fun initPaints() {
        // Initialize paints if needed - can be overridden by subclasses
    }

    /* ================ Results Processing Section ================ 
     * Methods for handling hand landmark detection results
     * Processes raw detection data for use in gameplay mechanics
     * Calculates proper scaling for different display modes
     */
    fun setResults(
        handLandmarkerResults: HandLandmarkerResult, // New hand detection results
        imageHeight: Int, // Height of analyzed frame
        imageWidth: Int, // Width of analyzed frame
        runningMode: RunningMode = RunningMode.IMAGE // Detection mode (default: image)
    ) {
        results = handLandmarkerResults // Store new results
        this.imageHeight = imageHeight // Update image dimensions
        this.imageWidth = imageWidth

        scaleFactor = when (runningMode) {
            RunningMode.IMAGE,
            RunningMode.VIDEO -> {
                min(width * 1f / imageWidth, height * 1f / imageHeight) // Fit scaling for images/videos
            }
            RunningMode.LIVE_STREAM -> {
                max(width * 1f / imageWidth, height * 1f / imageHeight) // Fill scaling for live camera
            }
        }
        invalidate() // Request redraw with new results
    }

    /* ================ Constants Section ================ 
     * Shared values used across all logic classes
     * Defines standard dimensions and visual parameters
     */
    companion object {
        protected const val LANDMARK_STROKE_WIDTH = 4F // Standard width for all hand landmark lines
    }
}