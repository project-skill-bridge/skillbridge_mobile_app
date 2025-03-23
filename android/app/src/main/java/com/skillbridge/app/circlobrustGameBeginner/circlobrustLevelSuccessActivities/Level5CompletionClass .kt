package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

// Imports for Android UI components, activity navigation, image loading, React Native bridge, and media playback
import android.app.Activity // For handling activity results
import android.content.Intent // For navigation between screens
import android.os.Bundle // For lifecycle state management
import android.widget.Button // For UI button controls
import android.widget.ImageView // For displaying celebration animations
import androidx.appcompat.app.AppCompatActivity // Base activity class
import com.bumptech.glide.Glide // Library for GIF loading
import com.facebook.react.bridge.Arguments // For creating React Native event data
import com.facebook.react.bridge.ReactApplicationContext // For React Native communication
import com.facebook.react.bridge.ReactContext // For React Native context access
import com.facebook.react.modules.core.DeviceEventManagerModule // For emitting events to React Native
import android.media.MediaPlayer // For audio playback
import com.skillbridge.app.circlobrustGameBeginner.MyNativeModules // Custom bridge to React Native
import com.skillbridge.app.R // App resources reference

/* ================ Activity Class Section ================ 
 * Level 5 completion activity that displays success screen
 * Shows celebration animation and provides navigation options
 * Handles sound effects and React Native communication
 */
class Level5CompletionClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for React context, game state tracking, and audio playback
     */
    private lateinit var reactContext: ReactApplicationContext // For React Native communication
    private var score = 0 // Player's final score
    private var LEVEL = 1 // Return to level 1 (game complete, cycle back)
    private var mediaPlayerLoop: MediaPlayer? = null // For looping background music
    private var mediaPlayerOnce: MediaPlayer? = null // For one-time victory sound

    /* ================ Activity Lifecycle Section ================ 
     * Handles creation and destruction of the activity
     * Sets up UI elements and attaches event listeners
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        setContentView(R.layout.activity_level_5_complete) // Set the layout for this screen
        val BackToHome = findViewById<Button>(R.id.BackToHome) // Get reference to home button

        BackToHome.setOnClickListener {
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

}