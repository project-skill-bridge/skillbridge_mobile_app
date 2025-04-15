package com.skillbridge.application.circlobrustGameBeginner.circlobrustGameActivities

// Imports for Android components, UI management, media playback, coroutines, and game navigation
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.skillbridge.application.databinding.ActivityMainBinding
import com.skillbridge.application.circlobrustGameBeginner.circlobrustPanelScreens.CameraPanel
import kotlinx.coroutines.*
import java.text.DecimalFormat
import android.widget.Button
import android.view.WindowManager
import android.view.LayoutInflater
import androidx.appcompat.app.AlertDialog
import android.media.MediaPlayer
import com.skillbridge.application.circlobrustGameBeginner.circlobrustLevelSuccessActivities.Level4CompletionClass
import com.skillbridge.application.circlobrustGameBeginner.circlobrustLostActivities.Level4LostActivityClass
import com.skillbridge.application.circlobrustGameBeginner.circlobrustModule.CirclobrustBeginnerGameModule
import com.skillbridge.application.R


/* ================ Activity Class Section ================ 
 * Main game activity for Level 4 of the Circlobrust Game
 * Handles user interface, game mechanics, scoring, and level progression
 * Manages background music playback and game timers
 */
class Level4ActivityClass : AppCompatActivity() {
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
        private const val LEVEL = 4 // Current level identifier
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
                            goToLevel4LossActivity() // Fail level if music ends before target score reached
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace() // Log any media player errors
        }

        val fragment = CameraPanel.newInstance(CameraPanel.ACTIVITY4) // Create camera fragment for hand tracking
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

    /* ================ Utility Section ================ 
     * Helper methods for time calculation and string formatting
     */
    private fun parseTimeString(timeString: String): Pair<Int, Int> {
        return try {
            val parts = timeString.split(":") // Split time string into seconds and centiseconds
            val seconds = parts[0].toIntOrNull() ?: 0 // Extract seconds or use 0 if invalid
            val millisecondsPart = parts.getOrNull(1)?.toIntOrNull() ?: 0 // Extract centiseconds
            val milliseconds = millisecondsPart * 10 // Convert centiseconds to milliseconds
            Pair(seconds, milliseconds)
        } catch (e: Exception) {
            Pair(0, 0) // Return zeros if parsing fails
        }
    }

    /* ================ UI Update Section ================ 
     * Methods responsible for refreshing UI elements with current game data
     */
    private fun updateTimeInUi() {
        val secondsFormatted = DecimalFormat("00").format(timeInSeconds) // Format seconds with leading zeros
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10) // Format as centiseconds

        binding.timeTextView.text = "$secondsFormatted:$millisecondsFormatted" // Update timer display
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
                updateTimeInUi() // Refresh timer display
            }
        }
    }

    private fun startCountdownTimer() {
        countdownJob?.cancel() // Cancel any existing countdown
        val audioDurationMs = mediaPlayer?.duration?.toLong() ?: DEFAULT_AUDIO_DURATION_MS // Get music duration
        countdownJob = lifecycleScope.launch {
            delay(10_000) // 10-second grace period before score check

            val startTime = System.currentTimeMillis() // Track elapsed time
            while (System.currentTimeMillis() - startTime < audioDurationMs) {
                delay(10) // Check frequently but not too CPU intensive
            }

            if (score < 10 && !gameEnded) { // Check if target score not reached by time limit
                gameEnded = true
                goToLevel4LossActivity() // Navigate to failure screen
            }
        }
    }

    /* ================ Game Logic Section ================ 
     * Core game mechanics including score tracking and level completion
     */
    private fun checkScore() {
        if (score >= 10 && !gameEnded) { // Check if target score reached
            gameEnded = true
            countdownJob?.cancel() // Stop countdown when level completed
            goToLevel4CompleteActivity() // Navigate to success screen
        }
    }

    private fun goToLevel4CompleteActivity() {
        timerJob?.cancel() // Stop all timers
        countdownJob?.cancel()
        val intent = Intent(this, Level4CompletionClass::class.java) // Create intent for success screen
        startActivity(intent)
        finish() // Close current activity
    }

    private fun goToLevel4LossActivity() {
        timerJob?.cancel() // Stop all timers
        countdownJob?.cancel()
        val intent = Intent(this, Level4LostActivityClass::class.java).apply {
            putExtra("EXTRA_SCORE", score) // Pass final score to loss screen
        }
        startActivity(intent)
        finish() // Close current activity
    }

    fun incrementScore() {
        score++ // Increase score by 1
        runOnUiThread {
            binding.scoreTextView.text = "$score" // Update score on UI thread
        }
        checkScore() // Check if target score reached after increment
    }

    /* ================ User Interaction Section ================ 
     * Handling user input and navigation through the game
     */
    override fun onBackPressed() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_exit, null) // Create exit dialog

        val dialog = AlertDialog.Builder(this, R.style.CustomDialogTheme)
            .setView(dialogView)
            .create()

        dialogView.findViewById<Button>(R.id.btn_yes).setOnClickListener {
            val formattedTime = formatTimeToString() // Format current time for return value
            val audioPosition = mediaPlayer?.currentPosition ?: 0 // Save audio position for potential resume
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

        dialogView.findViewById<Button>(R.id.btn_no).setOnClickListener {
            dialog.dismiss() // Continue playing if user cancels exit
        }

        dialog.show() // Show the dialog

        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.8).toInt(), // Size dialog to 80% of screen width
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
                it.stop() // Stop playback if still active
            }
            it.release() // Release media player resources
        }
        mediaPlayer = null // Clear reference
        timerJob?.cancel() // Cancel timer coroutines
        countdownJob?.cancel()
    }
}