package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameActivities

// Imports for Android components, UI management, media playback, coroutines, and game navigation
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
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities.Level1CompletionClass
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLostActivities.Level1LostActivityClass
import  com.skillbridge.app.circlobrustGameBeginner.circlobrustModule.CirclobrustBeginnerGameModule
import com.skillbridge.app.R


/* ================ Activity Class Section ================ 
 * Main game activity for Level 1 of the Circlobrust Game
 * Handles user interface, game mechanics, scoring, and level progression
 * Manages background music playback and game timers
 */
class Level1ActivityClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Key variables for maintaining game state and UI components
     */
    private lateinit var binding: ActivityMainBinding // View binding for UI access
    private var mediaPlayer: MediaPlayer? = null // Background music player

    private var score = 0 // Player's current score
    private var timeInSeconds = 0 // Time tracking - seconds part
    private var milliseconds = 0 // Time tracking - milliseconds part
    private var timerJob: Job? = null // Coroutine for game timer
    private var countdownJob: Job? = null // Coroutine for level countdown

    private var gameEnded = false // Flag to prevent duplicate game-over events

    /* ================ Constants Section ================ 
     * Configuration values for the game level
     */
    companion object {
        private const val LEVEL = 1 // Current level identifier
        private const val DEFAULT_AUDIO_DURATION_MS = 30000L // Fallback duration for music
    }

    /* ================ Activity Lifecycle Section ================ 
     * Methods for controlling the activity lifecycle - creation, destruction
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val audioPosition = intent.getIntExtra("AUDIO_POSITION", 0) // Get saved audio position

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.background_music).apply {
                isLooping = false // Play music only once
                seekTo(audioPosition) // Resume from previous position
                start()

                setOnCompletionListener { mp ->
                    lifecycleScope.launch {
                        if (!gameEnded) {
                            gameEnded = true
                            if (score < 10) goToLevel1LossActivity() // Fail if score too low
                            else goToLevel1CompleteActivity() // Success otherwise
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace() // Log any media player errors
        }

        val fragment = CameraPanel.newInstance(CameraPanel.ACTIVITY1) // Initialize camera for hand tracking
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()

        binding.levelNumberView.text = "$LEVEL" // Display level number

        // Restore game state if returning from another activity
        score = intent.getIntExtra("INITIAL_SCORE", 0) // Get saved score
        val timeString = intent.getStringExtra("FORMATTED_TIME") ?: "00:00" // Get saved time
        val (seconds, millis) = parseTimeString(timeString) // Parse time components
        timeInSeconds = seconds
        milliseconds = millis

        updateScoreInUi() // Initialize score display
        updateTimeInUi() // Initialize timer display

        startTimer() // Begin tracking time
        startCountdownTimer() // Start level timer

        binding.playButton.setOnClickListener {
            onBackPressed() // Show exit dialog when button pressed
        }
    }

    /* ================ Utility Section ================ 
     * Helper methods for time calculation and string formatting
     */
    private fun parseTimeString(timeString: String): Pair<Int, Int> {
        return try {
            val parts = timeString.split(":") // Split into seconds and centiseconds
            val seconds = parts[0].toIntOrNull() ?: 0 // Parse seconds
            val millisecondsPart = parts.getOrNull(1)?.toIntOrNull() ?: 0 // Parse centiseconds
            val milliseconds = millisecondsPart * 10 // Convert to milliseconds
            Pair(seconds, milliseconds)
        } catch (e: Exception) {
            Pair(0, 0) // Default values on error
        }
    }

    /* ================ UI Update Section ================ 
     * Methods responsible for refreshing UI elements with current game data
     */
    private fun updateTimeInUi() {
        // Format time components with leading zeros
        val secondsFormatted = DecimalFormat("00").format(timeInSeconds)
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10)

        // Display formatted time
        binding.timeTextView.text = "$secondsFormatted:$millisecondsFormatted"
    }

    fun updateScoreInUi() {
        binding.scoreTextView.text = "$score" // Update score display
    }

    /* ================ Timer Management Section ================ 
     * Handles time tracking and countdown for game progression
     */
    private fun startTimer() {
        timerJob?.cancel() // Cancel any existing timer
        timerJob = lifecycleScope.launch {
            while (isActive) {
                delay(10) // Update every 10ms for smooth timing
                milliseconds += 10
                if (milliseconds >= 1000) { // Roll over milliseconds to seconds
                    milliseconds = 0
                    timeInSeconds++
                }
                updateTimeInUi() // Update timer display
            }
        }
    }

    private fun startCountdownTimer() {
        countdownJob?.cancel() // Cancel any existing countdown
        val audioDurationMs = mediaPlayer?.duration?.toLong() ?: DEFAULT_AUDIO_DURATION_MS // Get music duration
        countdownJob = lifecycleScope.launch {
            delay(10_000) // 10-second grace period before checking score

            val startTime = System.currentTimeMillis() // Track elapsed time
            while (System.currentTimeMillis() - startTime < audioDurationMs) {
                delay(10) // Check time frequently but efficiently
            }

            if (!gameEnded) {
                gameEnded = true
                if (score < 10) {
                    goToLevel1LossActivity() // Fail if score too low
                } else {
                    goToLevel1CompleteActivity() // Success if score high enough
                }
            }
        }
    }

    /* ================ Game Logic Section ================ 
     * Core game mechanics including score tracking and level completion
     */
    private fun checkScore() {
        if (score >= 10 && !gameEnded) { // Check for target score
            gameEnded = true
            countdownJob?.cancel() // Stop countdown on success
            goToLevel1CompleteActivity() // Navigate to success screen
        }
    }

    private fun goToLevel1CompleteActivity() {
        timerJob?.cancel() // Stop all timers
        countdownJob?.cancel()
        val intent = Intent(this, Level1CompletionClass::class.java) // Create success screen intent
        startActivity(intent)
        finish() // Close current activity
    }

    private fun goToLevel1LossActivity() {
        timerJob?.cancel() // Stop all timers
        countdownJob?.cancel()
        val intent = Intent(this, Level1LostActivityClass::class.java).apply {
            putExtra("EXTRA_SCORE", score) // Pass final score to loss screen
        }
        startActivity(intent)
        finish() // Close current activity
    }

    fun incrementScore() {
        score++ // Increase score by 1
        runOnUiThread {
            binding.scoreTextView.text = "$score" // Update score display
        }
        checkScore() // Check if target score reached
    }

    /* ================ User Interaction Section ================ 
     * Handling user input and navigation through the game
     */
    override fun onBackPressed() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_exit, null) // Create exit dialog

        val dialog = AlertDialog.Builder(this, R.style.CustomDialogTheme)
            .setView(dialogView)
            .create()

        // Set up "Yes" button to exit level
        dialogView.findViewById<Button>(R.id.btn_yes).setOnClickListener {
            val formattedTime = formatTimeToString() // Format current time
            val audioPosition = mediaPlayer?.currentPosition ?: 0 // Save audio position
            val intent = Intent().apply {
                putExtra("FINAL_SCORE", score) // Return final score
                putExtra("LEVEL", LEVEL) // Return level info
                putExtra("FORMATTED_TIME", formattedTime) // Return formatted time
                putExtra("AUDIO_POSITION", audioPosition) // Return audio position
            }
            setResult(RESULT_OK, intent)
            CirclobrustBeginnerGameModule.getInstance()?.emitActivity2Result(score, LEVEL, formattedTime, audioPosition) // Signal to React Native
            finish()
            dialog.dismiss() // Close dialog
        }

        // Set up "No" button to continue playing
        dialogView.findViewById<Button>(R.id.btn_no).setOnClickListener {
            dialog.dismiss() // Dismiss dialog and continue game
        }

        // Show the exit confirmation dialog
        dialog.show()

        // Resize dialog to fit nicely on screen
        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.8).toInt(), // 80% of screen width
            WindowManager.LayoutParams.WRAP_CONTENT
        )
    }

    private fun formatTimeToString(): String {
        val secondsFormatted = DecimalFormat("00").format(timeInSeconds) // Format seconds with leading zeros
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10) // Format as centiseconds
        return "$secondsFormatted:$millisecondsFormatted" // Return formatted time string
    }

    /* ================ Cleanup Section ================ 
     * Resource management and proper disposal of system resources
     */
    override fun onDestroy() {
        super.onDestroy()

        mediaPlayer?.let {
            if (it.isPlaying) {
                it.stop() // Stop playback if active
            }
            it.release() // Release media player resources
        }
        mediaPlayer = null // Clear reference
        timerJob?.cancel() // Cancel timer coroutines
        countdownJob?.cancel()
    }
}