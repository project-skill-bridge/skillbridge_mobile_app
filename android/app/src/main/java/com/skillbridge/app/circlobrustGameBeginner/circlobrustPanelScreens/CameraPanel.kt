package com.skillbridge.app.circlobrustGameBeginner.circlobrustPanelScreens

// Imports for Android UI components, camera functionality, hand tracking, and game level implementations
import com.skillbridge.app.R // Resource references
import android.annotation.SuppressLint // Annotation to suppress lint warnings
import android.content.res.Configuration // For handling device orientation changes
import android.media.MediaPlayer // For sound playback
import android.os.Bundle // For passing data between components
import android.util.Log // For debugging output
import android.view.LayoutInflater // For inflating layouts
import android.view.View // Base view class
import android.view.ViewGroup // Container for views
import android.widget.Toast // For user notifications
import androidx.camera.core.AspectRatio // For camera preview ratio
import androidx.camera.core.Camera // Camera hardware interface
import androidx.camera.core.CameraSelector // For camera selection (front/back)
import androidx.camera.core.ImageAnalysis // For processing camera frames
import androidx.camera.core.ImageProxy // For handling camera images
import androidx.camera.core.Preview // For camera preview display
import androidx.camera.lifecycle.ProcessCameraProvider // Lifecycle-aware camera provider
import androidx.core.content.ContextCompat // For context-related utilities
import androidx.fragment.app.Fragment // Base fragment class
import com.google.mediapipe.tasks.vision.core.RunningMode // ML model execution mode
import com.skillbridge.app.circlobrustGameBeginner.circlobrustMLComponenets.HandIdentifier // Hand tracking helper
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics.Level1LogicClass // Level 1 game logic
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics.Level2LogicClass // Level 2 game logic
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics.Level3LogicClass // Level 3 game logic
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics.Level4LogicClass // Level 4 game logic
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics.Level5LogicClass // Level 5 game logic
import com.skillbridge.app.databinding.PanelCameraBinding // View binding for camera panel
import java.util.concurrent.ExecutorService // For background tasks
import java.util.concurrent.Executors // For creating executors
import java.util.concurrent.TimeUnit // For time unit conversions
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities.Level1ActivityClass // Level 1 activity
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities.Level2ActivityClass // Level 2 activity
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities.Level3ActivityClass // Level 3 activity
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities.Level4ActivityClass // Level 4 activity
import com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities.Level5ActivityClass // Level 5 activity

/* ================ Fragment Definition Section ================ 
 * Primary camera fragment used across all game levels
 * Handles camera preview, hand tracking, and game overlay management
 * Communicates between ML processing and game logic components
 */
class CameraPanel : Fragment(), HandIdentifier.LandmarkerListener {

    /* ================ Properties Section ================ 
     * Member variables for camera management, media playback, view binding
     * Tracks game state and manages resources
     */
    private var popSound: MediaPlayer? = null // Sound effect for popping circles
    private var _binding: PanelCameraBinding? = null // View binding reference (nullable for lifecycle)
    private val binding get() = _binding!! // Non-null accessor for view binding
    private var activitySource: String? = null // Identifier for which level called this fragment
    private lateinit var handLandmarkerHelper: HandIdentifier // ML model helper for hand tracking
    private lateinit var backgroundExecutor: ExecutorService // Background thread for image processing

    private var preview: Preview? = null // Camera preview component
    private var imageAnalyzer: ImageAnalysis? = null // Camera image analyzer
    private var camera: Camera? = null // Camera hardware reference
    private var cameraProvider: ProcessCameraProvider? = null // Camera lifecycle provider
    private var cameraFacing = CameraSelector.LENS_FACING_FRONT // Default to front camera

