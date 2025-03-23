package com.skillbridge.app.circlobrustGameBeginner.circlobrustLostActivities

// Imports for Android UI components, activity navigation, image loading, media playback and React Native bridge
import android.content.Intent // For navigation between activities
import android.os.Bundle // For saved instance state handling
import android.os.Handler // For delayed execution
import android.os.Looper // For executing on main thread
import android.widget.Button // For UI navigation buttons
import android.widget.ImageView // For displaying loss animation
import androidx.appcompat.app.AppCompatActivity // Base activity class
import com.bumptech.glide.Glide // Library for GIF loading
import android.media.MediaPlayer // For audio playback
import com.skillbridge.app.databinding.ActivityLevel5LossBinding // View binding for layout
import com.skillbridge.app.circlobrustGameBeginner.MyNativeModules // Custom bridge to React Native
import com.skillbridge.app.R // App resources reference

/* ================ Activity Class Section ================ 
 * Level 5 failure activity that displays defeat screen
 * Shows sad animation and provides retry or exit options
 * Handles sound effects and score display
 */
class Level5LostActivityClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for view binding, game state tracking, and audio playback
     */
    private lateinit var binding: ActivityLevel5LossBinding // View binding for accessing UI elements
    val audioPosition = 0 // Initial audio position
    val formattedTime = "00:00" // Default time display format
    private var score = 0 // Player's final score (should be low on lost screen)
    private var LEVEL = 5 // Current level reference
    private var mediaPlayerLoop: MediaPlayer? = null // For looping background music
    private var mediaPlayerOnce: MediaPlayer? = null // For one-time defeat sound

    /* ================ Activity Lifecycle Section ================ 
     * Handles creation and setup of the activity
     * Initializes UI elements and attaches event listeners
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        binding = ActivityLevel5LossBinding.inflate(layoutInflater) // Initialize view binding
        setContentView(binding.root) // Set the content view using binding

        score = intent.getIntExtra("EXTRA_SCORE", 0) // Get score from intent

}