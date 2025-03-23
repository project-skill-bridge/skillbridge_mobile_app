package com.skillbridge.app.circlobrustGameBeginner.circlobrustMLComponenets

// Imports for Android utilities, image processing, MediaPipe hand tracking, and machine learning components
import android.content.Context // For accessing application context and resources
import android.graphics.Bitmap // For image representation and manipulation
import android.graphics.Matrix // For image transformations (rotation, scaling)
import android.os.SystemClock // For precise timing measurements
import android.util.Log // For logging debugging information
import androidx.camera.core.ImageProxy // For handling camera image frames
import com.google.mediapipe.framework.image.BitmapImageBuilder // Converts Android bitmaps to MediaPipe format
import com.google.mediapipe.framework.image.MPImage // MediaPipe's image representation
import com.google.mediapipe.tasks.core.BaseOptions // Base configuration for ML tasks
import com.google.mediapipe.tasks.core.Delegate // Hardware acceleration options (CPU/GPU)
import com.google.mediapipe.tasks.vision.core.RunningMode // Processing mode (static/video/stream)
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker // The hand detection and tracking model
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult // Detection results container

/* ================ Class Definition Section ================ 
 * Hand identification and tracking helper using MediaPipe
 * Processes camera input to detect and track hand landmarks
 * Provides real-time hand position data to game components
 */
class HandIdentifier (
    val context: Context, // Application context for resource access
    val handLandmarkerHelperListener: LandmarkerListener // Callback interface for detection results
) {
    /* ================ Configuration Section ================ 
     * Parameters for hand detection model and performance settings
     * Controls detection accuracy, tracking stability, and resource usage
     */
    private var handLandmarker: HandLandmarker? = null // The actual hand detection model
    private val runningMode = RunningMode.LIVE_STREAM // Real-time processing mode
    private val delegate = DELEGATE_CPU // Use CPU for processing (vs GPU)
    private val maxNumHands = DEFAULT_NUM_HANDS // Maximum hands to detect (default: 1)
    private val minHandDetectionConfidence = DEFAULT_HAND_DETECTION_CONFIDENCE // Confidence threshold for detection
    private val minHandTrackingConfidence = DEFAULT_HAND_TRACKING_CONFIDENCE // Confidence threshold for tracking
    private val minHandPresenceConfidence = DEFAULT_HAND_PRESENCE_CONFIDENCE // Confidence threshold for hand presence

    /* ================ Initialization Section ================ 
     * Methods for setting up and configuring the hand landmark detector
     * Handles model loading and configuration of detection parameters
     */
    fun setupHandLandmarker() {
        try {
            val baseOptions = BaseOptions.builder() // Create base options for the model
                .setDelegate(if (delegate == DELEGATE_CPU) Delegate.CPU else Delegate.GPU) // Set processing hardware
                .setModelAssetPath(MP_HAND_LANDMARKER_TASK) // Path to model file in assets
                .build() // Finalize options

            val options = HandLandmarker.HandLandmarkerOptions.builder() // Create hand landmarker options
                .setBaseOptions(baseOptions) // Apply base options
                .setMinHandDetectionConfidence(minHandDetectionConfidence) // Set detection threshold
                .setMinTrackingConfidence(minHandTrackingConfidence) // Set tracking threshold
                .setMinHandPresenceConfidence(minHandPresenceConfidence) // Set presence threshold
                .setNumHands(maxNumHands) // Set maximum hands to detect
                .setRunningMode(runningMode) // Set to live stream mode
                .setResultListener(this::returnLivestreamResult) // Set success callback
                .setErrorListener(this::returnLivestreamError) // Set error callback
                .build() // Finalize options

            handLandmarker = HandLandmarker.createFromOptions(context, options) // Create detector with options
        } catch (e: Exception) {
            handLandmarkerHelperListener.onError( // Report initialization error
                "Hand Landmarker failed to initialize: ${e.message}"
            )
            Log.e(TAG, "MP initialization error: ${e.message}") // Log the error
        }
    }

    fun clearHandLandmarker() {
        handLandmarker?.close() // Release model resources
        handLandmarker = null // Clear reference
    }

    fun isClose() = handLandmarker == null // Check if detector is closed/uninitialized

    /* ================ Detection Section ================ 
     * Methods for processing camera input and detecting hands
     * Handles image transformation, orientation correction, and detection triggering
     */
    fun detectLiveStream(imageProxy: ImageProxy, isFrontCamera: Boolean) {
        val bitmapBuffer = Bitmap.createBitmap( // Create bitmap from camera image
            imageProxy.width, // Use image width
            imageProxy.height, // Use image height
            Bitmap.Config.ARGB_8888 // Use full color with alpha
        )
        imageProxy.use { bitmapBuffer.copyPixelsFromBuffer(imageProxy.planes[0].buffer) } // Copy pixel data
        imageProxy.close() // Release image proxy resources

        val matrix = Matrix().apply { // Create transformation matrix
            postRotate(imageProxy.imageInfo.rotationDegrees.toFloat()) // Apply rotation based on camera orientation
            if (isFrontCamera) { // Mirror for front camera
                postScale(-1f, 1f, imageProxy.width.toFloat(), imageProxy.height.toFloat()) // Horizontal flip
    companion object {
        const val TAG = "HandLandmarkerHelper" // Logging tag
        private const val MP_HAND_LANDMARKER_TASK = "hand_landmarker.task" // Model file name
        const val DELEGATE_CPU = 0 // CPU processing constant
        const val DEFAULT_HAND_DETECTION_CONFIDENCE = 0.5F // Default detection threshold
        const val DEFAULT_HAND_TRACKING_CONFIDENCE = 0.5F // Default tracking threshold
        const val DEFAULT_HAND_PRESENCE_CONFIDENCE = 0.5F // Default presence threshold
        const val DEFAULT_NUM_HANDS = 1 // Default number of hands to track
    }

    /* ================ Data Model Section ================ 
     * Classes for representing detection results and callback interfaces
     * Structures data for consumption by game components
     */
    data class ResultBundle( // Container for detection results
        val results: List<HandLandmarkerResult>, // Hand landmark detection results
        val inferenceTime: Long, // Time taken for detection
        val inputImageHeight: Int, // Original image height
        val inputImageWidth: Int, // Original image width
    )

    interface LandmarkerListener { // Callback interface for detection results
        fun onError(error: String) // Called when an error occurs
        fun onResults(resultBundle: ResultBundle) // Called when detection succeeds
    }
}