    /* ================ Constants Section ================ 
     * Static values and configuration parameters
     * Provides identifiers for level tracking and logging
     */
    companion object {
        private const val TAG = "Hand Landmarker" // Log tag for debugging
        private const val ARG_ACTIVITY_SOURCE = "activity_source" // Bundle argument key
         const val ACTIVITY1 = "Activity1" // Level 1 identifier
         const val ACTIVITY2 = "Activity2" // Level 2 identifier
         const val ACTIVITY3 = "Activity3" // Level 3 identifier
         const val ACTIVITY4 = "Activity4" // Level 4 identifier
         const val ACTIVITY5 = "Activity5" // Level 5 identifier


        fun newInstance(activitySource: String): CameraPanel {
            return CameraPanel().apply { // Create new instance with arguments
                arguments = Bundle().apply { // Create and attach bundle
                    putString(ARG_ACTIVITY_SOURCE, activitySource) // Store source activity
                }
            }
        }
    }

    /* ================ Lifecycle Section ================ 
     * Fragment lifecycle methods for creation, resumption, and destruction
     * Handles initialization, permissions, and resource management
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        activitySource = arguments?.getString(ARG_ACTIVITY_SOURCE) // Get activity source from arguments
    }

    override fun onResume() {
        super.onResume() // Call parent implementation
        if (!PermissionsPanel.hasPermissions(requireContext())) { // Check if permissions are granted
            requireActivity().finish() // Close activity if permissions not granted
        }
        backgroundExecutor.execute { // Run on background thread
            if (handLandmarkerHelper.isClose()) { // Check if model is closed/uninitialized
                handLandmarkerHelper.setupHandLandmarker() // Initialize hand tracking
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, // Layout inflater service
        container: ViewGroup?, // Parent container
        savedInstanceState: Bundle? // Saved instance state
    ): View {
        _binding = PanelCameraBinding.inflate(inflater, container, false) // Inflate layout
        return binding.root // Return root view
    }

    @SuppressLint("MissingPermission") // Suppress permission warning (permissions checked elsewhere)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState) // Call parent implementation
        setupCameraComponents() // Set up camera
        initializeOverlays() // Set up game overlays
    }

    /* ================ Camera Setup Section ================ 
     * Methods for configuring and initializing camera components
     * Handles camera binding and preview surface management
     */
    private fun setupCameraComponents() {
        backgroundExecutor = Executors.newSingleThreadExecutor() // Create background thread
        binding.viewFinder.post { setUpCamera() } // Set up camera when view is ready

        backgroundExecutor.execute { // Run on background thread
            handLandmarkerHelper = HandIdentifier( // Initialize hand tracking helper
                context = requireContext(), // Provide context
                handLandmarkerHelperListener = this // Set callback to this fragment
            )
        }
    }

