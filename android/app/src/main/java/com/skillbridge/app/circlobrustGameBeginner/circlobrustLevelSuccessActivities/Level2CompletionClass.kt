package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

// Imports for Android UI components, activity navigation, image loading, React Native bridge, and media playback
import android.app.Activity // For activity result handling
import android.content.Intent // For navigation between screens
import android.os.Bundle // For saved instance state
import android.widget.Button // For UI navigation buttons
import android.widget.ImageView // For displaying celebration animation
import androidx.appcompat.app.AppCompatActivity // Base activity class
import com.bumptech.glide.Glide // For loading and displaying GIFs
import com.facebook.react.bridge.Arguments // For creating React Native event data
import com.facebook.react.bridge.ReactApplicationContext // For React Native integration
import com.facebook.react.bridge.ReactContext // For React Native context access
import com.facebook.react.modules.core.DeviceEventManagerModule // For emitting events to React Native
import android.media.MediaPlayer // For audio playback
import com.skillbridge.app.circlobrustGameBeginner.MyNativeModules // Custom bridge to React Native
import com.skillbridge.app.R // App resources reference

/* ================ Activity Class Section ================ 
 * Level 2 completion activity that displays success screen
 * Shows celebration animation and provides navigation options
 * Handles sound effects and React Native communication
 */
class Level2CompletionClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for React context, game state tracking, and audio playback
     */
    private lateinit var reactContext: ReactApplicationContext // Context for React Native communication
    private var score = 0 // Player's final score
    private var LEVEL = 3 // Next level to navigate to
    private var mediaPlayerLoop: MediaPlayer? = null // Background celebration music
    private var mediaPlayerOnce: MediaPlayer? = null // One-time victory sound effect

    /* ================ Activity Lifecycle Section ================ 
     * Handles creation and destruction of the activity
     * Sets up UI elements and attaches event listeners
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        setContentView(R.layout.activity_level_2_complete) // Set the layout for this screen
        val continueButton = findViewById<Button>(R.id.continueButton) // Get reference to continue button
        val exitButton = findViewById<Button>(R.id.exitButton) // Get reference to exit button

        continueButton.setOnClickListener {
            emitNavigateToActivity3() // Signal React Native to navigate to Level 3
            finish() // Close this activity
        }

        exitButton.setOnClickListener {
            onBackPressed() // Handle back button behavior
            finish() // Close this activity
        }

        val gifView: ImageView = findViewById(R.id.gifViewlevel1) // Get reference to GIF container
        val gifUri = "android.resource://$packageName/${R.raw.star}" // Create URI for star animation

        Glide.with(this)
            .load(gifUri) // Load the celebration GIF
            .into(gifView) // Display in the ImageView

        playOneTimeSound(R.raw.win) // Play initial victory sound
        playLoopingSound(R.raw.win_loop) // Start looping celebration music
    }

    /* ================ Sound Management Section ================ 
     * Methods for controlling background music and victory sound effects
     * Handles both one-time and looping playback patterns
     */
    private fun playOneTimeSound(soundResId: Int) {
        mediaPlayerOnce = MediaPlayer.create(this, soundResId) // Initialize player with sound resource
        mediaPlayerOnce?.start() // Play the sound once
        mediaPlayerOnce?.setOnCompletionListener {
            it.release() // Release resources when sound finishes
        }
    }

    private fun playLoopingSound(soundResId: Int) {
        mediaPlayerLoop = MediaPlayer.create(this, soundResId) // Initialize player with music resource
        mediaPlayerLoop?.isLooping = true // Enable looping playback
        mediaPlayerLoop?.start() // Start playing
    }

    private fun stopLoopingSound() {
        mediaPlayerLoop?.stop() // Stop playback if active
        mediaPlayerLoop?.release() // Release resources
        mediaPlayerLoop = null // Clear reference
    }

}