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

