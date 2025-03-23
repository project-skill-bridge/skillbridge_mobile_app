package com.skillbridge.app.circlobrustGameBeginner.circlobrustLevelSuccessActivities

// Imports for Android UI components, activity navigation, image loading, React Native bridge, and media playback
import android.app.Activity // For activity result handling
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
 * Level 4 completion activity that displays success screen
 * Shows celebration animation and provides navigation options
 * Handles sound effects and React Native communication
 */
class Level4CompletionClass : AppCompatActivity() {
    /* ================ Properties Section ================ 
     * Variables for React context, game state tracking, and audio playback
     */
    private lateinit var reactContext: ReactApplicationContext // For React Native communication
    private var score = 0 // Player's final score
    private var LEVEL = 5 // Next level to navigate to
    private var mediaPlayerLoop: MediaPlayer? = null // For looping background music
    private var mediaPlayerOnce: MediaPlayer? = null // For one-time victory sound

    /* ================ Activity Lifecycle Section ================ 
     * Handles creation and destruction of the activity
     * Sets up UI elements and attaches event listeners
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) // Call parent implementation
        setContentView(R.layout.activity_level_4_complete) // Set the layout for this screen
        val continueButton = findViewById<Button>(R.id.continueButton) // Get reference to continue button
        val exitButton = findViewById<Button>(R.id.exitButton) // Get reference to exit button

        continueButton.setOnClickListener {
            emitNavigateToActivity5() // Signal React Native to navigate to Level 5
            finish() // Close this activity
        }

        exitButton.setOnClickListener {
            onBackPressed() // Handle back button behavior
            finish() // Close this activity
        }

}