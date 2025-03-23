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
import  com.skillbridge.app.circlobrustGameBeginner.MyNativeModules
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
        private const val LEVEL = 1
        private const val DEFAULT_AUDIO_DURATION_MS = 30000L
    }


    /* ================ Activity Lifecycle Section ================ 
     * Methods for controlling the activity lifecycle - creation, destruction
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val audioPosition = intent.getIntExtra("AUDIO_POSITION", 0)

        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.background_music).apply {
                isLooping = false
                seekTo(audioPosition)
                start()

                setOnCompletionListener { mp ->
                    lifecycleScope.launch {
                        if (!gameEnded) {
                            gameEnded = true
                            if (score < 15) goToLevel1LossActivity()
                            else goToLevel1CompleteActivity()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        val fragment = CameraPanel.newInstance(CameraPanel.ACTIVITY1)
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()

        binding.levelNumberView.text = "$LEVEL"


        score = intent.getIntExtra("INITIAL_SCORE", 0)
        val timeString = intent.getStringExtra("FORMATTED_TIME") ?: "00:00"
        val (seconds, millis) = parseTimeString(timeString)
        timeInSeconds = seconds
        milliseconds = millis

        updateScoreInUi()
        updateTimeInUi()

        startTimer()
        startCountdownTimer()

        binding.playButton.setOnClickListener {
            onBackPressed()
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
            val milliseconds = millisecondsPart * 10
            Pair(seconds, milliseconds)
        } catch (e: Exception) {
            Pair(0, 0)
        }
    }


     /* ================ UI Update Section ================ 
     * Methods responsible for refreshing UI elements with current game data
     */
    private fun updateTimeInUi() {

        val secondsFormatted = DecimalFormat("00").format(timeInSeconds)
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10)


        binding.timeTextView.text = "$secondsFormatted:$millisecondsFormatted"
    }

    fun updateScoreInUi() {
        binding.scoreTextView.text = "$score"
    }

    /* ================ Timer Management Section ================ 
     * Handles time tracking and countdown for game progression
     */
    private fun startTimer() {
        timerJob?.cancel()
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
        countdownJob?.cancel()
        val audioDurationMs = mediaPlayer?.duration?.toLong() ?: DEFAULT_AUDIO_DURATION_MS
        countdownJob = lifecycleScope.launch {

            delay(10_000)


            val startTime = System.currentTimeMillis()
            while (System.currentTimeMillis() - startTime < audioDurationMs) {
                delay(10)
            }

            if (!gameEnded) {
                gameEnded = true
                if (score < 15) {
                    goToLevel1LossActivity()
                } else {
                    goToLevel1CompleteActivity()
                }
            }
        }
    }

    /* ================ Game Logic Section ================ 
     * Core game mechanics including score tracking and level completion
     */
    private fun checkScore() {
        if (score >= 15 && !gameEnded) {
            gameEnded = true
            countdownJob?.cancel()
            goToLevel1CompleteActivity()
        }
    }

    private fun goToLevel1CompleteActivity() {
        timerJob?.cancel()
        countdownJob?.cancel()
        val intent = Intent(this, Level1CompletionClass::class.java)
        startActivity(intent)
        finish()
    }

    private fun goToLevel1LossActivity() {
        timerJob?.cancel()
        countdownJob?.cancel()
        val intent = Intent(this, Level1LostActivityClass::class.java).apply {
            putExtra("EXTRA_SCORE", score)
        }
        startActivity(intent)
        finish()
    }

    fun incrementScore() {
        score++
        runOnUiThread {
            binding.scoreTextView.text = "$score"
        }
        checkScore()
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
                putExtra("AUDIO_POSITION", audioPosition)
            }
            setResult(RESULT_OK, intent)
            MyNativeModules.getInstance()?.emitActivity2Result(score, LEVEL, formattedTime, audioPosition)
            finish()
            dialog.dismiss()
        }


        dialogView.findViewById<Button>(R.id.btn_no).setOnClickListener {
            dialog.dismiss()
        }


        dialog.show()


        dialog.window?.setLayout(
            (resources.displayMetrics.widthPixels * 0.8).toInt(),
            WindowManager.LayoutParams.WRAP_CONTENT
        )
    }

    private fun formatTimeToString(): String {
        val secondsFormatted = DecimalFormat("00").format(timeInSeconds)
        val millisecondsFormatted = DecimalFormat("00").format(milliseconds / 10)
        return "$secondsFormatted:$millisecondsFormatted"
    }


     /* ================ Cleanup Section ================ 
     * Resource management and proper disposal of system resources
     */
    override fun onDestroy() {
        super.onDestroy()

        mediaPlayer?.let {
            if (it.isPlaying) {
                it.stop()
            }
            it.release()
        }
        mediaPlayer = null
        timerJob?.cancel()
        countdownJob?.cancel()
    }
}





