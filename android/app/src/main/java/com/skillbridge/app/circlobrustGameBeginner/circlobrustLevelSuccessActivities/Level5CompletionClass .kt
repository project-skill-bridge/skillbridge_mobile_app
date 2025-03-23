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

}