    private fun setUpCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext()) // Get camera provider
        cameraProviderFuture.addListener({ // Add listener for when provider is ready
            cameraProvider = cameraProviderFuture.get() // Get camera provider
            bindCameraUseCases() // Bind camera use cases
        }, ContextCompat.getMainExecutor(requireContext())) // Run on main thread
    }

    @SuppressLint("UnsafeOptInUsageError") // Suppress warning for experimental API
    private fun bindCameraUseCases() {
        val cameraProvider = cameraProvider ?: return // Get provider or exit
        val cameraSelector = CameraSelector.Builder().requireLensFacing(cameraFacing).build() // Configure camera

        preview = Preview.Builder() // Build preview use case
            .setTargetAspectRatio(AspectRatio.RATIO_4_3) // Set aspect ratio
            .setTargetRotation(binding.viewFinder.display.rotation) // Set rotation
            .build() // Create preview

        imageAnalyzer = ImageAnalysis.Builder() // Build image analysis use case
            .setTargetAspectRatio(AspectRatio.RATIO_4_3) // Set aspect ratio
            .setTargetRotation(binding.viewFinder.display.rotation) // Set rotation
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST) // Only process latest frame
            .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888) // Use RGBA format
            .build() // Create analyzer
            .also { // Configure analyzer
                it.setAnalyzer(backgroundExecutor) { image -> detectHand(image) } // Set up frame analysis
            }

        try {
            cameraProvider.unbindAll() // Unbind previous use cases
            camera = cameraProvider.bindToLifecycle( // Bind new use cases
                this, cameraSelector, preview, imageAnalyzer // Bind to fragment lifecycle
            )
            preview?.setSurfaceProvider(binding.viewFinder.surfaceProvider) // Set surface for preview
        } catch (exc: Exception) {
            Log.e(TAG, "Use case binding failed", exc) // Log binding errors
        }
    }

    /* ================ Game Overlay Section ================ 
     * Methods for setting up and managing game-specific overlays
     * Configures level-specific graphics and connects popping events to scoring
     */
    private fun initializeOverlays() {
        val popSound = MediaPlayer.create(requireContext(), R.raw.pop_sound) // Create pop sound player
        when (activitySource) {
            ACTIVITY1 -> { // Level 1 setup
                binding.Level1Graphics.visibility = View.VISIBLE // Show Level 1 overlay
                binding.Level2Graphics.visibility = View.GONE // Hide Level 2 overlay
                binding.Level3Graphics.visibility = View.GONE // Hide Level 3 overlay
                binding.Level4Graphics.visibility = View.GONE // Hide Level 4 overlay
                binding.Level5Graphics.visibility = View.GONE // Hide Level 5 overlay
                binding.Level1Graphics.circlePoppedListener = object : Level1LogicClass.OnCirclePoppedListener {
                    override fun onCirclePopped() { // When circle is popped
                        popSound.start() // Play sound
                        (activity as? Level1ActivityClass)?.incrementScore() // Increment score in activity
                    }
                }
            }
            ACTIVITY2 -> { // Level 2 setup
                binding.Level1Graphics.visibility = View.GONE // Hide Level 1 overlay
                binding.Level2Graphics.visibility = View.VISIBLE // Show Level 2 overlay
                binding.Level3Graphics.visibility = View.GONE // Hide Level 3 overlay
                binding.Level4Graphics.visibility = View.GONE // Hide Level 4 overlay
                binding.Level5Graphics.visibility = View.GONE // Hide Level 5 overlay
                binding.Level2Graphics.circlePoppedListener = object : Level2LogicClass.OnCirclePoppedListener {
                    override fun onCirclePopped() { // When circle is popped
                        popSound.start() // Play sound
                        (activity as? Level2ActivityClass)?.incrementScore() // Increment score in activity
                    }
                }
            }
            ACTIVITY3 -> { // Level 3 setup
                binding.Level1Graphics.visibility = View.GONE // Hide Level 1 overlay
                binding.Level2Graphics.visibility = View.GONE // Hide Level 2 overlay
                binding.Level3Graphics.visibility = View.VISIBLE // Show Level 3 overlay
                binding.Level4Graphics.visibility = View.GONE // Hide Level 4 overlay
                binding.Level5Graphics.visibility = View.GONE // Hide Level 5 overlay
                binding.Level3Graphics.circlePoppedListener = object : Level3LogicClass.OnCirclePoppedListener {
                    override fun onCirclePopped() { // When circle is popped
                        popSound.start() // Play sound
                        (activity as? Level3ActivityClass)?.incrementScore() // Increment score in activity
                    }
                }
            }
            ACTIVITY4 -> { // Level 4 setup
                binding.Level1Graphics.visibility = View.GONE // Hide Level 1 overlay
                binding.Level2Graphics.visibility = View.GONE // Hide Level 2 overlay
                binding.Level3Graphics.visibility = View.GONE // Hide Level 3 overlay
                binding.Level4Graphics.visibility = View.VISIBLE // Show Level 4 overlay
                binding.Level5Graphics.visibility = View.GONE // Hide Level 5 overlay
                binding.Level4Graphics.circlePoppedListener = object : Level4LogicClass.OnCirclePoppedListener {
                    override fun onCirclePopped() { // When circle is popped
                        popSound.start() // Play sound
                        (activity as? Level4ActivityClass)?.incrementScore() // Increment score in activity
                    }
                }
            }
            ACTIVITY5 -> { // Level 5 setup
                binding.Level1Graphics.visibility = View.GONE // Hide Level 1 overlay
                binding.Level2Graphics.visibility = View.GONE // Hide Level 2 overlay
                binding.Level3Graphics.visibility = View.GONE // Hide Level 3 overlay
                binding.Level4Graphics.visibility = View.GONE // Hide Level 4 overlay
                binding.Level5Graphics.visibility = View.VISIBLE // Show Level 5 overlay
                binding.Level5Graphics.circlePoppedListener = object : Level5LogicClass.OnCirclePoppedListener {
                    override fun onCirclePopped() { // When circle is popped
                        popSound.start() // Play sound
                        (activity as? Level5ActivityClass)?.incrementScore() // Increment score in activity
                    }
                }
            }

            else -> throw IllegalStateException("Unknown activity source") // Handle invalid level
        }

        popSound.setOnCompletionListener {
            it.seekTo(0) // Reset sound to beginning for next play
        }
    }

    private fun updateOverlay(
        overlay: View, // Use View as the base type
        resultBundle: HandIdentifier.ResultBundle
    ) {
        when (overlay) {
            is Level1LogicClass -> { // Level 1 specific update
                overlay.setResults(
                    resultBundle.results.first(), // Hand landmark results
                    resultBundle.inputImageHeight, // Image height
                    resultBundle.inputImageWidth, // Image width
                    RunningMode.LIVE_STREAM // Running mode
                )
            }
            is Level2LogicClass -> { // Level 2 specific update
                overlay.setResults(
                    resultBundle.results.first(), // Hand landmark results
                    resultBundle.inputImageHeight, // Image height
                    resultBundle.inputImageWidth, // Image width
                    RunningMode.LIVE_STREAM // Running mode
                )
            }
            is Level3LogicClass -> { // Level 3 specific update
                overlay.setResults(
                    resultBundle.results.first(), // Hand landmark results
                    resultBundle.inputImageHeight, // Image height
                    resultBundle.inputImageWidth, // Image width
                    RunningMode.LIVE_STREAM // Running mode
                )
            }
            is Level4LogicClass -> { // Level 4 specific update
                overlay.setResults(
                    resultBundle.results.first(), // Hand landmark results
                    resultBundle.inputImageHeight, // Image height
                    resultBundle.inputImageWidth, // Image width
                    RunningMode.LIVE_STREAM // Running mode
                )
            }
            is Level5LogicClass -> { // Level 5 specific update
                overlay.setResults(
                    resultBundle.results.first(), // Hand landmark results
                    resultBundle.inputImageHeight, // Image height
                    resultBundle.inputImageWidth, // Image width
                    RunningMode.LIVE_STREAM // Running mode
                )
            }
        }
        overlay.invalidate() // Request redraw of the overlay
    }

    /* ================ Error Handling Section ================ 
     * Methods for handling and displaying errors to the user
     * Provides feedback when hand tracking fails
     */
    override fun onError(error: String) {
        activity?.runOnUiThread { // Update UI on main thread
            Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show() // Show error toast
        }
    }

    /* ================ Cleanup Section ================ 
     * Methods for resource management and cleanup
     * Ensures proper release of camera, executors, and media resources
     */
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig) // Call parent implementation
        imageAnalyzer?.targetRotation = binding.viewFinder.display.rotation // Update rotation
    }

    override fun onPause() {
        super.onPause() // Call parent implementation
        backgroundExecutor.execute { handLandmarkerHelper.clearHandLandmarker() } // Clean up ML resources
    }

    override fun onDestroyView() {
        _binding = null // Clear binding reference
        super.onDestroyView() // Call parent implementation
        backgroundExecutor.shutdown() // Shut down executor
        backgroundExecutor.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS) // Wait for shutdown
        popSound?.release() // Release media player
        popSound = null // Clear reference
    }
}