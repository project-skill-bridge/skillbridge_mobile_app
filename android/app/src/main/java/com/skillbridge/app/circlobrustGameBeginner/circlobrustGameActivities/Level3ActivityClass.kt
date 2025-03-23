package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities

// Imports for Android components, UI elements, media playback, coroutines and navigation functionality
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.skillbridge.app.databinding.ActivityMainBinding
import com.skillbridge.app.circlobrustGameBeginner.circlobrustPanelScreens.CameraPanel
import kotlinx.coroutines.*
import java.text.DecimalFormat
import android.widget.Button
import android.view.WindowManager
import android.view.LayoutInflater
import androidx.appcompat.app.AlertDialog
import android.media.MediaPlayer
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities.Level3CompletionClass
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLostActivities.Level3LostActivityClass
import com.skillbridge.app.circlobrustGameBeginner.MyNativeModules
import com.skillbridge.app.R

/* ================ Activity Class Section ================ 
 * Main game activity for Level 3 of the Circlobrust Game
 * Handles user interface, game mechanics, scoring, and level progression
 * Manages background music playback and game timers
 */
class Level3ActivityClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Key variables for maintaining game state and UI components
     */
    private lateinit var binding: ActivityMainBinding // View binding for accessing UI elements
    private var mediaPlayer: MediaPlayer? = null // Background music player

    private var score = 0 // Tracks player's current score
    private var timeInSeconds = 0 // Game timer - seconds component
    private var milliseconds = 0 // Game timer - milliseconds component
    private var timerJob: Job? = null // Coroutine job for game timer
    private var countdownJob: Job? = null // Coroutine job for level countdown

    private var gameEnded = false // Flag to prevent multiple game over triggers

    /* ================ Constants Section ================ 
     * Configuration values for the game level
     */
    companion object {
        private const val LEVEL = 3 // Current level identifier
        private const val DEFAULT_AUDIO_DURATION_MS = 30000L // Default time limit if audio loading fails
    }

    /* ================ Activity Lifecycle Section ================ 
     * Methods for controlling the activity lifecycle - creation, destruction
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val audioPosition = intent.getIntExtra("AUDIO_POSITION", 0) // Resume audio from saved position

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.background_music).apply {
                isLooping = false // Music plays only once for time limit
                seekTo(audioPosition) // Start from previous position if returning
                start()

                setOnCompletionListener { mp ->
                    lifecycleScope.launch {
                        if (score < 10 && !gameEnded) {
                            gameEnded = true
                            goToLevel3LossActivity() // Fail level if music ends before target score reached
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace() // Log any media player errors
        }

        val fragment = CameraPanel.newInstance(CameraPanel.ACTIVITY3) // Create camera fragment for hand tracking
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()

        binding.levelNumberView.text = "$LEVEL" // Display level number in UI

        score = intent.getIntExtra("INITIAL_SCORE", 0) // Get score from previous state if available
        val timeString = intent.getStringExtra("FORMATTED_TIME") ?: "00:00" // Get time from previous state
        val (seconds, millis) = parseTimeString(timeString) // Parse saved time string
        timeInSeconds = seconds
        milliseconds = millis

        updateScoreInUi() // Initialize score display
        updateTimeInUi() // Initialize timer display

        startTimer() // Start the gameplay timer
        startCountdownTimer() // Start the level countdown

        binding.playButton.setOnClickListener {
            onBackPressed() // Show exit confirmation dialog when back button pressed
        }
    }

