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
import com.skillbridge.app.databinding.ActivityLevel3LossBinding // View binding for layout
import com.skillbridge.app.circlobrustGameBeginner.MyNativeModules // Custom bridge to React Native
import com.skillbridge.app.R // App resources reference

/* ================ Activity Class Section ================ 
 * Level 3 failure activity that displays defeat screen
 * Shows sad animation and provides retry or exit options
 * Handles sound effects and score display
 */
class Level3LostActivityClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for view binding, game state tracking, and audio playback
     */
    private lateinit var binding: ActivityLevel3LossBinding // View binding for accessing UI elements
    val audioPosition = 0 // Initial audio position
    val formattedTime = "00:00" // Default time display format
    private var score = 0 // Player's final score (should be low on lost screen)
    private var LEVEL = 3 // Current level reference
    private var mediaPlayerLoop: MediaPlayer? = null // For looping background music
    private var mediaPlayerOnce: MediaPlayer? = null // For one-time defeat sound

    /* ================ Activity Lifecycle Section ================ 
     * Handles creation and setup of the activity
     * Initializes UI elements and attaches event listeners
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        binding = ActivityLevel3LossBinding.inflate(layoutInflater) // Initialize view binding
        setContentView(binding.root) // Set the content view using binding

        score = intent.getIntExtra("EXTRA_SCORE", 0) // Get score from intent

        val tryAgainButton = findViewById<Button>(R.id.tryAgainButton) // Reference to retry button
        val homeButton = findViewById<Button>(R.id.homeButton) // Reference to home button

        tryAgainButton.setOnClickListener {
            val intent = Intent() // Create new intent
            intent.putExtra("FINAL_SCORE", 0) // Reset score
            intent.putExtra("LEVEL", 1) // Set level to retry
            intent.putExtra("FORMATTED_TIME", "00:00") // Reset timer
            intent.putExtra("AUDIO_POSITION", 0) // Reset audio position

            // Set result and finish
            setResult(RESULT_OK, intent) // Set result for calling activity
            MyNativeModules.getInstance()?.emitActivity1Result(0, 3, "00:00", 0) // Signal React Native
            finish() // Close this activity
        }

        homeButton.setOnClickListener {
            onBackPressed() // Handle back button behavior
            finish() // Close this activity
        }

        val gifViewloss: ImageView = findViewById(R.id.gifViewlevelloss) // Reference to GIF container
        val gifUriloss = "android.resource://$packageName/${R.raw.loose}" // Create URI for loss animation


        updateScoreInUi() // Update score display

        Glide.with(this)
            .load(gifUriloss) // Load the loss animation GIF
            .into(gifViewloss) // Display in the ImageView


        playOneTimeSound(R.raw.loss) // Play initial defeat sound
        playLoopingSound(R.raw.loss_loop) // Start looping sad music

    }

    /* ================ Sound Management Section ================ 
     * Methods for controlling background music and defeat sound effects
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

    /* ================ UI Update Section ================ 
     * Methods for refreshing UI elements with current game data
     * Displays final score on the loss screen
     */
    fun updateScoreInUi() {
        binding.score.text = "$score" // Display score value in TextView
    }

}