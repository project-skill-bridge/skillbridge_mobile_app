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
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities.Level2CompletionClass
import com.skillbridge.app.circlobrustGameBeginner.circlobrustLostActivities.Level2LostActivityClass
import  com.skillbridge.app.circlobrustGameBeginner.MyNativeModules
import com.skillbridge.app.R


/* ================ Activity Class Section ================ 
 * Main game activity for Level 2 of the Circlobrust Game
 * Handles user interface, game mechanics, scoring, and level progression
 * Manages background music playback and game timers
 */
class Level2ActivityClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Key variables for maintaining game state and UI components
     */
    private lateinit var binding: ActivityMainBinding
    private var mediaPlayer: MediaPlayer? = null

    private var score = 0
    private var timeInSeconds = 0
    private var milliseconds = 0
    private var timerJob: Job? = null
    private var countdownJob: Job? = null

    private var gameEnded = false

    /* ================ Constants Section ================ 
     * Configuration values for the game level
     */
    companion object {
        private const val LEVEL = 2
        private const val DEFAULT_AUDIO_DURATION_MS = 30000L // Fallback duration if media player fails
    }

    /* ================ Activity Lifecycle Section ================ 
     * Methods for controlling the activity lifecycle - creation, destruction
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val audioPosition = intent.getIntExtra("AUDIO_POSITION", 0) // Retrieve previous position if returning from another level

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.background_music).apply {
                isLooping = false
                seekTo(audioPosition) // Resume from previous position
                start()


                setOnCompletionListener { mp ->
                    lifecycleScope.launch {
                        if (score < 12 && !gameEnded) {
                            gameEnded = true
                            goToLevel2LossActivity() // End game if music ends and score target not reached
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val fragment = CameraPanel.newInstance(CameraPanel.ACTIVITY2)
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()

        binding.levelNumberView.text = "$LEVEL"


        score = intent.getIntExtra("INITIAL_SCORE", 0) // Restore previous score if coming from another activity
        val timeString = intent.getStringExtra("FORMATTED_TIME") ?: "00:00"
        val (seconds, millis) = parseTimeString(timeString)
        timeInSeconds = seconds
        milliseconds = millis

        updateScoreInUi()
        updateTimeInUi()

        startTimer()
        startCountdownTimer()

        binding.playButton.setOnClickListener {
            onBackPressed() // Show exit confirmation dialog
        }
    }

    /* ================ Utility Section ================ 
     * Helper methods for time calculation and string formatting
     */
    private fun parseTimeString(timeString: String): Pair<Int, Int> {
        return try {
            val parts = timeString.split(":")
            val seconds = parts[0].toIntOrNull() ?: 0
            val millisecondsPart = parts.getOrNull(1)?.toIntOrNull() ?: 0
            val milliseconds = millisecondsPart * 10 // Convert display value to actual milliseconds
            Pair(seconds, milliseconds)
        } catch (e: Exception) {
            Pair(0, 0) // Default values if parsing fails
        }
    }

    /* ================ UI Update Section ================ 
     * Methods responsible for refreshing UI elements with current game data
     */
    private fun updateTimeInUi() {

        val secondsFormatted = DecimalFormat("00").format(timeInSeconds)
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10) // Format as centiseconds for display


        binding.timeTextView.text = "$secondsFormatted:$millisecondsFormatted"
    }

    fun updateScoreInUi() {
        binding.scoreTextView.text = "$score"
    }

    /* ================ Timer Management Section ================ 
     * Handles time tracking and countdown for game progression
     */
    private fun startTimer() {
        timerJob?.cancel() // Cancel any existing timer
        timerJob = lifecycleScope.launch {
            while (isActive) {
                delay(10)
                milliseconds += 10
                if (milliseconds >= 1000) {
                    milliseconds = 0
                    timeInSeconds++
                }
                updateTimeInUi()
            }
        }
    }

    private fun startCountdownTimer() {
        countdownJob?.cancel() // Cancel any existing countdown
        val audioDurationMs = mediaPlayer?.duration?.toLong() ?: DEFAULT_AUDIO_DURATION_MS
        countdownJob = lifecycleScope.launch {

            delay(10_000) // 10-second grace period before checking score


            val startTime = System.currentTimeMillis()
            while (System.currentTimeMillis() - startTime < audioDurationMs) {
                delay(10)
            }


            if (score < 12 && !gameEnded) {
                gameEnded = true
                goToLevel2LossActivity() // Fail if target score not reached when time expires
            }
        }
    }

    /* ================ Game Logic Section ================ 
     * Core game mechanics including score tracking and level completion
     */
    private fun checkScore() {
        if (score >= 12 && !gameEnded) {
            gameEnded = true
            countdownJob?.cancel()
            goToLevel2CompleteActivity() // Success when target score is reached
        }
    }

    private fun goToLevel2CompleteActivity() {
        timerJob?.cancel()
        countdownJob?.cancel()
        val intent = Intent(this, Level2CompletionClass::class.java)
        startActivity(intent)
        finish()
    }

    private fun goToLevel2LossActivity() {
        timerJob?.cancel()
        countdownJob?.cancel()
        val intent = Intent(this, Level2LostActivityClass::class.java).apply {
            putExtra("EXTRA_SCORE", score) // Pass final score to loss screen
        }
        startActivity(intent)
        finish()
    }

    fun incrementScore() {
        score++
        runOnUiThread {
            binding.scoreTextView.text = "$score"
        }
        checkScore() // Check if target score reached after each increment
    }

    /* ================ User Interaction Section ================ 
     * Handling user input and navigation through the game
     */
    override fun onBackPressed() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_exit, null)

        val dialog = AlertDialog.Builder(this, R.style.CustomDialogTheme)
            .setView(dialogView)
            .create()


        dialogView.findViewById<Button>(R.id.btn_yes).setOnClickListener {
            val formattedTime = formatTimeToString()
            val audioPosition = mediaPlayer?.currentPosition ?: 0
            val intent = Intent().apply {
                putExtra("FINAL_SCORE", score)
                putExtra("LEVEL", LEVEL)
                putExtra("FORMATTED_TIME", formattedTime)
                putExtra("AUDIO_POSITION", audioPosition) // Save audio position for potential resume
            }
            setResult(RESULT_OK, intent)
            MyNativeModules.getInstance()?.emitActivity2Result(score, LEVEL, formattedTime, audioPosition)
            finish()
            dialog.dismiss()
        }


        dialogView.findViewById<Button>(R.id.btn_no).setOnClickListener {
            dialog.dismiss() // Continue playing if user cancels exit
        }


        dialog.show()


        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.8).toInt(), // Size dialog to 80% of screen width
            WindowManager.LayoutParams.WRAP_CONTENT
        )
    }

    private fun formatTimeToString(): String {
        val secondsFormatted = DecimalFormat("00").format(timeInSeconds)
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10)
        return "$secondsFormatted:$millisecondsFormatted"
    }

}